import { ClassLoyaltyItem } from "@/classes/ClassLoyalty";
import {
  readCompanyUid,
  readLoyaltyAmount,
  readLoyaltyCreatedTime,
  readLoyaltyPoints,
} from "@/lib/home/homeLoyaltyCardUtils";

/** @param {import("@/classes/ClassLoyalty").ClassLoyaltyItem | Record<string, unknown>} item */
export function serializeLoyaltyItem(item) {
  if (item instanceof ClassLoyaltyItem) {
    return ClassLoyaltyItem.toJSON(item);
  }

  const uidCompany = readCompanyUid(item);
  const uidUser = String(item?.uid_user ?? item?._uid_user ?? "").trim();
  const createdTime = readLoyaltyCreatedTime(item);

  return {
    uid_company: uidCompany,
    uid_user: uidUser,
    loyalty_points: readLoyaltyPoints(item),
    loyalty_amount: readLoyaltyAmount(item),
    ...(createdTime ? { created_time: createdTime } : {}),
  };
}

/** @param {import("@/classes/ClassLoyalty").ClassLoyaltyItem | Record<string, unknown>} item */
export function toClassLoyaltyItem(item) {
  if (item instanceof ClassLoyaltyItem) return item;
  return ClassLoyaltyItem.makeInstance(serializeLoyaltyItem(item));
}
