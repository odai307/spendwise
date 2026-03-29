import { useEffect, useMemo, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import TopNav from '../components/layout/TopNav';
import { useAuth } from '../context/AuthContext.jsx';
import { getTransactionSummary } from '../services/transactionApi';

const ReportsPage = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'GHS';
  const [summary, setSummary] = useState({ income: 0, expense: 0 });

  const formatCurrency = useMemo(() => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency });
  }, [currency]);

  const netSavings = useMemo(() => {
    return (summary.income || 0) - (summary.expense || 0);
  }, [summary]);

  const savingsPercentage = useMemo(() => {
    if (summary.income === 0) return 0;
    return Math.round((netSavings / summary.income) * 100);
  }, [netSavings, summary.income]);

  const expensePercentage = useMemo(() => {
    if (summary.income === 0) return 0;
    return Math.round((summary.expense / summary.income) * 100);
  }, [summary.expense, summary.income]);

  useEffect(() => {
    let isMounted = true;
    getTransactionSummary()
      .then((response) => {
        if (!isMounted) return;
        setSummary(response.data || { income: 0, expense: 0 });
      })
      .catch(() => {
        if (!isMounted) return;
        setSummary({ income: 0, expense: 0 });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AppShell sideNavVariant="reports" className="bg-background text-on-background selection:bg-primary-container">
      <main className="lg:ml-64 min-h-screen relative">
        <TopNav variant="reports" />
{/* TopNavBar */}
        
        {/* Content Canvas */}
        <div className="pt-12 pb-12 px-8 max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-headline font-extrabold tracking-tight text-on-background">Financial
                        Analytics</h2>
                    <p className="text-on-surface-variant mt-2 font-medium">Deep dive into your spending patterns and growth
                        metrics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-surface-container flex p-1 rounded-xl">
                        <button
                            className="px-4 py-2 text-xs font-bold bg-surface-container-lowest shadow-sm rounded-lg text-primary">Monthly</button>
                        <button
                            className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface">Quarterly</button>
                        <button
                            className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface">Yearly</button>
                    </div>
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant/15 rounded-xl text-sm font-semibold hover:bg-surface-container-high transition-all">
                        <span className="material-symbols-outlined text-[18px]" data-icon="ios_share">ios_share</span>
                        Export
                    </button>
                </div>
            </div>
            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Comparison Summary Card */}
                <div
                    className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_12px_32px_rgba(43,52,55,0.04)] flex flex-col justify-between overflow-hidden">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Net
                            Savings</span>
                        <p className="text-3xl font-headline font-extrabold text-primary mt-2">
                          {formatCurrency.format(netSavings)}
                        </p>
                    </div>
                    <div className="mt-8">
                        <div className="flex items-center gap-2 text-tertiary font-bold text-sm">
                            <span className="material-symbols-outlined text-[18px]"
                                data-icon="trending_up">trending_up</span>
                            {savingsPercentage}% of income saved
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1">
                          {netSavings > 0
                            ? `You're saving ${formatCurrency.format(netSavings)} this month.`
                            : `You're spending ${formatCurrency.format(Math.abs(netSavings))} more than earning.`
                          }
                        </p>
                    </div>
                </div>
                <div
                    className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_12px_32px_rgba(43,52,55,0.04)] flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Total
                            Income</span>
                        <p className="text-3xl font-headline font-extrabold text-on-background mt-2">
                          {formatCurrency.format(summary.income || 0)}
                        </p>
                    </div>
                    <div className="mt-8 space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                            <span className="text-on-surface-variant">Income Status</span>
                            <span className="text-primary">{expensePercentage}% spent</span>
                        </div>
                        <div className="h-2 w-full bg-primary-container rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${Math.min(expensePercentage, 100)}%` }}></div>
                        </div>
                    </div>
                </div>
                <div
                    className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_12px_32px_rgba(43,52,55,0.04)] flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Total
                            Expenses</span>
                        <p className="text-3xl font-headline font-extrabold text-error mt-2">
                          {formatCurrency.format(summary.expense || 0)}
                        </p>
                    </div>
                    <div className="mt-8">
                        <div className="flex items-center gap-2 text-error font-bold text-sm">
                            <span className="material-symbols-outlined text-[18px]"
                                data-icon="trending_down">trending_down</span>
                            {expensePercentage}% of income
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1">
                          {expensePercentage > 80
                            ? 'High spending detected. Review your expenses.'
                            : expensePercentage > 60
                              ? 'Moderate spending. Stay on track.'
                              : 'Great spending control!'}
                        </p>
                    </div>
                </div>
            </div>
            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Trend Area Chart */}
                <div
                    className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_12px_32px_rgba(43,52,55,0.04)]">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-headline font-bold text-on-background">Monthly Trend</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-primary"></span>
                                <span className="text-xs font-bold text-on-surface-variant">Income</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-error"></span>
                                <span className="text-xs font-bold text-on-surface-variant">Expenses</span>
                            </div>
                        </div>
                    </div>
                    {/* Chart Mockup (SVG) */}
                    <div className="h-[320px] w-full relative">
                        <svg className="w-full h-full" viewBox="0 0 800 300">
                            {/* Income Area */}
                            <defs>
                                <lineargradient id="incomeGrad" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#1f6869" stopOpacity="0.2"></stop>
                                    <stop offset="100%" stopColor="#1f6869" stopOpacity="0"></stop>
                                </lineargradient>
                                <lineargradient id="expenseGrad" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#9f403d" stopOpacity="0.1"></stop>
                                    <stop offset="100%" stopColor="#9f403d" stopOpacity="0"></stop>
                                </lineargradient>
                            </defs>
                            {/* Grid Lines */}
                            <line stroke="#eaeff1" strokeWidth="1" x1="0" x2="800" y1="50" y2="50"></line>
                            <line stroke="#eaeff1" strokeWidth="1" x1="0" x2="800" y1="150" y2="150"></line>
                            <line stroke="#eaeff1" strokeWidth="1" x1="0" x2="800" y1="250" y2="250"></line>
                            {/* Income Path */}
                            <path d="M0,250 Q100,200 200,180 T400,140 T600,100 T800,80 L800,300 L0,300 Z"
                                fill="url(#incomeGrad)"></path>
                            <path d="M0,250 Q100,200 200,180 T400,140 T600,100 T800,80" fill="none" stroke="#1f6869"
                                strokeLinecap="round" strokeWidth="3"></path>
                            {/* Expense Path */}
                            <path d="M0,280 Q100,260 200,240 T400,220 T600,230 T800,210 L800,300 L0,300 Z"
                                fill="url(#expenseGrad)"></path>
                            <path d="M0,280 Q100,260 200,240 T400,220 T600,230 T800,210" fill="none" stroke="#9f403d"
                                strokeDasharray="8 4" strokeLinecap="round" strokeWidth="3"></path>
                        </svg>
                        <div
                            className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[10px] font-bold text-on-surface-variant/60 uppercase">
                            <span>Jun</span>
                            <span>Jul</span>
                            <span>Aug</span>
                            <span>Sep</span>
                            <span>Oct</span>
                            <span>Nov</span>
                        </div>
                    </div>
                </div>
                {/* Category Breakdown Pie */}
                <div
                    className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_12px_32px_rgba(43,52,55,0.04)] flex flex-col">
                    <h3 className="text-xl font-headline font-bold text-on-background mb-8">Category Breakdown</h3>
                    <div className="relative flex-1 flex flex-col items-center justify-center">
                        {/* Custom Donut Chart CSS Layout */}
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#eaeff1" strokeWidth="12">
                                </circle>
                                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#1f6869"
                                    strokeDasharray="160 251.2" strokeWidth="12"></circle>
                                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#49636f"
                                    strokeDasharray="60 251.2" strokeDashoffset="-160" strokeWidth="12"></circle>
                                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#ccedd7"
                                    strokeDasharray="31.2 251.2" strokeDashoffset="-220" strokeWidth="12"></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-sm font-headline font-extrabold">
                                  {formatCurrency.format(summary.expense || 0)}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-on-surface-variant">Spent</span>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="w-full mt-10 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                                    <span className="font-medium text-on-surface-variant">Housing &amp; Rent</span>
                                </div>
                                <span className="font-bold text-on-background">64%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                    <span className="font-medium text-on-surface-variant">Food &amp; Dining</span>
                                </div>
                                <span className="font-bold text-on-background">24%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
                                    <span className="font-medium text-on-surface-variant">Utilities</span>
                                </div>
                                <span className="font-bold text-on-background">12%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Bottom Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Spending Intensity */}
                <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_12px_32px_rgba(43,52,55,0.04)]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-headline font-bold text-on-background">Spending Intensity</h3>
                        <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">Heatmap
                            View</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {/* Simulated Heatmap Grid (7 days x 4 weeks) */}
                        <div className="h-8 rounded bg-primary/10"></div>
                        <div className="h-8 rounded bg-primary/40"></div>
                        <div className="h-8 rounded bg-primary/20"></div>
                        <div className="h-8 rounded bg-primary/70"></div>
                        <div className="h-8 rounded bg-primary/10"></div>
                        <div className="h-8 rounded bg-primary/10"></div>
                        <div className="h-8 rounded bg-primary/10"></div>
                        <div className="h-8 rounded bg-primary/5"></div>
                        <div className="h-8 rounded bg-primary/5"></div>
                        <div className="h-8 rounded bg-primary/20"></div>
                        <div className="h-8 rounded bg-primary/90"></div>
                        <div className="h-8 rounded bg-primary/60"></div>
                        <div className="h-8 rounded bg-primary/10"></div>
                        <div className="h-8 rounded bg-primary/5"></div>
                        <div className="h-8 rounded bg-primary/20"></div>
                        <div className="h-8 rounded bg-primary/10"></div>
                        <div className="h-8 rounded bg-primary/5"></div>
                        <div className="h-8 rounded bg-primary/5"></div>
                        <div className="h-8 rounded bg-primary/5"></div>
                        <div className="h-8 rounded bg-primary/40"></div>
                        <div className="h-8 rounded bg-primary/10"></div>
                        <div className="h-8 rounded bg-primary/5"></div>
                        <div className="h-8 rounded bg-primary/30"></div>
                        <div className="h-8 rounded bg-primary/10"></div>
                        <div className="h-8 rounded bg-primary/5"></div>
                        <div className="h-8 rounded bg-primary/10"></div>
                        <div className="h-8 rounded bg-primary/10"></div>
                        <div className="h-8 rounded bg-primary/5"></div>
                    </div>
                    <div className="mt-4 flex justify-between text-[10px] font-bold text-on-surface-variant/40">
                        <span>MON</span>
                        <span>TUE</span>
                        <span>WED</span>
                        <span>THU</span>
                        <span>FRI</span>
                        <span>SAT</span>
                        <span>SUN</span>
                    </div>
                </div>
                {/* Monthly Goals */}
                <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_12px_32px_rgba(43,52,55,0.04)]">
                    <h3 className="text-xl font-headline font-bold text-on-background mb-6">Financial Milestones</h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-12 h-12 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary">
                                <span className="material-symbols-outlined" data-icon="savings">savings</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-bold">New Car Fund</span>
                                    <span className="text-sm font-bold">$12,000 / $25,000</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-tertiary w-[48%]"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div
                                className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined" data-icon="flight">flight</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-bold">Japan Trip 2024</span>
                                    <span className="text-sm font-bold">$4,500 / $5,000</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[90%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
      <>
{/* Mobile BottomNavBar (Simplified for Mobile View) */}
    <div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl flex justify-around items-center h-16 px-4 z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
        <button className="text-slate-400 p-2">
            <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
        </button>
        <button className="text-slate-400 p-2">
            <span className="material-symbols-outlined" data-icon="receipt_long">receipt_long</span>
        </button>
        <button className="bg-primary text-on-primary p-3 rounded-full -translate-y-4 shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined" data-icon="add">add</span>
        </button>
        <button className="text-teal-800 p-2 border-t-2 border-teal-800 rounded-none">
            <span className="material-symbols-outlined" data-icon="bar_chart"
                style={{ fontVariationSettings: "'FILL' 1" }}>bar_chart</span>
        </button>
        <button className="text-slate-400 p-2">
            <span className="material-symbols-outlined" data-icon="settings">settings</span>
        </button>
    </div>
      </>
    </AppShell>
  );
};

export default ReportsPage;
