import { useEffect, useMemo, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import TopNav from '../components/layout/TopNav';
import { useAuth } from '../context/AuthContext.jsx';
import { getTransactionCategories } from '../services/transactionApi';
import { getBudget, getBudgetStatus, upsertBudget } from '../services/budgetApi';

const BudgetPage = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'GHS';
  const [monthOffset, setMonthOffset] = useState(0);
  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [budget, setBudget] = useState({ month: '', categoryLimits: [] });
  const [status, setStatus] = useState({ month: '', categories: [], totalBudget: 0, totalSpent: 0 });
  const [limitsDraft, setLimitsDraft] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const formatter = useMemo(
    () => new Intl.NumberFormat('en-US', { style: 'currency', currency }),
    [currency]
  );

  const currentMonth = useMemo(() => {
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }, [monthOffset]);

  const monthLabel = useMemo(() => {
    const [year, month] = currentMonth.split('-').map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }, [currentMonth]);

  const budgetMap = useMemo(() => {
    return new Map(budget.categoryLimits.map((item) => [item.category, item.limit]));
  }, [budget.categoryLimits]);

  const statusMap = useMemo(() => {
    return new Map(status.categories.map((item) => [item.category, item]));
  }, [status.categories]);

  const expenseCategories = useMemo(() => categories.expense || [], [categories]);

  useEffect(() => {
    let isMounted = true;
    getTransactionCategories()
      .then((response) => {
        if (!isMounted) return;
        setCategories(response.data || { income: [], expense: [] });
      })
      .catch(() => {
        if (!isMounted) return;
        setCategories({ income: [], expense: [] });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    Promise.all([getBudget({ month: currentMonth }), getBudgetStatus({ month: currentMonth })])
      .then(([budgetResponse, statusResponse]) => {
        if (!isMounted) return;
        const budgetData = budgetResponse.data || { month: currentMonth, categoryLimits: [] };
        const statusData = statusResponse.data || {
          month: currentMonth,
          categories: [],
          totalBudget: 0,
          totalSpent: 0,
        };
        setBudget(budgetData);
        setStatus(statusData);
        const draft = {};
        budgetData.categoryLimits.forEach((item) => {
          draft[item.category] = String(item.limit);
        });
        setLimitsDraft(draft);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.message || 'Unable to load budgets.');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentMonth]);

  const handleLimitChange = (category) => (event) => {
    const value = event.target.value;
    setLimitsDraft((prev) => ({ ...prev, [category]: value }));
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        month: currentMonth,
        categoryLimits: Object.entries(limitsDraft)
          .filter(([, value]) => value !== '' && !Number.isNaN(Number(value)))
          .map(([category, value]) => ({ category, limit: Number(value) })),
      };
      const response = await upsertBudget(payload);
      setBudget(response.data || { month: currentMonth, categoryLimits: payload.categoryLimits });
      const statusResponse = await getBudgetStatus({ month: currentMonth });
      setStatus(statusResponse.data || status);
    } catch (err) {
      setError(err?.message || 'Unable to save budget.');
    } finally {
      setSaving(false);
    }
  };

  const totalBudget = status.totalBudget || 0;
  const totalSpent = status.totalSpent || 0;
  const percentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <AppShell sideNavVariant="budget" className="bg-background text-on-background min-h-screen">
      <main className="pb-12 px-6 lg:ml-64 min-h-screen">
        <TopNav variant="budget" />
        <div className="max-w-6xl mx-auto pt-12">
          {/* Month Selector & Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-extrabold text-on-background mb-2 tracking-tight">Financial Sanctuaries</h2>
              <p className="text-on-surface-variant max-w-md">
                Your monthly budgets act as the structural integrity of your financial freedom. Adjust and grow with
                serenity.
              </p>
            </div>
            <div className="flex items-center gap-2 p-1 bg-surface-container rounded-full w-fit">
              <button
                className="p-2 rounded-full hover:bg-surface-container-lowest transition-all"
                onClick={() => setMonthOffset((prev) => prev - 1)}
                type="button"
              >
                <span className="material-symbols-outlined text-on-surface-variant" data-icon="chevron_left">
                  chevron_left
                </span>
              </button>
              <div className="px-4 py-1 text-sm font-bold text-primary brand-font tracking-wide uppercase">
                {monthLabel}
              </div>
              <button
                className="p-2 rounded-full hover:bg-surface-container-lowest transition-all"
                onClick={() => setMonthOffset((prev) => prev + 1)}
                type="button"
              >
                <span className="material-symbols-outlined text-on-surface-variant" data-icon="chevron_right">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
          {/* Budget Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Summary Card (Bento Style) */}
            <div className="md:col-span-2 xl:col-span-1 bg-primary text-on-primary p-8 rounded-full flex flex-col justify-between relative overflow-hidden shadow-xl shadow-primary/10">
              <div className="relative z-10">
                <div className="text-on-primary/70 text-sm font-medium mb-1">Total Monthly Budget</div>
                <div className="text-5xl font-extrabold tracking-tighter brand-font">
                  {formatter.format(totalBudget)}
                </div>
              </div>
              <div className="relative z-10 mt-8">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2 text-on-primary/60">
                  <span>Used ({percentUsed}%)</span>
                  <span>{formatter.format(totalSpent)}</span>
                </div>
                <div className="h-3 w-full bg-on-primary/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-fixed rounded-full shadow-[0_0_12px_rgba(170,239,239,0.5)]"
                    style={{ width: `${percentUsed}%` }}
                  ></div>
                </div>
              </div>
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl"></div>
            </div>
            {loading && (
              <div className="md:col-span-2 xl:col-span-2 text-on-surface-variant text-sm">Loading budgets...</div>
            )}
            {!loading && error && (
              <div className="md:col-span-2 xl:col-span-2 text-error text-sm">{error}</div>
            )}
            {!loading &&
              !error &&
              expenseCategories.map((category) => {
                const limit = budgetMap.get(category) || 0;
                const categoryStatus = statusMap.get(category);
                const spent = categoryStatus?.spent || 0;
                const remaining = Math.max(limit - spent, 0);
                const usedPercent = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
                const isCritical = usedPercent >= 90 && limit > 0;
                const barClass = isCritical ? 'bg-error' : 'bg-primary';

                return (
                  <div
                    className="bg-surface-container-lowest p-6 rounded-full group hover:bg-surface-container-high transition-all duration-300"
                    key={category}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                        <span className="material-symbols-outlined" data-icon="account_balance_wallet">
                          account_balance_wallet
                        </span>
                      </div>
                      <button
                        className="p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-on-surface-variant text-lg" data-icon="more_vert">
                          more_vert
                        </span>
                      </button>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-on-background brand-font">{category}</h3>
                      <div className="text-on-surface-variant text-sm mt-1">
                        {formatter.format(spent)} of {formatter.format(limit)} used
                      </div>
                    </div>
                    <div className="relative h-2 w-full bg-surface-container rounded-full overflow-hidden mb-2">
                      <div className={`h-full ${barClass} rounded-full`} style={{ width: `${usedPercent}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className={`text-xs font-semibold ${isCritical ? 'text-error' : 'text-primary'}`}>
                        {usedPercent}% used
                      </span>
                      <span className="text-xs font-bold text-on-surface-variant">
                        {formatter.format(remaining)} Left
                      </span>
                    </div>
                    <div className="mt-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Limit
                      </label>
                      <input
                        className="mt-2 w-full bg-surface-container border-none rounded-2xl p-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="0.00"
                        type="number"
                        min="0"
                        value={limitsDraft[category] ?? ''}
                        onChange={handleLimitChange(category)}
                      />
                    </div>
                  </div>
                );
              })}
            {!loading && !error && (
              <button
                className="bg-surface-container-low border-2 border-dashed border-outline-variant/30 p-6 rounded-full flex flex-col items-center justify-center gap-4 group hover:bg-surface-container-high transition-all duration-300 min-h-[220px]"
                onClick={handleSave}
                type="button"
                disabled={saving}
              >
                <div className="w-14 h-14 rounded-full bg-surface-container-lowest flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <span className="material-symbols-outlined text-primary text-3xl" data-icon="add">
                    add
                  </span>
                </div>
                <div className="text-center">
                  <div className="font-bold text-on-background brand-font">{saving ? 'Saving...' : 'Save Limits'}</div>
                  <div className="text-on-surface-variant text-xs mt-1">Apply the updated category limits</div>
                </div>
              </button>
            )}
          </div>
          {/* Insights Section (Tonal Shift) */}
          <div className="mt-16 p-10 bg-surface-container rounded-full flex flex-col md:flex-row items-center gap-10">
            <div className="w-full md:w-1/3">
              <img
                alt="Savings Insight"
                className="w-full h-48 object-cover rounded-full shadow-lg"
                data-alt="A small green sprout growing out of a pile of gold coins, symbolizing growth and savings, soft natural lighting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC311ABNxIcx_Q7UMavBvMoo_roZRk6rJ2s6UsB7dpiDvkVcuK56MzcqaYbEibCFYiXK4jH2n-AnN82fWWebW1pqhF0xBTLuZl4i8vu2RWyZMoIb4WFXaUr_sGcfoIHypjPh5cOyBN14p-d5MAF2Tg-CQX1BB6WxysaZCWjLGNb5emlCZjWEV_nPBcwTDh0Duf3sqw13Echd8X389FejicM6k-E5qCjACbfAKPiLoUKWrX3WH_tTTuW75xfCqVgWv-BRaUuHSahIcQ"
              />
            </div>
            <div className="flex-1">
              <div className="inline-block px-3 py-1 bg-tertiary-container text-on-tertiary-container text-xs font-bold rounded-full mb-4 uppercase tracking-widest">
                Growth Insight
              </div>
              <h3 className="text-2xl font-bold text-on-background mb-3 brand-font">
                You're on track to save $450 this month
              </h3>
              <p className="text-on-surface-variant mb-6 leading-relaxed">
                Your spending in "Transport" and "Dining" is 15% lower than last month. This architectural approach to
                your finances is building a secure foundation for your future goals.
              </p>
              <button className="px-6 py-2 bg-primary text-on-primary rounded-full font-bold hover:shadow-lg hover:shadow-primary/20 transition-all text-sm">
                Review Savings Goals
              </button>
            </div>
          </div>
        </div>
      </main>
      <>
        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-xl h-16 flex items-center justify-around z-50 shadow-2xl border-t border-slate-200/20">
          <a className="flex flex-col items-center text-slate-500 font-medium text-[10px] gap-1" href="#">
            <span className="material-symbols-outlined" data-icon="dashboard">
              dashboard
            </span>
            Dashboard
          </a>
          <a className="flex flex-col items-center text-slate-500 font-medium text-[10px] gap-1" href="#">
            <span className="material-symbols-outlined" data-icon="receipt_long">
              receipt_long
            </span>
            History
          </a>
          <a className="flex flex-col items-center text-teal-700 dark:text-teal-300 font-bold text-[10px] gap-1" href="#">
            <span
              className="material-symbols-outlined"
              data-icon="account_balance_wallet"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_balance_wallet
            </span>
            Budgets
          </a>
          <a className="flex flex-col items-center text-slate-500 font-medium text-[10px] gap-1" href="#">
            <span className="material-symbols-outlined" data-icon="bar_chart">
              bar_chart
            </span>
            Reports
          </a>
        </nav>
        {/* Contextual FAB */}
        <button className="lg:hidden fixed bottom-20 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-2xl" data-icon="add">
            add
          </span>
        </button>
      </>
    </AppShell>
  );
};

export default BudgetPage;
