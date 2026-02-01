import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const payload: WebhookPayload = await req.json();
    
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
