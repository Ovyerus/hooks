import bent from "bent";
import { formatISO } from "date-fns";
import {
  RoundedExpense,
  RoundedExpenseCategory,
  RoundedSupplier,
  UpCategory,
  UpTransactionResponse,
} from "./types";

const upBase = "https://api.up.com.au/api/v1/";
const roundedBase = "https://app.rounded.com.au/api/v1/";
const roundedHeaders = {
  "API-Version": "v2",
  Cookie: `_rounded_session=${process.env.ROUNDED_TOKEN}`,
};

const getUp = bent(upBase, "json", {
  Authorization: `Bearer ${process.env.UP_TOKEN}`,
});
const getRounded = bent(roundedBase, "json", roundedHeaders);
const postRounded = bent(roundedBase, "json", "POST", roundedHeaders);

interface CreateExpenseOptions {
  categoryId?: string;
  supplierId?: string;
  clientId?: string;
  date?: Date;
  description?: string;
  fullAmount: number;
  currency?: string;
}

export const createExpense = ({
  categoryId: category_id = null,
  supplierId: supplier_id = null,
  clientId: client_id = null,
  date = new Date(),
  description,
  fullAmount: full_amount,
  currency = "AUD",
}: CreateExpenseOptions): Promise<RoundedExpense> =>
  postRounded("expenses", {
    currency,
    full_amount,
    business_use_percent: 10000,
    date: formatISO(date, { representation: "date" }),
    category_id,
    supplier_id,
    client_id,
    description,
    taxes: {},
    attachment: null,
    attachment_is_image: null,
    attachment_url: null,
    attachment_file_name: null,
    delete_attachment: 0,
  }) as any;

export const getCategories = (): Promise<RoundedExpenseCategory[]> =>
  getRounded("expense_categories") as any;
export const getSuppliers = (): Promise<RoundedSupplier[]> =>
  getRounded("suppliers") as any;
export const createCategory = (name: string): Promise<RoundedExpenseCategory> =>
  postRounded("expense_categories", { name }) as any;
export const createSupplier = (name: string): Promise<RoundedSupplier> =>
  postRounded("suppliers", { name }) as any;

export const getTransaction = (id: string): Promise<UpTransactionResponse> => {
  return getUp(`transactions/${id}`) as any;
};
export const getUpCategory = (id: string): Promise<UpCategory> =>
  getUp(`categories/${id}`) as any;
