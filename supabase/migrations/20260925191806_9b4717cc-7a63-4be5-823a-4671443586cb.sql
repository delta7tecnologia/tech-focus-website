ALTER TABLE public.server_models
  ADD COLUMN geracao text,
  ADD COLUMN padrao_memoria text,
  ADD COLUMN tipo_modulo text,
  ADD COLUMN slots_memoria integer NOT NULL DEFAULT 0,
  ADD COLUMN ram_max_gb integer NOT NULL DEFAULT 0,
  ADD COLUMN tamanho_baia text,
  ADD COLUMN interface_disco text[] NOT NULL DEFAULT '{}'::text[];

ALTER TABLE public.server_models
  ADD CONSTRAINT server_models_padrao_memoria_valid CHECK (padrao_memoria IS NULL OR padrao_memoria IN ('DDR3', 'DDR4', 'DDR5')),
  ADD CONSTRAINT server_models_tipo_modulo_valid CHECK (tipo_modulo IS NULL OR tipo_modulo IN ('RDIMM', 'UDIMM', 'LRDIMM')),
  ADD CONSTRAINT server_models_tamanho_baia_valid CHECK (tamanho_baia IS NULL OR tamanho_baia IN ('2.5"', '3.5"')),
  ADD CONSTRAINT server_models_memory_values_valid CHECK (slots_memoria >= 0 AND ram_max_gb >= 0 AND (ram_max_gb = 0 OR ram_base_gb <= ram_max_gb));

ALTER TABLE public.server_upgrades
  ADD COLUMN capacidade_gb integer,
  ADD COLUMN compat_memoria text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN compat_tipo_modulo text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN compat_baia text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN compat_interface text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN compat_modelos uuid[] NOT NULL DEFAULT '{}'::uuid[],
  ADD COLUMN permite_quantidade boolean NOT NULL DEFAULT false;

ALTER TABLE public.server_upgrades
  ADD CONSTRAINT server_upgrades_capacidade_valid CHECK (capacidade_gb IS NULL OR capacidade_gb IN (32, 64, 128, 256));