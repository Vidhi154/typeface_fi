import React, { useEffect, useState, useContext } from "react";
import api from "../api/api";
import TransactionList from "../components/TransactionList";
import { AuthContext } from "../contexts/AuthContext";
import ReceiptUpload from '../components/ReceiptUpload';

const filters = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 6 months", value: "6m" },
  { label: "Last 1 year", value: "1y" },
  { label: "All", value: "all" },
];

export default function TransactionsPage() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 5; // number of transactions per page

  // Build query string based on filter
  const buildQuery = (filter) => {
    let startDate;
    const now = new Date();

    if (filter === "7d") {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (filter === "30d") {
      startDate = new Date(now.setDate(now.getDate() - 30));
    } else if (filter === "6m") {
      startDate = new Date(now.setMonth(now.getMonth() - 6));
    } else if (filter === "1y") {
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }

    return startDate ? `startDate=${startDate.toISOString()}` : "";
  };

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      const query = buildQuery(filter);
      const res = await api.get(
        `/transactions?page=${page}&limit=${limit}&${query}`
      );

      setTransactions(res.data.items || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user, filter, page]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">My Transactions</h2>

        {/* Filter dropdown */}
        <div className="mb-4 flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1); // reset page on filter change
            }}
            className="border rounded p-2"
          >
            {filters.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Receipt Upload */}
        <div className="mb-6">
          <ReceiptUpload onUploaded={fetchTransactions} />
        </div>

        {/* Transaction list */}
        <TransactionList transactions={transactions} onDeleted={fetchTransactions} />

        {/* Pagination Controls */}
        {pages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {page} of {pages}
            </span>
            <button
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
