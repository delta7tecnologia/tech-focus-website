import { supabase } from '@/integrations/supabase/client';
import type { LicenseDraft, AssetLicense } from '@/lib/licenseCatalog';

export const fetchAssetLicenses = async (assetIds: string[]): Promise<Record<string, AssetLicense[]>> => {
  if (assetIds.length === 0) return {};
  const { data, error } = await supabase
    .from('asset_licenses')
    .select('*')
    .in('asset_id', assetIds)
    .order('category', { ascending: true });
  if (error) throw error;
  const grouped: Record<string, AssetLicense[]> = {};
  (data || []).forEach((l: any) => {
    if (!grouped[l.asset_id]) grouped[l.asset_id] = [];
    grouped[l.asset_id].push(l as AssetLicense);
  });
  return grouped;
};

export const licensesToDrafts = (licenses: AssetLicense[]): LicenseDraft[] =>
  licenses.map((l) => ({
    id: l.id,
    category: l.category,
    product: l.product,
    edition: l.edition || '',
    license_key: l.license_key || '',
    activation_date: l.activation_date || '',
    notes: l.notes || '',
  }));

/**
 * Sincroniza licenças de um asset: deleta todas e reinsere.
 * Simples e seguro para um cadastro com poucas linhas por máquina.
 */
export const syncAssetLicenses = async (
  assetId: string,
  drafts: LicenseDraft[],
  userId: string
): Promise<void> => {
  const { error: delErr } = await supabase
    .from('asset_licenses')
    .delete()
    .eq('asset_id', assetId);
  if (delErr) throw delErr;

  const valid = drafts.filter((d) => d.category && d.product.trim());
  if (valid.length === 0) return;

  const payload = valid.map((d) => ({
    asset_id: assetId,
    category: d.category,
    product: d.product.trim(),
    edition: d.edition.trim() || null,
    license_key: d.license_key.trim() || null,
    activation_date: d.activation_date || null,
    notes: d.notes.trim() || null,
    created_by: userId,
  }));

  const { error: insErr } = await supabase.from('asset_licenses').insert(payload);
  if (insErr) throw insErr;
};
