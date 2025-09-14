import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, Calendar } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];

export function ChartExpensesByCategory({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Spending Breakdown
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No expenses recorded yet</p>
          </div>
        </div>
      </div>
    );
  }

  const expenseData = data
    .filter(item => item.type === 'expense' || !item.type)
    .map(item => ({
      name: item.category || item._id,
      value: Math.abs(item.total || item.totalAmount || 0),
      percentage: 0
    }));

  const totalExpenses = expenseData.reduce((sum, item) => sum + item.value, 0);
  expenseData.forEach(item => {
    item.percentage = totalExpenses > 0 ? ((item.value / totalExpenses) * 100).toFixed(1) : 0;
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-4 border border-gray-100 rounded-xl shadow-lg backdrop-blur-sm">
          <p className="font-semibold text-gray-800 mb-1">{data.payload.name}</p>
          <p className="text-blue-600 font-medium">
            ₹{new Intl.NumberFormat('en-IN').format(data.value)}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {data.payload.percentage}% of total spending
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Spending Breakdown
        </h3>
        <div className="bg-gray-50 px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-gray-600">
            Total: ₹{new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(totalExpenses)}
          </span>
        </div>
      </div>
      
      <div className="h-72 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {expenseData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {expenseData.slice(0, 5).map((entry, index) => (
          <div key={entry.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="font-medium text-gray-700">{entry.name}</span>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-800">
                ₹{new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(entry.value)}
              </div>
              <div className="text-xs text-gray-500">{entry.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MonthlySpendingChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-2">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Financial Trends
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No trend data available</p>
          </div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-100 rounded-xl shadow-lg backdrop-blur-sm">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm font-medium text-gray-600">{entry.name}:</span>
              <span className="font-semibold text-gray-800">
                ₹{new Intl.NumberFormat('en-IN').format(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-2 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Financial Trends
        </h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Expenses</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `₹${new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(value)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#3B82F6"
              fill="url(#incomeGradient)"
              name="Income"
              strokeWidth={3}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#EF4444"
              fill="url(#expenseGradient)"
              name="Expenses"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function IncomeVsExpensesChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Income vs Expenses
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No comparison data</p>
          </div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const income = payload.find(p => p.dataKey === 'income')?.value || 0;
      const expenses = payload.find(p => p.dataKey === 'expenses')?.value || 0;
      const netResult = income - expenses;
      
      return (
        <div className="bg-white p-4 border border-gray-100 rounded-xl shadow-lg backdrop-blur-sm">
          <p className="font-semibold text-gray-800 mb-3">{label}</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-green-600 font-medium">Income:</span>
              <span className="font-semibold">₹{new Intl.NumberFormat('en-IN').format(income)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-600 font-medium">Expenses:</span>
              <span className="font-semibold">₹{new Intl.NumberFormat('en-IN').format(expenses)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className={`font-medium ${netResult >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netResult >= 0 ? 'Surplus:' : 'Deficit:'}
                </span>
                <span className="font-bold">₹{new Intl.NumberFormat('en-IN').format(Math.abs(netResult))}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Monthly Comparison
        </h3>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={10}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `₹${new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(value)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="income" 
              fill="#10B981"
              name="Income"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="expenses" 
              fill="#EF4444"
              name="Expenses"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

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
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0;

  const cards = [
    {
      title: 'Total Income',
      value: totalIncome,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      change: '+12.5%'
    },
    {
      title: 'Total Expenses',
      value: totalExpenses,
      icon: CreditCard,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      change: '+8.2%'
    },
    {
      title: 'Net Savings',
      value: netSavings,
      icon: PiggyBank,
      color: netSavings >= 0 ? 'bg-blue-500' : 'bg-orange-500',
      bgColor: netSavings >= 0 ? 'bg-blue-50' : 'bg-orange-50',
      change: `${savingsRate}% rate`
    },
    {
      title: 'This Month',
      value: monthlyNet,
      icon: Calendar,
      color: monthlyNet >= 0 ? 'bg-purple-500' : 'bg-yellow-500',
      bgColor: monthlyNet >= 0 ? 'bg-purple-50' : 'bg-yellow-50',
      change: monthlyNet >= 0 ? 'Surplus' : 'Deficit'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className={`${card.bgColor} border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-xl`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full">
                {card.change}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{new Intl.NumberFormat('en-IN', { 
                  notation: Math.abs(card.value) > 100000 ? 'compact' : 'standard' 
                }).format(Math.abs(card.value))}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ChartsDemo() {
  const [timeRange, setTimeRange] = useState('6M');
  
  const categoryData = [
    { category: 'Food & Dining', total: 15000, type: 'expense' },
    { category: 'Transportation', total: 8000, type: 'expense' },
    { category: 'Shopping', total: 12000, type: 'expense' },
    { category: 'Entertainment', total: 5000, type: 'expense' },
    { category: 'Bills & Utilities', total: 7000, type: 'expense' }
  ];

  const monthlyData = [
    { month: 'Jan', income: 50000, expenses: 35000 },
    { month: 'Feb', income: 52000, expenses: 38000 },
    { month: 'Mar', income: 48000, expenses: 42000 },
    { month: 'Apr', income: 55000, expenses: 40000 },
    { month: 'May', income: 53000, expenses: 37000 },
    { month: 'Jun', income: 51000, expenses: 39000 }
  ];

  const summaryData = {
    totalIncome: 309000,
    totalExpenses: 231000,
    currentMonthIncome: 51000,
    currentMonthExpenses: 39000,
    transactionCount: 45
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Financial Overview
            </h1>
            <p className="text-gray-600">
              Track your spending patterns and financial health
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-1 flex">
              {['3M', '6M', '1Y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    timeRange === range
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <FinancialSummaryCards summary={summaryData} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartExpensesByCategory data={categoryData} />
          <IncomeVsExpensesChart data={monthlyData} />
        </div>

        {/* Full Width Chart */}
        <MonthlySpendingChart data={monthlyData} />
      </div>
    </div>
  );
}