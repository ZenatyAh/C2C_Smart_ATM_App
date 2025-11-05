export interface Transaction {
    id: number;
    userId: number;
    type: "Deposit" | "Withdraw" | "Transfer";
    amount: number;
    currency: string;
    date: string;
    target_user?: string;
}

export type User = {
  userId: number;
  user_name: string;
  first_name: string;
  last_name: string;
  profile_img: string;
  pin: string;
  balance: number;
  birthday: string;
};