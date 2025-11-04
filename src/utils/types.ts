export interface Transaction {
    id: number;
    userId: number;
    type: "Deposit" | "Withdraw" | "Transfer";
    amount: number;
    currency: string;
    date: string;
    target_user?: string;
}
