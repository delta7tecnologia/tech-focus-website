-- Revisão dos preços de mercado (out/2026) dos servidores do catálogo de locação.
-- Equivale ao botão "Aplicar preços de mercado" (apenas servidores):
-- atualiza pelo nome, cria os que faltam; nunca exclui. Propostas salvas não mudam.
-- Mensalidade 36m = custo x 0,0448 arredondado para cima em múltiplos de R$ 5.

CREATE TEMP TABLE _market_models (
  nome text, formato text, fonte_redundante boolean, geracao text, cpu text, ram_base_gb integer,
  padrao_memoria text, tipo_modulo text, slots_memoria integer, ram_max_gb integer,
  baias integer, tamanho_baia text, custo_aquisicao numeric
) ON COMMIT DROP;

INSERT INTO _market_models VALUES
  ('Dell PowerEdge R720', 'rack', true, '12G', '2x Intel Xeon E5-2650L v2 (20 núcleos / 40 threads)', 64, 'DDR3', 'RDIMM', 24, 768, 8, '2.5"', 5500),
  ('Dell PowerEdge R720 128GB', 'rack', true, '12G', '2x Intel Xeon E5-2650L v2 (20 núcleos / 40 threads)', 128, 'DDR3', 'RDIMM', 24, 768, 8, '2.5"', 6500),
  ('Dell PowerEdge R630', 'rack', true, '13G', '2x Intel Xeon E5-2680 v4 (28 núcleos / 56 threads)', 64, 'DDR4', 'RDIMM', 24, 768, 8, '2.5"', 10500),
  ('Dell PowerEdge R630 128GB', 'rack', true, '13G', '2x Intel Xeon E5-2680 v4 (28 núcleos / 56 threads)', 128, 'DDR4', 'RDIMM', 24, 768, 8, '2.5"', 13000),
  ('Dell PowerEdge R730', 'rack', true, '13G', '2x Intel Xeon E5-2680 v4 (28 núcleos / 56 threads)', 64, 'DDR4', 'RDIMM', 24, 768, 8, '2.5"', 11500),
  ('Dell PowerEdge R730XD', 'rack', true, '13G', '2x Intel Xeon E5-2680 v4 (28 núcleos / 56 threads)', 64, 'DDR4', 'RDIMM', 24, 768, 12, '3.5"', 12000),
  ('Dell PowerEdge R640', 'rack', true, '14G', '2x Intel Xeon Gold 6138 (40 núcleos / 80 threads)', 64, 'DDR4', 'RDIMM', 24, 1536, 8, '2.5"', 18250),
  ('Dell PowerEdge T330', 'torre', false, '13G', 'Intel Xeon E3-1220 v6 (4 núcleos)', 8, 'DDR4', 'UDIMM', 4, 64, 8, '3.5"', 5000);

UPDATE public.server_models s SET
  fabricante = 'Dell', formato = m.formato, fonte_redundante = m.fonte_redundante, geracao = m.geracao,
  cpu = m.cpu, ram_base_gb = m.ram_base_gb, padrao_memoria = m.padrao_memoria, tipo_modulo = m.tipo_modulo,
  slots_memoria = m.slots_memoria, ram_max_gb = m.ram_max_gb, baias = m.baias, tamanho_baia = m.tamanho_baia,
  storage_base = 'Sem discos', vida_util_meses = 60, interface_disco = ARRAY['SAS','SATA'],
  custo_aquisicao = m.custo_aquisicao, mensalidade_base = CEIL(m.custo_aquisicao * 0.0448 / 5) * 5, ativo = true
FROM _market_models m
WHERE lower(trim(s.nome)) = lower(m.nome);

INSERT INTO public.server_models
  (nome, fabricante, formato, fonte_redundante, geracao, cpu, ram_base_gb, padrao_memoria, tipo_modulo,
   slots_memoria, ram_max_gb, baias, tamanho_baia, storage_base, vida_util_meses, interface_disco,
   custo_aquisicao, mensalidade_base, ativo)
SELECT m.nome, 'Dell', m.formato, m.fonte_redundante, m.geracao, m.cpu, m.ram_base_gb, m.padrao_memoria, m.tipo_modulo,
       m.slots_memoria, m.ram_max_gb, m.baias, m.tamanho_baia, 'Sem discos', 60, ARRAY['SAS','SATA'],
       m.custo_aquisicao, CEIL(m.custo_aquisicao * 0.0448 / 5) * 5, true
FROM _market_models m
WHERE NOT EXISTS (SELECT 1 FROM public.server_models s WHERE lower(trim(s.nome)) = lower(m.nome));
