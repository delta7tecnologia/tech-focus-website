## Problema

A seção **"9. Assinaturas digitais"** do formulário do laudo mostra hoje os 3 campos de assinatura (Técnico, Gestor, Usuário/Cliente) lado a lado dentro do gerador. Isso está errado porque:

- Gestor e Usuário (cliente) **não estão presentes** no momento em que o técnico preenche o laudo.
- Eles devem assinar **remotamente, pelo link** gerado em "SignatureLinksManager".
- Manter os pads visíveis no formulário do técnico confunde (parece que ele precisa coletar assinatura na hora) e ainda permite que ele assine no lugar do cliente.

## Solução

Reorganizar a seção 9 para deixar claro o fluxo:

1. **Apenas o Técnico assina no formulário** (presencial, ele é quem está usando o sistema).
2. **Gestor e Usuário/Cliente** aparecem como **cards informativos** mostrando:
   - Nome/cargo (campos de texto continuam, para identificação)
   - Status: "Aguardando assinatura via link" / "Assinado em DD/MM/AAAA"
   - Sem `SignaturePad` visível.
3. O bloco **"Enviar links de assinatura"** (`SignatureLinksManager`) ganha destaque logo abaixo, com instrução clara: *"Copie e envie o link para Gestor e Cliente assinarem remotamente."*
4. Após todos assinarem (técnico + links), o laudo é travado (lógica já existente é mantida).

## Mudanças

### `src/components/tech/reports/AdvancedReportGenerator.tsx`
- Na seção 9, manter apenas o `SignaturePad` do **Técnico Responsável**.
- Substituir os pads de Gestor e Usuário por **cards de status** com:
  - Inputs de nome/cargo/matrícula (mantidos para identificação).
  - Badge de status puxado de `signatureHistory` (Pendente / Assinado).
  - Texto: "A assinatura será coletada pelo link enviado."
- Reposicionar `SignatureLinksManager` dentro da própria seção 9, com título "Enviar para assinatura remota".

### Sem mudanças em
- `SignReport.tsx` (página pública do link continua igual).
- Banco de dados / migrations.
- `SignaturePad.tsx`.

## Resultado para o usuário

- Técnico vê apenas o pad dele para assinar.
- Para Gestor e Cliente, ele apenas confere o nome e copia/envia o link.
- Quando os assinantes terminam pelo link, o status atualiza nos cards e o laudo trava automaticamente.