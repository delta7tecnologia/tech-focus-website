export const PROPOSAL_PAGE_TOP = 31;
export const PROPOSAL_PAGE_BOTTOM = 275;

export function needsProposalPage(y: number, height: number): boolean {
  return y + height > PROPOSAL_PAGE_BOTTOM;
}