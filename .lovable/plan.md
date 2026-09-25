# Editor de textos — Proposta de Locação de Servidores

## Objetivo
Permitir editar os textos do documento de locação de servidores em cada proposta, sem alterar as demais ou os textos padrão.

## Implementação
- Adicionar à proposta de VMs um conteúdo completo salvo como cópia individual.
- Criar os textos padrão específicos de locação: capa, serviços incluídos, condições comerciais e aceite.
- Reutilizar o editor expansível já usado nas propostas de Backup e Suporte de TI, adaptado ao conteúdo de servidores.
- Aplicar os textos editados à prévia, ao PDF final e aos downloads posteriores.
- Manter propostas antigas funcionando com os textos padrão quando ainda não tiverem conteúdo salvo.
- Incluir as alterações no cálculo de integridade ao finalizar a proposta.

## Validação
- Conferir criação, edição, restauração do padrão, prévia e download.
- Validar compilação e testar a tela administrativa de propostas de VMs.
