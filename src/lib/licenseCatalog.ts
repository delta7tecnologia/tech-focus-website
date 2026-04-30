// Catálogo de produtos comercializados pela Delta7 para cadastro de licenças em patrimônios.

export type LicenseCategory =
  | 'windows'
  | 'windows_server'
  | 'cal_rds'
  | 'office'
  | 'm365'
  | 'antivirus'
  | 'outro';

export interface ProductDef {
  value: string;
  label: string;
  editions?: string[];
}

export interface CategoryDef {
  value: LicenseCategory;
  label: string;
  products: ProductDef[];
  /** Permite digitar produto/edição livre */
  allowCustom?: boolean;
}

export const LICENSE_CATALOG: CategoryDef[] = [
  {
    value: 'windows',
    label: 'Windows (Desktop)',
    products: [
      { value: 'Windows 10', label: 'Windows 10', editions: ['Pro', 'Home', 'Enterprise'] },
      { value: 'Windows 11', label: 'Windows 11', editions: ['Pro', 'Home', 'Enterprise'] },
    ],
  },
  {
    value: 'windows_server',
    label: 'Windows Server',
    products: [
      { value: 'Windows Server 2019', label: 'Server 2019', editions: ['Standard', 'Essentials', 'Datacenter'] },
      { value: 'Windows Server 2022', label: 'Server 2022', editions: ['Standard', 'Essentials', 'Datacenter'] },
      { value: 'Windows Server 2025', label: 'Server 2025', editions: ['Standard', 'Essentials', 'Datacenter'] },
    ],
  },
  {
    value: 'cal_rds',
    label: 'Licenças CAL / RDS',
    products: [
      { value: 'CAL RDS Dispositivo', label: 'CAL RDS por Dispositivo' },
      { value: 'CAL RDS Usuário', label: 'CAL RDS por Usuário' },
      { value: 'CAL Windows Server Dispositivo', label: 'CAL Windows Server por Dispositivo' },
      { value: 'CAL Windows Server Usuário', label: 'CAL Windows Server por Usuário' },
    ],
  },
  {
    value: 'office',
    label: 'Microsoft Office (Perpétuo)',
    products: [
      { value: 'Office 2021', label: 'Office 2021', editions: ['Home & Business', 'Professional', 'Standard'] },
      { value: 'Office 2024', label: 'Office 2024', editions: ['Home & Business', 'Professional', 'Standard'] },
    ],
  },
  {
    value: 'm365',
    label: 'Microsoft 365 (Assinatura)',
    products: [
      { value: 'Microsoft 365 Business', label: '365 Business', editions: ['Basic', 'Standard', 'Premium', 'Apps for Business'] },
      { value: 'Microsoft 365 Personal', label: '365 Personal' },
      { value: 'Microsoft 365 Family', label: '365 Family' },
    ],
  },
  {
    value: 'antivirus',
    label: 'Antivírus',
    products: [
      { value: 'Kaspersky', label: 'Kaspersky', editions: ['Standard', 'Plus', 'Premium', 'Small Office Security', 'Endpoint Security'] },
    ],
    allowCustom: true,
  },
  {
    value: 'outro',
    label: 'Outro',
    products: [],
    allowCustom: true,
  },
];

export const getCategory = (value: string): CategoryDef | undefined =>
  LICENSE_CATALOG.find((c) => c.value === value);

export const getCategoryLabel = (value: string): string =>
  getCategory(value)?.label || value;

export const getProductsForCategory = (category: string): ProductDef[] =>
  getCategory(category)?.products || [];

export const getEditionsForProduct = (category: string, product: string): string[] => {
  const cat = getCategory(category);
  return cat?.products.find((p) => p.value === product)?.editions || [];
};

export interface AssetLicense {
  id: string;
  asset_id: string;
  category: string;
  product: string;
  edition: string | null;
  license_key: string | null;
  activation_date: string | null;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface LicenseDraft {
  id?: string;
  category: string;
  product: string;
  edition: string;
  license_key: string;
  activation_date: string;
  notes: string;
}

export const emptyLicenseDraft = (): LicenseDraft => ({
  category: '',
  product: '',
  edition: '',
  license_key: '',
  activation_date: '',
  notes: '',
});

export const formatLicenseTitle = (lic: { product: string; edition?: string | null }): string => {
  if (lic.edition) return `${lic.product} ${lic.edition}`;
  return lic.product;
};
