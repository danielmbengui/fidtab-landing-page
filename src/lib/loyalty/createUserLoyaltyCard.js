import { ClassCompany } from "@/classes/ClassCompany";
import { ClassLoyaltyItem } from "@/classes/ClassLoyalty";
import { ClassUser, ClassUserCustomer } from "@/classes/ClassUser";
import { readCompanyUid } from "@/lib/home/homeLoyaltyCardUtils";
import { serializeLoyaltyItem } from "@/lib/loyalty/serializeLoyaltyItem";
import { firestore } from "@/lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

/**
 * @param {import("@/classes/ClassUser").ClassUserCustomer | import("@/classes/ClassUser").ClassUser} user
 * @param {string} uidCompany
 */
export async function createUserLoyaltyCard(user, uidCompany) {
  const normalizedCompany = String(uidCompany ?? "").trim();
  const uidUser = String(user?.uid ?? "").trim();

  if (!uidUser || !normalizedCompany) {
    throw new Error("invalid_params");
  }

  if (normalizedCompany === ClassCompany.DEFAULT_UID) {
    throw new Error("invalid_company");
  }

  const existingCompanyUids = new Set(
    (user?.loyalties ?? []).map(readCompanyUid).filter(Boolean),
  );

  if (existingCompanyUids.has(normalizedCompany)) {
    throw new Error("already_has_card");
  }

  const company = await ClassCompany.getFirestore(normalizedCompany);
  if (!company) {
    throw new Error("company_not_found");
  }

  const newItem = new ClassLoyaltyItem({
    uid_company: normalizedCompany,
    uid_user: uidUser,
    loyalty_points: 0.0,
    loyalty_amount: 0.0,
    created_time: new Date(),
  });

  const updatedLoyalties = [...(user?.loyalties ?? []), newItem].map((entry) =>
    entry instanceof ClassLoyaltyItem ? entry : ClassLoyaltyItem.makeInstance(serializeLoyaltyItem(entry)),
  );

  const updatedCompanyUids = [
    ...new Set(updatedLoyalties.map(readCompanyUid).filter(Boolean)),
  ];

  const customer =
    user instanceof ClassUserCustomer
      ? user
      : ClassUserCustomer.makeInstance(uidUser, {
          ...ClassUser.toJSON(user),
          role: ClassUser.ROLE.CUSTOMER,
        });

  customer.loyalties = updatedLoyalties;
  customer.update({ uids_companies_loyalties: updatedCompanyUids });

  const ref = doc(firestore, ClassUser.COLLECTION, uidUser);
  const payload = {
    ...ClassUser.toJSON(customer),
    loyalties: updatedLoyalties.map((item) => serializeLoyaltyItem(item)),
    uids_companies_loyalties: updatedCompanyUids,
    last_edit_time: new Date(),
  };

  await setDoc(ref, ClassUser.omitUndefinedDeep(payload), { merge: true });

  return { uidCompany: normalizedCompany, companyName: company.name?.trim() || "" };
}
