import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface PixChargeRequest {
  amount: number;
  description?: string;
  expiresIn?: number;
  customer?: {
    name: string;
    email: string;
    taxId: string;
    cellphone?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ABACATEPAY_API_KEY = Deno.env.get('ABACATEPAY_API_KEY');
    
    if (!ABACATEPAY_API_KEY) {
      throw new Error('AbacatePay API Key não configurada');
    }

    const { amount, description, expiresIn, customer }: PixChargeRequest = await req.json();

    if (!amount || amount <= 0) {
      throw new Error('Valor inválido');
    }

    // Create PIX charge via AbacatePay API
    const pixResponse = await fetch('https://api.abacatepay.com/v1/pixQrCode/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ABACATEPAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Amount in cents
        description: description || 'Pagamento via PIX',
        expiresIn: expiresIn || 3600, // Default 1 hour
        ...(customer && {
          customer: {
            name: customer.name,
            email: customer.email,
            taxId: customer.taxId.replace(/\D/g, ''),
            cellphone: customer.cellphone?.replace(/\D/g, '') || '',
          },
        }),
      }),
    });

    const pixData = await pixResponse.json();

    if (!pixResponse.ok) {
      console.error('AbacatePay PIX error:', pixData);
      throw new Error(pixData.error || 'Erro ao criar cobrança PIX');
    }

    return new Response(JSON.stringify({
      success: true,
      pix: pixData,
      qrcodeUrl: pixData.qrcodeImageUrl,
      brcode: pixData.brcode,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('PIX charge error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Erro interno do servidor',
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
