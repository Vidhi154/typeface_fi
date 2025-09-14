// import React, { useEffect, useState } from 'react';
// import api from '../api/api';
// import TransactionList from '../components/TransactionList';

// import TransactionForm from './TransactionFrom'; 
// import { 
//   ChartExpensesByCategory, 
//   MonthlySpendingChart, 
//   IncomeVsExpensesChart, 
//   FinancialSummaryCards 
// } from '../components/Charts';
// export default function Dashboard() {
//   const [transactions, setTransactions] = useState([]);
//   const [summary, setSummary] = useState([]);

//   const fetchData = async () => {
//     try {
//       const res = await api.get('/transactions?limit=10&page=1');
//       setTransactions(res.data.items || []);

//       const s = await api.get('/transactions/summary/category');
//       setSummary(s.data || []);
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       <div className="md:col-span-2">
//         <TransactionForm onCreated={fetchData} />
//         <TransactionList transactions={transactions} onDeleted={fetchData} />
//       </div>
//       <div>
       
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import TransactionList from '../components/TransactionList';
import TransactionForm from './TransactionFrom'; 
import { 
  ChartExpensesByCategory, 
  MonthlySpendingChart, 
  IncomeVsExpensesChart, 
  FinancialSummaryCards 
} from '../components/chart';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [financialSummary, setFinancialSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch recent transactions
      const transactionsRes = await api.get('/transactions?limit=10&page=1');
      setTransactions(transactionsRes.data.items || []);

      // Fetch category summary for expenses chart
      const categoryRes = await api.get('/transactions/summary/category');
      setSummary(categoryRes.data || []);

      // Fetch monthly data for trend charts
      try {
        const monthlyRes = await api.get('/transactions/summary/monthly');
        setMonthlyData(monthlyRes.data || []);
      } catch (monthlyErr) {
        console.warn('Monthly data not available:', monthlyErr);
        // Generate sample monthly data from transactions if endpoint doesn't exist
        generateMonthlyDataFromTransactions(transactionsRes.data.items || []);
      }

      // Fetch or calculate financial summary
      try {
        const summaryRes = await api.get('/transactions/summary/financial');
        setFinancialSummary(summaryRes.data || {});
      } catch (summaryErr) {
        console.warn('Financial summary not available:', summaryErr);
        // Calculate summary from existing data
        calculateFinancialSummary(transactionsRes.data.items || []);
      }

    } catch (err) {
      console.error("Error fetching data:", err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate monthly data from transactions if API endpoint doesn't exist
  const generateMonthlyDataFromTransactions = (transactions) => {
    const monthlyMap = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date || transaction.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthName, income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyMap[monthKey].income += transaction.amount || 0;
      } else {
        monthlyMap[monthKey].expenses += transaction.amount || 0;
      }
    });

    const monthlyArray = Object.keys(monthlyMap)
      .sort()
      .slice(-6) // Last 6 months
      .map(key => monthlyMap[key]);
    
    setMonthlyData(monthlyArray);
  };

  // Calculate financial summary from transactions if API endpoint doesn't exist
  const calculateFinancialSummary = (transactions) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalIncome = 0;
    let totalExpenses = 0;
    let currentMonthIncome = 0;
    let currentMonthExpenses = 0;

    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date || transaction.createdAt);
      const amount = transaction.amount || 0;

      if (transaction.type === 'income') {
        totalIncome += amount;
        if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
          currentMonthIncome += amount;
        }
      } else {
        totalExpenses += amount;
        if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
          currentMonthExpenses += amount;
        }
      }
    });

    setFinancialSummary({
      totalIncome,
      totalExpenses,
      currentMonthIncome,
      currentMonthExpenses,
      transactionCount: transactions.length
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Financial Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Track your income, expenses, and financial goals
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'short',
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <FinancialSummaryCards summary={financialSummary} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Transaction Form and List */}
          <div className="xl:col-span-2 space-y-6">
            {/* Transaction Form */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Add New Transaction
              </h2>
              <TransactionForm onCreated={fetchData} />
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Transactions
                </h2>
                <a 
                  href="/transactions" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All →
                </a>
              </div>
              <TransactionList 
                transactions={transactions} 
                onDeleted={fetchData}
                showPagination={false}
              />
              {transactions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">💳</div>
                  <p>No transactions yet</p>
                  <p className="text-sm">Add your first transaction above</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Charts */}
          <div className="space-y-6">
            {/* Expenses by Category Chart */}
            <ChartExpensesByCategory data={summary} />

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                {financialSummary.totalIncome > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Savings Rate</span>
                    <span className="font-semibold text-green-600">
                      {((financialSummary.totalIncome - financialSummary.totalExpenses) / financialSummary.totalIncome * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Transactions</span>
                  <span className="font-semibold">{transactions.length}</span>
                </div>
                {summary.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Top Category</span>
                    <span className="font-semibold">
                      {summary[0]?.category || summary[0]?._id || 'N/A'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Full Width Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IncomeVsExpensesChart data={monthlyData} />
          <MonthlySpendingChart data={monthlyData} />
        </div>

       
      </div>
    </div>
  );
}