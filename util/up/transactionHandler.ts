import { NowRequest, NowResponse } from "@vercel/node";
import { parseJSON } from "date-fns";
import { json } from "micro";
import { categoryMapping } from "./mappings";
import { UpWebhookEvent } from "./types";
import {
  createCategory,
  createExpense,
  createSupplier,
  getTransaction,
  getCategories,
  getSuppliers,
  getUpCategory,
} from "./requests";

export default async (req: NowRequest, res: NowResponse) => {
  const body = (await json(req)) as UpWebhookEvent;
  const transId = body.data.relationships.transaction.data.id;
  const { data: transaction } = await getTransaction(transId);

  const {
    id,
    attributes: { status, description, amount, createdAt },
  } = transaction;
  let {
    tags: { data: transTags },
    category: { data: transCategory },
  } = transaction.relationships;

  if (status === "HELD" || !transTags.find((x) => x.id === "Business"))
    return res.send("OK");
  if (amount.valueInBaseUnits > 0) return res.send("TODO"); // Create income

  const fullCategory = await getUpCategory(transCategory.id);
  const categoryString: string =
    categoryMapping[fullCategory.data.id] || fullCategory.data.attributes.name;
  let supplier: string, category: string;

  const [categories, suppliers] = await Promise.all([
    getCategories(),
    getSuppliers(),
  ]);
  const foundCategory = categories.find(
    (x) => x.name.toLowerCase() === categoryString.toLowerCase()
  );
  const foundSupplier = suppliers.find(
    (x) => x.name.toLowerCase() === description
  );

  if (!foundCategory) {
    const res = await createCategory(categoryString);
    category = res.id;
  } else category = foundCategory.id;

  if (!foundSupplier) {
    const res = await createSupplier(description);
    supplier = res.id;
  } else supplier = foundSupplier.id;

  // TODO: prevent dupes by checkign search??
  const created = await createExpense({
    categoryId: category,
    supplierId: supplier,
    date: parseJSON(createdAt),
    fullAmount: Math.abs(amount.valueInBaseUnits),
    currency: amount.currencyCode,
    description: `Autogenerated from Up.\nTransaction id: ${id}`,
  });

  console.log(
    `CREATED EXPENSE ${created.id} FROM TRANSACTION ${id}. VALUE ${amount.value}`
  );
  res.send("OK");
};
