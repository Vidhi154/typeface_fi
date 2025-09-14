import React, { useEffect, useState } from 'react';
import api from '../api/api';
import TransactionList from '../components/TransactionList';
// import ChartExpensesByCategory from '../components/ChartExpensesByCategory';
import TransactionForm from './TransactionFrom'; // also fixed typo (was TransactionFrom)

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState([]);

  const fetchData = async () => {
    try {
      const res = await api.get('/transactions?limit=10&page=1');
      setTransactions(res.data.items || []);

      const s = await api.get('/transactions/summary/category');
      setSummary(s.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <TransactionForm onCreated={fetchData} />
        <TransactionList transactions={transactions} onDeleted={fetchData} />
      </div>
      <div>
        {/* <ChartExpensesByCategory data={summary} /> */}
      </div>
    </div>
  );
}
