/**
 * @param {Date} value
 */
function toTimelineDate(value) {
  return value instanceof Date && Number.isFinite(value.getTime()) ? value : new Date(0);
}

/**
 * @param {Array<{
 *   sale: import("@/classes/ClassSale").ClassSale;
 *   shopLabel: string;
 *   companyLogoUrl: string;
 *   pointsEligibleAmount: number;
 * }>} sales
 * @param {Array<{
 *   action: import("@/classes/ClassLoyalty").ClassLoyaltyAction;
 *   counterparty: import("@/classes/ClassUser").ClassUser | null;
 * }>} actionEntries
 */
export function mergeLoyaltyActivityTimeline(sales, actionEntries) {
  const items = [
    ...sales.map((entry) => ({
      id: `sale-${entry.sale.uid}`,
      kind: /** @type {const} */ ("sale"),
      date: toTimelineDate(entry.sale.created_time),
      sale: entry,
    })),
    ...actionEntries.map(({ action, counterparty }) => ({
      id: `action-${action.uid}`,
      kind: /** @type {const} */ ("action"),
      date: toTimelineDate(action.created_time),
      action,
      counterparty,
    })),
  ];

  return items.sort((a, b) => b.date.getTime() - a.date.getTime());
}
