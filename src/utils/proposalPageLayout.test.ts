import { test } from 'node:test';
import { strictEqual } from 'node:assert';
import { needsProposalPage } from './proposalPageLayout';

test('move a tabela antes de cortar uma linha', () => {
  strictEqual(needsProposalPage(268, 12), true);
  strictEqual(needsProposalPage(260, 12), false);
});
test('mantém aceite e validação juntos', () => {
  strictEqual(needsProposalPage(180, 120), true);
  strictEqual(needsProposalPage(140, 120), false);
});
test('permite uma linha que termina no limite útil', () => {
  strictEqual(needsProposalPage(270, 5), false);
  strictEqual(needsProposalPage(271, 5), true);
});