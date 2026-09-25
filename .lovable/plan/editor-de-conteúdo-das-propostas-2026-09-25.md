## Editor de conteúdo das propostas

Adicionar aos formulários de **Backup em Nuvem** e **Suporte de TI** uma área “Editar textos do documento”. Cada nova proposta começa preenchida com o conteúdo padrão atual, mas qualquer alteração fica salva somente naquela proposta.

### O que poderá ser editado

- Texto institucional “Sobre a Delta7”.
- Benefícios: títulos e descrições.
- Infraestrutura/tecnologias: títulos e descrições.
- Perfil ideal: títulos e descrições.
- Texto de “Não inclusos”.
- Texto de suporte/termos do contrato.
- Lista de requisitos/condições.
- Citação e autoria.
- No Suporte de TI: prioridades, descrições e tempos do SLA.

### Experiência no formulário

- Criar um editor organizado por seções recolhíveis dentro de “Conteúdo do PDF”.
- Manter os seletores atuais que definem quais seções aparecem.
- Adicionar “Restaurar textos padrão” para desfazer personalizações antes de salvar.
- A prévia deve refletir imediatamente os textos editados.
- Textos vazios serão aceitos quando a intenção for remover um conteúdo específico.

### Persistência e documentos

- Adicionar um campo estruturado de conteúdo personalizado às tabelas de propostas de Backup e Suporte de TI.
- Salvar uma cópia completa dos textos com cada proposta, preservando o documento mesmo se os padrões do sistema mudarem no futuro.
- Aplicar os textos personalizados em todos os modelos de PDF, downloads da lista, validação pública e documentos assinados.
- Propostas antigas, sem conteúdo salvo, continuarão usando os textos padrão atuais.

### Validação

- Verificar criação, edição, prévia e geração de PDF nos dois módulos.
- Confirmar que uma personalização não altera outras propostas nem o padrão das próximas.
- Validar que propostas antigas continuam abrindo e gerando normalmente.

### Detalhes técnicos

- Armazenar o conteúdo em JSON por proposta para acomodar listas e blocos sem criar dezenas de colunas.
- Centralizar tipos, valores padrão e normalização nos arquivos de conteúdo existentes.
- Repassar o conteúdo personalizado pelos geradores de PDF e pelos fluxos públicos de assinatura/validação.
