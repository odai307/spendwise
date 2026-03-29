import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import TopNav from '../components/layout/TopNav';
import {
  createTransaction,
  getTransactionCategories,
  getTransactionSummary,
  listTransactions,
} from '../services/transactionApi';
import { useAuth } from '../context/AuthContext.jsx';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({ income: 0, expense: 0 });
  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [filters, setFilters] = useState({ type: 'all', category: 'all' });
  const [dateFilter, setDateFilter] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toLocalDate = (date) => {
    const pad = (value) => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  const [formState, setFormState] = useState({
    amount: '',
    date: toLocalDate(new Date()),
    note: '',
    type: 'expense',
    category: '',
  });
  const [formStatus, setFormStatus] = useState({ loading: false, error: '' });
  const { user } = useAuth();
  const currency = user?.currency || 'GHS';
  const location = useLocation();
  const navigate = useNavigate();

  const formatCurrency = useMemo(() => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency });
  }, [currency]);

  const formattedMonthlyExpense = useMemo(() => {
    return formatCurrency.format(summary.expense || 0);
  }, [formatCurrency, summary.expense]);

  const activeCategories = useMemo(() => {
    return formState.type === 'income' ? categories.income : categories.expense;
  }, [categories, formState.type]);

  const allCategories = useMemo(() => {
    return Array.from(new Set([...categories.expense, ...categories.income]));
  }, [categories]);

  const getDateRangeFromPreset = (preset) => {
    const now = new Date();
    const startOfDay = (date) => {
      const value = new Date(date);
      value.setHours(0, 0, 0, 0);
      return value;
    };
    const endOfDay = (date) => {
      const value = new Date(date);
      value.setHours(23, 59, 59, 999);
      return value;
    };

    if (preset === 'today') {
      return { from: startOfDay(now), to: endOfDay(now) };
    }

    if (preset === '7d') {
      const from = new Date(now);
      from.setDate(from.getDate() - 6);
      return { from: startOfDay(from), to: endOfDay(now) };
    }

    if (preset === '30d') {
      const from = new Date(now);
      from.setDate(from.getDate() - 29);
      return { from: startOfDay(from), to: endOfDay(now) };
    }

    if (preset === 'quarter') {
      const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
      const from = new Date(now.getFullYear(), quarterStartMonth, 1);
      return { from: startOfDay(from), to: endOfDay(now) };
    }

    if (preset === 'ytd') {
      const from = new Date(now.getFullYear(), 0, 1);
      return { from: startOfDay(from), to: endOfDay(now) };
    }

    return null;
  };

  const fetchTransactions = async (
    page = pagination.page,
    limit = pagination.limit,
    search = searchTerm,
    datePreset = dateFilter
  ) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        limit,
      };
      if (filters.type !== 'all') params.type = filters.type;
      if (filters.category !== 'all') params.category = filters.category;
      if (search && search.trim()) params.search = search.trim();
      const dateRange = getDateRangeFromPreset(datePreset);
      if (dateRange?.from && dateRange?.to) {
        params.from = dateRange.from.toISOString();
        params.to = dateRange.to.toISOString();
      }

      const response = await listTransactions(params);
      setTransactions(response.data || []);
      setPagination(response.pagination || { page, limit, total: 0, pages: 1 });
    } catch (err) {
      setError(err.message || 'Unable to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    try {
      const response = await getTransactionSummary({
        from: start.toISOString(),
        to: end.toISOString(),
      });
      setSummary(response.data || { income: 0, expense: 0 });
    } catch (err) {
      setSummary({ income: 0, expense: 0 });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getTransactionCategories();
      setCategories(response.data || { income: [], expense: [] });
    } catch (err) {
      setCategories({ income: [], expense: [] });
    }
  };

  useEffect(() => {
    fetchTransactions(1, pagination.limit);
    fetchSummary();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions(1, pagination.limit);
  }, [filters, dateFilter]);

  useEffect(() => {
    const handle = setTimeout(() => {
      fetchTransactions(1, pagination.limit, searchTerm);
    }, 300);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  useEffect(() => {
    if (location.state?.openAddModal) {
      resetForm();
      setIsModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location]);

  const handleFilterChange = (field) => (event) => {
    setFilters((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleFormChange = (field) => (event) => {
    const value = event.target.value;
    setFormState((prev) => {
      if (field === 'type') {
        return { ...prev, type: value, category: '' };
      }
      return { ...prev, [field]: value };
    });
  };

  const resetForm = () => {
    setFormState({
      amount: '',
      date: toLocalDate(new Date()),
      note: '',
      type: 'expense',
      category: '',
    });
    setFormStatus({ loading: false, error: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formStatus.loading) return;
    setFormStatus({ loading: true, error: '' });
    try {
      const payload = {
        amount: Number(formState.amount),
        date: formState.date || undefined,
        note: formState.note,
        type: formState.type,
        category: formState.category,
      };
      const response = await createTransaction(payload);
      setTransactions((prev) => [response.data, ...prev].slice(0, pagination.limit));
      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));
      await fetchSummary();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setFormStatus({ loading: false, error: err.message || 'Unable to save transaction.' });
    }
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.pages) return;
    fetchTransactions(nextPage, pagination.limit);
  };

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

  return (
    <AppShell
      sideNavVariant="transactions"
      className="bg-background font-body text-on-background selection:bg-primary-container selection:text-on-primary-container"
    >
      <main className="lg:ml-64 min-h-screen flex flex-col">
        <TopNav
          variant="transactions"
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search transactions..."
        />
{/* TopNavBar (Authority: JSON & Design System) */}
        
        {/* Page Canvas */}
        <section className="p-8 max-w-7xl w-full mx-auto space-y-8 flex-1">
            {/* Hero Header Section (Asymmetric Editorial Style) */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-4">
                <div>
                    <h2 className="text-on-surface-variant font-label text-sm font-semibold tracking-widest uppercase mb-1">
                        Financial Oversight</h2>
                    <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-on-background tracking-tight">
                        Transactions</h1>
                </div>
                <div className="flex w-full md:w-auto flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 bg-surface-container-low p-6 rounded-2xl">
                    <div className="text-right">
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Monthly
                            Spending</p>
                        <p className="text-2xl font-bold font-headline text-primary">{formattedMonthlyExpense}</p>
                    </div>
                    <div className="w-24 h-12">
                        {/* Simplified Sparkline Concept */}
                        <div className="flex items-end gap-1 h-full">
                            <div className="w-2 bg-primary/20 rounded-t-sm h-1/2"></div>
                            <div className="w-2 bg-primary/20 rounded-t-sm h-3/4"></div>
                            <div className="w-2 bg-primary/20 rounded-t-sm h-2/3"></div>
                            <div className="w-2 bg-primary/20 rounded-t-sm h-full"></div>
                            <div className="w-2 bg-primary/40 rounded-t-sm h-5/6"></div>
                            <div className="w-2 bg-primary rounded-t-sm h-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-end">
              <button
                className="inline-flex items-center gap-2 bg-primary text-on-primary rounded-2xl px-5 py-3 text-sm font-bold shadow-sm hover:opacity-90 transition"
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                type="button"
              >
                <span className="material-symbols-outlined text-base">add</span>
                Add Transaction
              </button>
            </div>
            {/* Filter Bar (Glassmorphism / Borderless Surface) */}
            <div className="bg-surface-container rounded-3xl p-4 flex flex-wrap items-center gap-4 shadow-sm">
                <div
                    className="flex items-center gap-2 bg-surface-container-lowest rounded-2xl px-4 py-2 flex-1 min-w-[200px]">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">category</span>
                    <select
                      className="bg-transparent border-none text-sm font-medium focus:ring-0 w-full cursor-pointer"
                      onChange={handleFilterChange('category')}
                      value={filters.category}
                    >
                      <option value="all">All Categories</option>
                      {allCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                </div>
                <div
                    className="flex items-center gap-2 bg-surface-container-lowest rounded-2xl px-4 py-2 flex-1 min-w-[200px]">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">calendar_today</span>
                    <select
                      className="bg-transparent border-none text-sm font-medium focus:ring-0 w-full cursor-pointer"
                      value={dateFilter}
                      onChange={(event) => setDateFilter(event.target.value)}
                    >
                        <option value="today">Today</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="quarter">This Quarter</option>
                        <option value="ytd">Year to Date</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>
                <div
                    className="flex items-center gap-2 bg-surface-container-lowest rounded-2xl px-4 py-2 flex-1 min-w-[200px]">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">swap_horiz</span>
                    <select
                      className="bg-transparent border-none text-sm font-medium focus:ring-0 w-full cursor-pointer"
                      onChange={handleFilterChange('type')}
                      value={filters.type}
                    >
                      <option value="all">All Types</option>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                </div>
                <button
                    className="bg-surface-container-high hover:bg-surface-container-highest p-3 rounded-2xl transition-all">
                    <span className="material-symbols-outlined">tune</span>
                </button>
            </div>
            {/* Transaction Table (Serene Architect Style: Borderless, Spaced) */}
            <div className="bg-surface-container-lowest rounded-3xl overflow-x-auto shadow-sm">
                <table className="w-full min-w-[720px] text-left border-collapse">
                    <thead>
                        <tr
                            className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-widest font-bold">
                            <th className="px-8 py-5">Date</th>
                            <th className="px-4 py-5">Description</th>
                            <th className="px-4 py-5">Category</th>
                            {/* <th className="px-4 py-5">Status</th> */}
                            <th className="px-8 py-5 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50">
                      {loading && (
                        <tr>
                          <td className="px-8 py-10 text-sm text-on-surface-variant" colSpan={4}>
                            Loading transactions...
                          </td>
                        </tr>
                      )}
                      {!loading && error && (
                        <tr>
                          <td className="px-8 py-10 text-sm text-error" colSpan={4}>
                            {error}
                          </td>
                        </tr>
                      )}
                      {!loading && !error && transactions.length === 0 && (
                        <tr>
                          <td className="px-8 py-10 text-sm text-on-surface-variant" colSpan={4}>
                            No transactions yet. Add your first one to get started.
                          </td>
                        </tr>
                      )}
                      {!loading &&
                        !error &&
                        transactions.map((transaction) => (
                          <tr
                            className="group hover:bg-surface-container-low transition-colors cursor-pointer"
                            key={transaction._id}
                          >
                            <td className="px-8 py-6">
                              <span className="text-sm font-semibold text-on-background">
                                {formatDate(transaction)}
                              </span>
                            </td>
                            <td className="px-4 py-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                  <span className="material-symbols-outlined text-xl">
                                    {transaction.type === 'income' ? 'payments' : 'shopping_bag'}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-on-background">
                                    {transaction.note || transaction.category}
                                  </p>
                                  <p className="text-xs text-on-surface-variant">{transaction.type}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-6">
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  transaction.type === 'income'
                                    ? 'bg-primary-container text-on-primary-container'
                                    : 'bg-secondary-container text-on-secondary-container'
                                }`}
                              >
                                {transaction.category}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <span
                                className={`text-sm font-extrabold ${
                                  transaction.type === 'income' ? 'text-primary' : 'text-on-background'
                                }`}
                              >
                                {formatAmount(transaction)}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                </table>
                {/* Pagination (Minimalist) */}
                <div className="px-8 py-6 bg-surface-container-low flex items-center justify-between">
                    <p className="text-xs font-medium text-on-surface-variant">
                      Showing{' '}
                      <span className="text-on-background font-bold">
                        {transactions.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}-
                        {(pagination.page - 1) * pagination.limit + transactions.length}
                      </span>{' '}
                      of <span className="text-on-background font-bold">{pagination.total}</span> transactions
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-container-lowest text-on-surface-variant hover:text-primary transition-all shadow-sm"
                            onClick={() => handlePageChange(pagination.page - 1)}
                            type="button"
                            disabled={pagination.page <= 1}
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <div className="flex items-center px-4 gap-4">
                          <span className="text-sm font-bold text-primary underline underline-offset-4 decoration-2">
                            {pagination.page}
                          </span>
                        </div>
                        <button
                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-container-lowest text-on-surface-variant hover:text-primary transition-all shadow-sm"
                            onClick={() => handlePageChange(pagination.page + 1)}
                            type="button"
                            disabled={pagination.page >= pagination.pages}
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* Bento-style Insights (Secondary Content) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                    className="col-span-1 md:col-span-2 bg-primary rounded-3xl p-8 text-on-primary relative overflow-hidden flex flex-col justify-between min-h-[200px]">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold font-headline mb-2">Spending Intelligence</h3>
                        <p className="text-sm opacity-80 max-w-xs leading-relaxed">You've spent 12% less on groceries this
                            month compared to your average. Keep it up to reach your savings goal.</p>
                    </div>
                    <div className="relative z-10 mt-4">
                        <button
                            className="bg-on-primary text-primary px-6 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform">
                            View Report
                        </button>
                    </div>
                    {/* Decorative Element */}
                    <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl">
                    </div>
                    <div className="absolute right-8 top-8 opacity-20">
                        <span className="material-symbols-outlined text-8xl"
                            style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
                    </div>
                </div>
                <div className="bg-surface-container-highest rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Export Data
                        </h3>
                        <p className="text-xs text-on-surface-variant leading-relaxed mb-6">Generate CSV or PDF reports for
                            your accountant or tax records.</p>
                    </div>
                    <div className="space-y-3">
                        <button
                            className="w-full bg-surface-container-lowest py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-white shadow-sm transition-all">
                            <span className="material-symbols-outlined text-lg">description</span>
                            Download CSV
                        </button>
                        <button
                            className="w-full bg-surface-container-lowest py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-white shadow-sm transition-all">
                            <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>
        </section>
        {/* Footer Context */}
        <footer className="p-8 border-t border-slate-200/50 mt-auto">
            <div
                className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant font-medium">
                <p>© 2023 SpendWise Finance Architecture. All transactions are encrypted.</p>
                <div className="flex gap-6">
                    <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                    <a className="hover:text-primary transition-colors" href="#">Security Standards</a>
                    <a className="hover:text-primary transition-colors" href="#">Contact Support</a>
                </div>
            </div>
        </footer>
      </main>
      <>
        <div
          className={`fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-[100] ${
            isModalOpen ? 'flex' : 'hidden'
          } items-center justify-center p-4`}
        >
          <div className="bg-surface-container-lowest rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold font-headline text-on-background">Add Transaction</h2>
              <button
                className="text-on-surface-variant hover:text-error transition-colors"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form className="p-8 space-y-6" onSubmit={handleSubmit}>
              {formStatus.error && (
                <p className="text-sm font-semibold text-error">{formStatus.error}</p>
              )}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Amount
                  </label>
                  <input
                    className="w-full bg-surface-container border-none rounded-2xl p-4 text-xl font-bold text-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="$0.00"
                    type="number"
                    value={formState.amount}
                    onChange={handleFormChange('amount')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Date</label>
                  <input
                    className="w-full bg-surface-container border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                    type="date"
                    value={formState.date}
                    onChange={handleFormChange('date')}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Description
                </label>
                <input
                  className="w-full bg-surface-container border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Where did you spend?"
                  type="text"
                  value={formState.note}
                  onChange={handleFormChange('note')}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Type</label>
                  <select
                    className="w-full bg-surface-container border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formState.type}
                    onChange={handleFormChange('type')}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Category
                  </label>
                  <select
                    className="w-full bg-surface-container border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formState.category}
                    onChange={handleFormChange('category')}
                  >
                    <option value="">Select category</option>
                    {activeCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pt-2">
                <button
                  className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-70"
                  type="submit"
                  disabled={formStatus.loading}
                >
                  {formStatus.loading ? 'Saving...' : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    </AppShell>
  );
};

export default TransactionsPage;
