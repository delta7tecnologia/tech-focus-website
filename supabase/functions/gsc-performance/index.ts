import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console/webmasters/v3";
const SITE_URL = "https://delta7tecnologia.com.br/";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GSC_KEY = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    if (!GSC_KEY) throw new Error("GOOGLE_SEARCH_CONSOLE_API_KEY missing");

    // Auth: only admins
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!roleRow) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const url = new URL(req.url);
    const days = Math.min(parseInt(url.searchParams.get("days") || "28"), 90);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const fmt = (d: Date) => d.toISOString().split("T")[0];

    const callGsc = async (dimensions: string[]) => {
      const r = await fetch(
        `${GATEWAY}/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": GSC_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: fmt(startDate),
            endDate: fmt(endDate),
            dimensions,
            rowLimit: dimensions.includes("date") ? days + 1 : 25,
          }),
        }
      );
      if (!r.ok) throw new Error(`GSC ${r.status}: ${await r.text()}`);
      return await r.json();
    };

    const [totals, byDate, byQuery, byPage] = await Promise.all([
      callGsc([]),
      callGsc(["date"]),
      callGsc(["query"]),
      callGsc(["page"]),
    ]);

    return new Response(
      JSON.stringify({
        range: { startDate: fmt(startDate), endDate: fmt(endDate), days },
        totals: totals.rows?.[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 },
        byDate: byDate.rows ?? [],
        byQuery: byQuery.rows ?? [],
        byPage: byPage.rows ?? [],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("gsc-performance error:", msg);
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
