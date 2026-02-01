import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-webhook-signature',
};

interface WebhookPayload {
  event: string;
  data: {
    id: string;
    status: string;
    amount?: number;
    paidAt?: string;
    billing?: {
      id: string;
      status: string;
    };
  };
}

async function verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(payload)
    );
    
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return signature === expectedSignature || signature === `sha256=${expectedSignature}`;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const WEBHOOK_SECRET = Deno.env.get('ABACATEPAY_WEBHOOK_SECRET');

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get raw body for signature verification
    const rawBody = await req.text();
    
    // Handle empty body (health checks, etc.)
    if (!rawBody) {
      return new Response(JSON.stringify({ success: true, message: 'OK' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify signature if secret is configured
    if (WEBHOOK_SECRET) {
      const signature = req.headers.get('x-webhook-signature') || 
                        req.headers.get('x-signature') ||
                        req.headers.get('x-abacatepay-signature') || '';
      
      if (signature) {
        const isValid = await verifySignature(rawBody, signature, WEBHOOK_SECRET);
        if (!isValid) {
          console.error('Invalid webhook signature');
          return new Response(JSON.stringify({ error: 'Invalid signature' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        console.log('Webhook signature verified successfully');
      }
    }

    const payload: WebhookPayload = JSON.parse(rawBody);
    
    console.log('Webhook received:', JSON.stringify(payload, null, 2));

    // Extract payment ID and status from the webhook payload
    const paymentId = payload.data?.billing?.id || payload.data?.id;
    const eventType = payload.event;

    if (!paymentId) {
      console.log('No payment ID found in webhook payload');
      return new Response(JSON.stringify({ success: true, message: 'No payment ID' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Map AbacatePay events to our payment status
    let newStatus: string | null = null;
    
    switch (eventType) {
      case 'billing.paid':
      case 'BILLING_PAID':
        newStatus = 'paid';
        break;
      case 'billing.expired':
      case 'BILLING_EXPIRED':
        newStatus = 'expired';
        break;
      case 'billing.cancelled':
      case 'BILLING_CANCELLED':
        newStatus = 'cancelled';
        break;
      case 'billing.refunded':
      case 'BILLING_REFUNDED':
        newStatus = 'refunded';
        break;
      case 'billing.created':
      case 'BILLING_CREATED':
        newStatus = 'pending';
        break;
      default:
        console.log('Unknown event type:', eventType);
    }

    if (newStatus) {
      // Update order status in database
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          payment_status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('payment_id', paymentId)
        .select();

      if (error) {
        console.error('Error updating order:', error);
        throw new Error(`Failed to update order: ${error.message}`);
      }

      console.log('Order updated:', data);

      return new Response(JSON.stringify({
        success: true,
        message: `Order status updated to ${newStatus}`,
        orderId: data?.[0]?.id,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Webhook processed',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
