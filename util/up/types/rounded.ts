// {"id":"GBLmA3DN","name":"see","color":"#54D89D","resource_type":"expense_category"}
export interface RoundedExpenseCategory {
  id: string;
  name: string;
  color: string;
  resource_type: "expense_category";
}

// {"id":"2O3Zn4nN","name":"Obama","resource_type":"supplier"}
export interface RoundedSupplier {
  id: string;
  name: string;
  resource_type: "supplier";
}

export interface RoundedExpense {
  id: string;
  description: string;
  category_id?: string;
  amount: number;
  full_amount: number;
  business_use_percent: number;
  currency: string;
  supplier_id?: string;
  date: string;
  created_at: string;
  updated_at: string;
  client_id?: string;
  attachment: null;
  taxes: {};
  resource_type: "expense";
}
