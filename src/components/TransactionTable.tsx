import type { Transaction } from "@/utils/types";

export default function TransactionTable({ paginatedTransactions }: { paginatedTransactions: Transaction[] }) {
    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="border-b border-border">
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-4">Type</th>
                    <th className="py-2 px-4">Amount</th>
                    <th className="py-2 px-4">Currency</th>
                    <th className="py-2 px-4">Target User</th>
                </tr>
            </thead>
            <tbody>
                {paginatedTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-border hover:bg-card">
                        <td className="py-2 px-4">{new Date(tx.date).toLocaleString()}</td>
                        <td className="py-2 px-4">{tx.type}</td>
                        <td className="py-2 px-4">{tx.amount}</td>
                        <td className="py-2 px-4">{tx.currency}</td>
                        <td className="py-2 px-4">{tx.targetUser || "-"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
