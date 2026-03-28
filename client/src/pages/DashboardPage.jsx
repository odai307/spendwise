import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import TopNav from '../components/layout/TopNav';
import { useAuth } from '../context/AuthContext.jsx';
import { getTransactionSummary, listTransactions } from '../services/transactionApi';
import { getBudgetStatus } from '../services/budgetApi';

const DashboardPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ income: 0, expense: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [budgetStatus, setBudgetStatus] = useState({ categories: [], month: '', totalBudget: 0, totalSpent: 0 });

  const currency = user?.currency || 'GHS';

  const formatCurrency = useMemo(() => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency });
  }, [currency]);

  const balance = useMemo(() => {
    return (summary.income || 0) - (summary.expense || 0);
  }, [summary]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getTransactionSummary(), listTransactions({ page: 1, limit: 5 }), getBudgetStatus()])
      .then(([summaryResponse, listResponse, budgetResponse]) => {
        if (!isMounted) return;
        setSummary(summaryResponse.data || { income: 0, expense: 0 });
        setRecentTransactions(listResponse.data || []);
        setBudgetStatus(budgetResponse.data || { categories: [], month: '', totalBudget: 0, totalSpent: 0 });
      })
      .catch(() => {
        if (!isMounted) return;
        setSummary({ income: 0, expense: 0 });
        setRecentTransactions([]);
        setBudgetStatus({ categories: [], month: '', totalBudget: 0, totalSpent: 0 });
      })
      .finally(() => {
        if (!isMounted) return;
        setRecentLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (transaction) => {
    const value = transaction.createdAt || transaction.date;
    if (!value) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(value));
  };

  const formatAmount = (transaction) => {
    const signed = transaction.type === 'expense' ? -Math.abs(transaction.amount) : Math.abs(transaction.amount);
    return formatCurrency.format(signed);
  };

  const budgetCategories = budgetStatus.categories.slice(0, 4);

  return (
    <AppShell sideNavVariant="dashboard" className="bg-background font-body text-on-background selection:bg-primary-container">
      <main className="lg:ml-64 min-h-screen flex flex-col">
        <TopNav variant="dashboard" />
{/* TopNavBar (Predicted JSON Component) */}
        
        {/* Dashboard Canvas */}
        <div className="p-8 space-y-12">
            {/* Hero Balance Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
                <div className="lg:col-span-2 space-y-2">
                    <p className="text-on-surface-variant font-label text-sm font-medium">Total Available Balance</p>
                    <h2 className="text-6xl lg:text-7xl font-headline font-extrabold tracking-tight text-on-background">
                        {formatCurrency.format(balance)}</h2>
                <div className="flex items-center gap-3 mt-4">
                    <span
                        className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs" data-icon="trending_up">trending_up</span>
                        +12.4%
                    </span>
                    <span className="text-on-surface-variant text-xs font-medium">from last month</span>
                </div>
            </div>
                {/* Quick Summary Bento */}
                <div className="space-y-4">
                    <div
                        className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_12px_32px_rgba(43,52,55,0.06)] space-y-2 min-w-0">
                        <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Income</p>
                        <p className="text-lg md:text-xl font-headline font-bold text-primary break-words">
                          {formatCurrency.format(summary.income || 0)}
                        </p>
                    </div>
                    <div
                        className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_12px_32px_rgba(43,52,55,0.06)] space-y-2 min-w-0">
                        <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Expenses</p>
                        <p className="text-lg md:text-xl font-headline font-bold text-error break-words">
                          {formatCurrency.format(summary.expense || 0)}
                        </p>
                    </div>
                </div>
            </section>
            {/* Visual Analytics Grid */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Monthly Analysis */}
                <div className="xl:col-span-8 bg-surface-container p-8 rounded-xl space-y-8 relative overflow-hidden">
                    <div className="flex justify-between items-center relative z-10">
                        <div>
                            <h3 className="text-xl font-headline font-bold">Monthly Spending Flow</h3>
                            <p className="text-on-surface-variant text-sm">Visualizing your cashflow for Oct 2023</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="px-3 py-1.5 bg-surface-container-lowest rounded-lg text-xs font-bold shadow-sm">Monthly</button>
                            <button className="px-3 py-1.5 text-on-surface-variant text-xs font-bold">Weekly</button>
                        </div>
                    </div>
                    {/* Simplified High-End Chart Placeholder */}
                    <div className="h-64 flex items-end justify-between gap-4 px-4">
                        <div className="flex-1 bg-primary/20 rounded-t-lg h-[40%] hover:bg-primary/40 transition-all"></div>
                        <div className="flex-1 bg-primary/20 rounded-t-lg h-[60%] hover:bg-primary/40 transition-all"></div>
                        <div className="flex-1 bg-primary/20 rounded-t-lg h-[35%] hover:bg-primary/40 transition-all"></div>
                        <div className="flex-1 bg-primary/20 rounded-t-lg h-[85%] hover:bg-primary/40 transition-all"></div>
                        <div className="flex-1 bg-primary rounded-t-lg h-[55%] relative group">
                            <div
                                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-on-background text-surface-container-lowest px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                $2,420.00
                            </div>
                        </div>
                        <div className="flex-1 bg-primary/20 rounded-t-lg h-[45%] hover:bg-primary/40 transition-all"></div>
                        <div className="flex-1 bg-primary/20 rounded-t-lg h-[70%] hover:bg-primary/40 transition-all"></div>
                        <div className="flex-1 bg-primary/20 rounded-t-lg h-[30%] hover:bg-primary/40 transition-all"></div>
                        <div className="flex-1 bg-primary/20 rounded-t-lg h-[50%] hover:bg-primary/40 transition-all"></div>
                        <div className="flex-1 bg-primary/20 rounded-t-lg h-[90%] hover:bg-primary/40 transition-all"></div>
                    </div>
                </div>
                {/* Budget Usage */}
                <div
                    className="xl:col-span-4 bg-surface-container-lowest p-8 rounded-xl shadow-[0px_12px_32px_rgba(43,52,55,0.06)] space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-headline font-bold">Budget Usage</h3>
                        <Link className="text-primary text-xs font-bold hover:underline" to="/budgets">
                          View All
                        </Link>
                    </div>
                    <div className="space-y-6">
                      {budgetCategories.length === 0 && (
                        <div className="text-sm text-on-surface-variant">No budgets set for this month.</div>
                      )}
                      {budgetCategories.map((item) => {
                        const percentUsed = item.limit > 0 ? Math.min(Math.round((item.spent / item.limit) * 100), 100) : 0;
                        const barClass = percentUsed >= 90 ? 'bg-error' : 'bg-primary';
                        return (
                          <div className="space-y-2" key={item.category}>
                            <div className="flex justify-between text-sm font-medium">
                              <span>{item.category}</span>
                              <span className="text-on-surface-variant">
                                {formatCurrency.format(item.spent)} / {formatCurrency.format(item.limit)}
                              </span>
                            </div>
                            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                              <div className={`h-full ${barClass} rounded-full`} style={{ width: `${percentUsed}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                </div>
            </section>
            {/* Recent Transactions Table */}
            <section
                className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(43,52,55,0.06)] overflow-hidden">
                <div className="p-8 flex justify-between items-center">
                    <h3 className="text-xl font-headline font-bold">Recent Transactions</h3>
                    <div className="flex items-center gap-4">
                        <Link
                          className="text-primary text-xs font-bold hover:underline"
                          to="/transactions"
                        >
                          View All
                        </Link>
                        <button
                            className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-on-background transition-colors">
                            <span className="material-symbols-outlined text-lg" data-icon="filter_list">filter_list</span>
                            Filter
                        </button>
                        <button
                            className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-on-background transition-colors">
                            <span className="material-symbols-outlined text-lg" data-icon="download">download</span>
                            Export
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low border-none">
                                <th
                                    className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                    Merchant / Entity</th>
                                <th
                                    className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                    Category</th>
                                <th
                                    className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                    Date</th>
                                <th
                                    className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">
                                    Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-high/30">
                          {recentLoading && (
                            <tr>
                              <td className="px-8 py-6 text-sm text-on-surface-variant" colSpan={4}>
                                Loading recent transactions...
                              </td>
                            </tr>
                          )}
                          {!recentLoading && recentTransactions.length === 0 && (
                            <tr>
                              <td className="px-8 py-6 text-sm text-on-surface-variant" colSpan={4}>
                                No transactions yet.
                              </td>
                            </tr>
                          )}
                          {!recentLoading &&
                            recentTransactions.map((transaction) => (
                              <tr
                                className="group hover:bg-surface-container-high transition-colors cursor-pointer"
                                key={transaction._id}
                              >
                                <td className="px-8 py-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                                      <span className="material-symbols-outlined" data-icon="shopping_bag">
                                        {transaction.type === 'income' ? 'payments' : 'shopping_bag'}
                                      </span>
                                    </div>
                                    <span className="font-bold text-on-background">
                                      {transaction.note || transaction.category}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-8 py-4">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                                      transaction.type === 'income'
                                        ? 'bg-tertiary-container text-on-tertiary-container'
                                        : 'bg-surface-container text-on-surface-variant'
                                    }`}
                                  >
                                    {transaction.category}
                                  </span>
                                </td>
                                <td className="px-8 py-4 text-sm text-on-surface-variant font-medium">
                                  {formatDate(transaction)}
                                </td>
                                <td
                                  className={`px-8 py-4 text-right font-bold ${
                                    transaction.type === 'income' ? 'text-primary' : 'text-error'
                                  }`}
                                >
                                  {formatAmount(transaction)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div></main>
    </AppShell>
  );
};

export default DashboardPage;
