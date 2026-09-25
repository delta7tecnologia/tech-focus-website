# Proposta completa de Locação de Servidores

## Objetivo
Criar um módulo administrativo independente para locação de servidores físicos, seguindo a experiência das propostas de Backup e Suporte de TI, sem substituir a proposta atual de VMs.

## Entregas
- Criar catálogos de modelos de servidor e adicionais, com acesso administrativo, ativação/desativação e indicador de retorno do investimento.
- Criar propostas numeradas como `LOC-AAAA-NNNN`, com rascunho, finalização, bloqueio, histórico e acesso seguro por responsável ou administrador.
- Montar o formulário completo com cliente, modalidade no cliente ou dedicado Delta7, equipamentos, quantidades, adicionais, taxas únicas, validade e observações.
- Implementar cálculo interno sugerido para 12, 24 e 36 meses, comparação com catálogo, alertas de margem e aplicação opcional dos valores sugeridos.
- Adicionar planos editáveis, restauração automática e totais mensais e de implantação.
- Criar condições contratuais configuráveis por proposta: fidelidade, reajuste, guarda/devolução, compra opcional e pagamento, com variáveis preenchidas automaticamente.
- Permitir editar os textos do documento somente na proposta atual, preservando uma cópia completa para histórico e oferecendo restauração do padrão.
- Gerar PDF no padrão visual Delta7 usado nas demais propostas, incluindo capa, modalidade, equipamentos, implantação, planos, serviços, cláusulas e aceite, sem expor custos ou cálculos internos.
- Criar a lista administrativa de propostas, tela de catálogo, atalhos no menu e rotas próprias.

## Regras de cálculo
- Calcular custo de aquisição dos equipamentos e adicionais por quantidade.
- Aplicar taxa de capital, residual, margem e reserva de manutenção na sugestão financeira.
- Comparar os valores sugeridos com o catálogo usando acréscimos de 18% para 12 meses, 8% para 24 meses e base para 36 meses.
- Separar adicionais mensais de cobranças únicas e nunca mostrar custos internos no PDF.

## Segurança e dados
- Aplicar permissões no banco, acesso autenticado ao catálogo e edição exclusiva para administradores.
- Restringir propostas ao responsável e aos administradores.
- Salvar itens, parâmetros, planos, cláusulas e conteúdo textual como retratos da proposta, evitando mudanças retroativas.
- Manter as funções com escopo seguro e bloquear alterações após a finalização.

## Validação
- Testar cadastro e manutenção dos dois catálogos.
- Testar criação nas duas modalidades, filtros de adicionais, cálculos, edição manual, cláusulas, rascunho e finalização.
- Gerar e inspecionar visualmente o PDF, corrigindo cortes, sobreposições, acentos e tabelas.
- Confirmar listagem, download posterior, bloqueio da proposta finalizada, visual móvel e compilação.