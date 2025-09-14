import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

// Color palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

// Chart for expenses by category (Pie Chart)
export function ChartExpensesByCategory({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Expenses by Category</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>No expense data available</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter and format data for expenses only
  const expenseData = data
    .filter(item => item.type === 'expense' || !item.type) // Include items without type (assume expense)
    .map(item => ({
      name: item.category || item._id,
      value: Math.abs(item.total || item.totalAmount || 0),
      percentage: 0 // Will calculate below
    }));

  // Calculate percentages
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.value, 0);
  expenseData.forEach(item => {
    item.percentage = totalExpenses > 0 ? ((item.value / totalExpenses) * 100).toFixed(1) : 0;
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{data.payload.name}</p>
          <p className="text-blue-600">
            Amount: ₹{new Intl.NumberFormat('en-IN').format(data.value)}
          </p>
          <p className="text-gray-600">
            {data.payload.percentage}% of total expenses
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Expenses by Category</h3>
        <div className="text-sm text-gray-500">
          Total: ₹{new Intl.NumberFormat('en-IN').format(totalExpenses)}
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percentage }) => `${name} (${percentage}%)`}
              labelLine={false}
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {expenseData.slice(0, 8).map((entry, index) => (
          <div key={entry.name} className="flex items-center text-sm">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span className="truncate">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Monthly spending trend chart
export function MonthlySpendingChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Spending Trend</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <p>No monthly data available</p>
          </div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: ₹{new Intl.NumberFormat('en-IN').format(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Spending Trend</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `₹${new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(value)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="expenses"
              stackId="1"
              stroke="#ef4444"
              fill="#fecaca"
              name="Expenses"
            />
            <Area
              type="monotone"
              dataKey="income"
              stackId="2"
              stroke="#10b981"
              fill="#bbf7d0"
              name="Income"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Income vs Expenses comparison
export function IncomeVsExpensesChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Income vs Expenses</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">💰</div>
            <p>No comparison data available</p>
          </div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const income = payload.find(p => p.dataKey === 'income')?.value || 0;
      const expenses = payload.find(p => p.dataKey === 'expenses')?.value || 0;
      const savings = income - expenses;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800 mb-2">{label}</p>
          <p className="text-green-600">
            Income: ₹{new Intl.NumberFormat('en-IN').format(income)}
          </p>
          <p className="text-red-600">
            Expenses: ₹{new Intl.NumberFormat('en-IN').format(expenses)}
          </p>
          <hr className="my-2" />
          <p className={`font-semibold ${savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {savings >= 0 ? 'Savings' : 'Deficit'}: ₹{new Intl.NumberFormat('en-IN').format(Math.abs(savings))}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Income vs Expenses</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `₹${new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(value)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Financial Summary Cards
export function FinancialSummaryCards({ summary = {} }) {
  const {
    totalIncome = 0,
    totalExpenses = 0,
    currentMonthIncome = 0,
    currentMonthExpenses = 0,
    transactionCount = 0
  } = summary;

  const netSavings = totalIncome - totalExpenses;
  const monthlyNet = currentMonthIncome - currentMonthExpenses;
  const avgTransaction = transactionCount > 0 ? (totalIncome + totalExpenses) / transactionCount : 0;

  const cards = [
    {
      title: 'Total Income',
      value: totalIncome,
      icon: '💰',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Total Expenses',
      value: totalExpenses,
      icon: '💸',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Net Savings',
      value: netSavings,
      icon: netSavings >= 0 ? '📈' : '📉',
      color: netSavings >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: netSavings >= 0 ? 'bg-green-50' : 'bg-red-50',
      borderColor: netSavings >= 0 ? 'border-green-200' : 'border-red-200'
    },
    {
      title: 'This Month',
      value: monthlyNet,
      icon: '📅',
      color: monthlyNet >= 0 ? 'text-blue-600' : 'text-orange-600',
      bgColor: monthlyNet >= 0 ? 'bg-blue-50' : 'bg-orange-50',
      borderColor: monthlyNet >= 0 ? 'border-blue-200' : 'border-orange-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className={`${card.bgColor} ${card.borderColor} border rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className={`text-2xl font-bold ${card.color}`}>
                ₹{new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(Math.abs(card.value))}
              </p>
              {card.title === 'Net Savings' && card.value < 0 && (
                <p className="text-xs text-gray-500">Deficit</p>
              )}
            </div>
            <div className="text-3xl">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Demo component showing all charts with sample data
export default function ChartsDemo() {
  // Sample data for demonstration
  const categoryData = [
    { category: 'Food & Dining', total: 15000, type: 'expense' },
    { category: 'Transportation', total: 8000, type: 'expense' },
    { category: 'Shopping', total: 12000, type: 'expense' },
    { category: 'Entertainment', total: 5000, type: 'expense' },
    { category: 'Bills & Utilities', total: 7000, type: 'expense' }
  ];

  const monthlyData = [
    { month: 'Jan 2024', income: 50000, expenses: 35000 },
    { month: 'Feb 2024', income: 52000, expenses: 38000 },
    { month: 'Mar 2024', income: 48000, expenses: 42000 },
    { month: 'Apr 2024', income: 55000, expenses: 40000 },
    { month: 'May 2024', income: 53000, expenses: 37000 },
    { month: 'Jun 2024', income: 51000, expenses: 39000 }
  ];

  const summaryData = {
    totalIncome: 309000,
    totalExpenses: 231000,
    currentMonthIncome: 51000,
    currentMonthExpenses: 39000,
    transactionCount: 45
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Financial Dashboard Charts
          </h1>
          <p className="text-gray-600">
            Visualize your financial data with interactive charts and summaries
          </p>
        </div>

        {/* Summary Cards */}
        <FinancialSummaryCards summary={summaryData} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartExpensesByCategory data={categoryData} />
          <IncomeVsExpensesChart data={monthlyData} />
        </div>

        {/* Full width chart */}
        <MonthlySpendingChart data={monthlyData} />

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Integration Instructions</h3>
          <div className="prose text-sm text-gray-600 space-y-2">
            <p><strong>To integrate these charts into your dashboard:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Import the chart components you need</li>
              <li>Pass your actual transaction data to each component</li>
              <li>Use the API endpoints to fetch summary and category data</li>
              <li>The components handle empty data gracefully</li>
            </ol>
            <p className="mt-4"><strong>Required data formats:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>CategoryData:</strong> Array with category, total, and type fields</li>
              <li><strong>MonthlyData:</strong> Array with month, income, and expenses fields</li>
              <li><strong>Summary:</strong> Object with totals and counts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}