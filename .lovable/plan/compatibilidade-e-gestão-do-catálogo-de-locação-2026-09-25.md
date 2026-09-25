# Compatibilidade e gestão do catálogo de locação

## Objetivo
Evoluir o módulo de Locação de Servidores para administrar todo o catálogo, impedir combinações incompatíveis e simplificar a seleção de memória, discos e serviços nas propostas.

## Entregas
- Ampliar os dados dos servidores com geração, padrão e tipo de memória, limites de RAM, tamanho de baia e interfaces de disco.
- Ampliar os adicionais com capacidade, regras de compatibilidade por memória, módulo, baia, interface e modelos específicos, além do controle de quantidade.
- Atualizar R630, R730, R640 e T330; cadastrar R720 e R620; desativar as memórias antigas e cadastrar as novas opções DDR3/DDR4 e o novo disco de 4 TB.
- Reorganizar o catálogo administrativo em formulários por grupos, com obrigatoriedade, validação de RAM, edição, duplicação e ativação/desativação.
- Mostrar compatibilidades dos adicionais de forma resumida na listagem e exibir somente os campos aplicáveis a cada categoria.
- Permitir acesso ao catálogo pela rota administrativa solicitada, mantendo a proteção de administrador.
- Filtrar os adicionais por modelo e modalidade no editor da proposta.
- Substituir os checkboxes de memória por um seletor exclusivo de RAM adicional, mostrando RAM total e limite do servidor.
- Adicionar quantidade aos discos e outros adicionais permitidos, respeitando as baias livres e exibindo seu uso.
- Manter a mensalidade automática por configuração, permitir ajuste manual e oferecer restauração do valor automático.
- Ao trocar o modelo, remover itens incompatíveis e informar claramente o que foi retirado.
- Consolidar RAM total, processador e discos na descrição apresentada no PDF.

## Segurança e histórico
- Aplicar a alteração estrutural por migração, preservando os registros e propostas existentes.
- Manter a edição do catálogo restrita a administradores e a leitura aos usuários autenticados autorizados.
- Continuar salvando uma cópia completa de modelo, adicionais e quantidades dentro de cada proposta, evitando alterações retroativas.

## Validação
- Testar criação, edição, duplicação e ativação dos dois tipos de catálogo.
- Testar combinações DDR3/DDR4, RDIMM/UDIMM, baias 2,5/3,5 e interfaces SAS/SATA.
- Testar limites de RAM, baias, quantidades, troca de modelo e preço automático/manual.
- Gerar e inspecionar o PDF em propostas novas e antigas, incluindo visual móvel.

## Detalhes técnicos
- Adicionais selecionados terão quantidade registrada no próprio retrato da proposta; registros antigos serão normalizados como quantidade 1.
- A ocupação base das baias será obtida da configuração de armazenamento do modelo, com comportamento seguro quando a descrição antiga não informar quantidade.
- As funções compartilhadas de compatibilidade, preço e descrição serão centralizadas para que formulário, totais e PDF usem as mesmas regras.