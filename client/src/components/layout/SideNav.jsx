import { Link } from 'react-router-dom';

const getMobileNavClass = (baseClass, isOpen) =>
  [
    baseClass,
    'md:hidden',
    'transition-transform',
    'duration-300',
    'ease-in-out',
    isOpen ? 'translate-x-0' : '-translate-x-full',
  ]
    .filter(Boolean)
    .join(' ');

const MobileOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
      onClick={onClose}
      role="presentation"
    />
  );
};

const MobileCloseButton = ({ onClose }) => (
  <button
    aria-label="Close navigation menu"
    className="absolute top-4 right-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
    onClick={onClose}
    type="button"
  >
    <span className="material-symbols-outlined text-on-surface-variant">close</span>
  </button>
);

const SideNav = ({ variant, isMobileOpen = false, onClose }) => {
  const handleMobileClick = (event) => {
    if (!onClose) return;
    if (event.target.closest('a')) {
      onClose();
    }
  };

  const renderTransactionsContent = () => (
    <>
      <div className="flex items-center gap-3 px-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary">
          <span
            className="material-symbols-outlined"
            data-icon="account_balance_wallet"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            account_balance_wallet
          </span>
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-teal-900 dark:text-teal-50 font-headline">SpendWise</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Premium Finance</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        <Link
          className="text-slate-500 dark:text-slate-400 px-4 py-3 font-medium hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-3 transition-all duration-300 ease-in-out hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl"
          to="/dashboard"
        >
          <span className="material-symbols-outlined" data-icon="dashboard">
            dashboard
          </span>
          <span>Dashboard</span>
        </Link>
        <Link
          className="bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 rounded-xl px-4 py-3 font-bold flex items-center gap-3 transition-all duration-300 ease-in-out"
          to="/transactions"
        >
          <span
            className="material-symbols-outlined"
            data-icon="receipt_long"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            receipt_long
          </span>
          <span>Transactions</span>
        </Link>
        <Link
          className="text-slate-500 dark:text-slate-400 px-4 py-3 font-medium hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-3 transition-all duration-300 ease-in-out hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl"
          to="/budgets"
        >
          <span className="material-symbols-outlined" data-icon="account_balance_wallet">
            account_balance_wallet
          </span>
          <span>Budgets</span>
        </Link>
        <Link
          className="text-slate-500 dark:text-slate-400 px-4 py-3 font-medium hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-3 transition-all duration-300 ease-in-out hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl"
          to="/reports"
        >
          <span className="material-symbols-outlined" data-icon="bar_chart">
            bar_chart
          </span>
          <span>Reports</span>
        </Link>
      </nav>
      <div className="mt-auto pt-6 border-t border-slate-200/50 space-y-1">
        <Link
          className="text-slate-500 dark:text-slate-400 px-4 py-2 font-medium hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-3 rounded-xl transition-all"
          to="/settings"
        >
          <span className="material-symbols-outlined" data-icon="settings">
            settings
          </span>
          <span>Settings</span>
        </Link>
        <a
          className="text-slate-500 dark:text-slate-400 px-4 py-2 font-medium hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-3 rounded-xl transition-all"
          href="#"
        >
          <span className="material-symbols-outlined" data-icon="help">
            help
          </span>
          <span>Support</span>
        </a>
      </div>
    </>
  );

  const renderBudgetContent = () => (
    <>
      <div className="flex items-center gap-3 mb-10 px-4">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
          <span className="material-symbols-outlined" data-icon="account_balance_wallet">
            account_balance_wallet
          </span>
        </div>
        <div>
          <div className="text-xl font-extrabold text-teal-900 dark:text-teal-50 brand-font">SpendWise</div>
          <div className="text-xs text-on-surface-variant font-medium">Premium Finance</div>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-1">
        <Link
          className="text-slate-500 dark:text-slate-400 px-4 py-3 font-medium hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 ease-in-out flex items-center gap-3"
          to="/dashboard"
        >
          <span className="material-symbols-outlined" data-icon="dashboard">
            dashboard
          </span>
          Dashboard
        </Link>
        <Link
          className="text-slate-500 dark:text-slate-400 px-4 py-3 font-medium hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 ease-in-out flex items-center gap-3"
          to="/transactions"
        >
          <span className="material-symbols-outlined" data-icon="receipt_long">
            receipt_long
          </span>
          Transactions
        </Link>
        <Link
          className="bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 rounded-xl px-4 py-3 font-bold flex items-center gap-3"
          to="/budgets"
        >
          <span
            className="material-symbols-outlined"
            data-icon="account_balance_wallet"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            account_balance_wallet
          </span>
          Budgets
        </Link>
        <Link
          className="text-slate-500 dark:text-slate-400 px-4 py-3 font-medium hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 ease-in-out flex items-center gap-3"
          to="/reports"
        >
          <span className="material-symbols-outlined" data-icon="bar_chart">
            bar_chart
          </span>
          Reports
        </Link>
      </nav>
      <div className="mt-auto flex flex-col gap-1 pt-6 border-t border-slate-200/50">
        <Link
          className="text-slate-500 dark:text-slate-400 px-4 py-3 font-medium hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl flex items-center gap-3"
          to="/settings"
        >
          <span className="material-symbols-outlined" data-icon="settings">
            settings
          </span>
          Settings
        </Link>
        <a
          className="text-slate-500 dark:text-slate-400 px-4 py-3 font-medium hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl flex items-center gap-3"
          href="#"
        >
          <span className="material-symbols-outlined" data-icon="help">
            help
          </span>
          Support
        </a>
      </div>
    </>
  );

  const renderReportsContent = () => (
    <>
      <div className="flex items-center gap-3 mb-10 px-4">
        <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl shadow-lg shadow-primary/20">
          <span
            className="material-symbols-outlined text-on-primary"
            data-icon="account_balance_wallet"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            account_balance_wallet
          </span>
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-teal-900 tracking-tight">SpendWise</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Premium Finance</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        <Link
          className="text-slate-500 px-4 py-3 font-medium hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all"
          to="/dashboard"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px]" data-icon="dashboard">
              dashboard
            </span>
            <span className="text-sm">Dashboard</span>
          </div>
        </Link>
        <Link
          className="text-slate-500 px-4 py-3 font-medium hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all"
          to="/transactions"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px]" data-icon="receipt_long">
              receipt_long
            </span>
            <span className="text-sm">Transactions</span>
          </div>
        </Link>
        <Link
          className="text-slate-500 px-4 py-3 font-medium hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all"
          to="/budgets"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px]" data-icon="account_balance_wallet">
              account_balance_wallet
            </span>
            <span className="text-sm">Budgets</span>
          </div>
        </Link>
        <Link className="bg-teal-50 text-teal-800 rounded-xl px-4 py-3 font-bold transition-all" to="/reports">
          <div className="flex items-center gap-3">
            <span
              className="material-symbols-outlined text-[20px]"
              data-icon="bar_chart"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bar_chart
            </span>
            <span className="text-sm">Reports</span>
          </div>
        </Link>
      </nav>
      <div className="mt-auto flex flex-col gap-1 pt-6 border-t border-slate-200/50">
        <Link
          className="text-slate-500 px-4 py-3 font-medium hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all"
          to="/settings"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px]" data-icon="settings">
              settings
            </span>
            <span className="text-sm">Settings</span>
          </div>
        </Link>
        <a
          className="text-slate-500 px-4 py-3 font-medium hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all"
          href="#"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px]" data-icon="help">
              help
            </span>
            <span className="text-sm">Support</span>
          </div>
        </a>
      </div>
    </>
  );

  const renderSettingsContent = () => (
    <>
      <div className="flex items-center gap-3 px-4 py-6">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary">
          <span className="material-symbols-outlined" data-icon="account_balance_wallet">
            account_balance_wallet
          </span>
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-teal-900 dark:text-teal-50 leading-tight">SpendWise</h1>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Premium Finance</p>
        </div>
      </div>
      <nav className="flex-1 mt-4 space-y-1">
        <Link
          className="flex items-center gap-3 text-slate-500 dark:text-slate-400 px-4 py-3 font-medium hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 ease-in-out"
          to="/dashboard"
        >
          <span className="material-symbols-outlined" data-icon="dashboard">
            dashboard
          </span>
          <span>Dashboard</span>
        </Link>
        <Link
          className="flex items-center gap-3 text-slate-500 dark:text-slate-400 px-4 py-3 font-medium hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 ease-in-out"
          to="/transactions"
        >
          <span className="material-symbols-outlined" data-icon="receipt_long">
            receipt_long
          </span>
          <span>Transactions</span>
        </Link>
        <Link
          className="flex items-center gap-3 text-slate-500 dark:text-slate-400 px-4 py-3 font-medium hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 ease-in-out"
          to="/budgets"
        >
          <span className="material-symbols-outlined" data-icon="account_balance_wallet">
            account_balance_wallet
          </span>
          <span>Budgets</span>
        </Link>
        <Link
          className="flex items-center gap-3 text-slate-500 dark:text-slate-400 px-4 py-3 font-medium hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 ease-in-out"
          to="/reports"
        >
          <span className="material-symbols-outlined" data-icon="bar_chart">
            bar_chart
          </span>
          <span>Reports</span>
        </Link>
      </nav>
      <div className="mt-auto space-y-1 pt-6 border-t border-slate-200/50">
        <Link
          className="flex items-center gap-3 bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 rounded-xl px-4 py-3 font-bold transition-all duration-300 ease-in-out"
          to="/settings"
        >
          <span
            className="material-symbols-outlined"
            data-icon="settings"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            settings
          </span>
          <span>Settings</span>
        </Link>
        <a
          className="flex items-center gap-3 text-slate-500 dark:text-slate-400 px-4 py-3 font-medium hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 ease-in-out"
          href="#"
        >
          <span className="material-symbols-outlined" data-icon="help">
            help
          </span>
          <span>Support</span>
        </a>
      </div>
    </>
  );

  const renderDashboardContent = () => (
    <>
      <div className="flex items-center gap-3 px-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
          <span className="material-symbols-outlined" data-icon="account_balance_wallet">
            account_balance_wallet
          </span>
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-teal-900 dark:text-teal-50 font-headline">SpendWise</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">Premium Finance</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        <Link
          className="bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 rounded-xl px-4 py-3 font-bold flex items-center gap-3"
          to="/dashboard"
        >
          <span className="material-symbols-outlined" data-icon="dashboard">
            dashboard
          </span>
          <span>Dashboard</span>
        </Link>
        <Link
          className="text-slate-500 dark:text-slate-400 px-4 py-3 font-medium hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl flex items-center gap-3 transition-colors"
          to="/transactions"
        >
          <span className="material-symbols-outlined" data-icon="receipt_long">
            receipt_long
          </span>
          <span>Transactions</span>
        </Link>
        <Link
          className="text-slate-500 dark:text-slate-400 px-4 py-3 font-medium hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl flex items-center gap-3 transition-colors"
          to="/budgets"
        >
          <span className="material-symbols-outlined" data-icon="account_balance_wallet">
            account_balance_wallet
          </span>
          <span>Budgets</span>
        </Link>
        <Link
          className="text-slate-500 dark:text-slate-400 px-4 py-3 font-medium hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl flex items-center gap-3 transition-colors"
          to="/reports"
        >
          <span className="material-symbols-outlined" data-icon="bar_chart">
            bar_chart
          </span>
          <span>Reports</span>
        </Link>
      </nav>
      <div className="mt-auto pt-6 space-y-1">
        <Link
          className="text-slate-500 dark:text-slate-400 px-4 py-3 font-medium hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl flex items-center gap-3 transition-colors"
          to="/settings"
        >
          <span className="material-symbols-outlined" data-icon="settings">
            settings
          </span>
          <span>Settings</span>
        </Link>
        <a
          className="text-slate-500 dark:text-slate-400 px-4 py-3 font-medium hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl flex items-center gap-3 transition-colors"
          href="#"
        >
          <span className="material-symbols-outlined" data-icon="help">
            help
          </span>
          <span>Support</span>
        </a>
      </div>
    </>
  );

  const renderWrapper = (content, desktopClass, mobileClass) => (
    <>
      <MobileOverlay isOpen={isMobileOpen} onClose={onClose} />
      <aside className={desktopClass}>{content}</aside>
      <aside className={getMobileNavClass(mobileClass, isMobileOpen)} onClickCapture={handleMobileClick}>
        <MobileCloseButton onClose={onClose} />
        {content}
      </aside>
    </>
  );

  switch (variant) {
    case 'transactions':
      return renderWrapper(
        renderTransactionsContent(),
        'hidden md:flex flex-col gap-2 p-6 h-screen border-r border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950 fixed left-0 top-0 w-64 z-50',
        'fixed inset-y-0 left-0 w-72 z-50 flex flex-col gap-2 p-6 border-r border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950'
      );
    case 'budget':
      return renderWrapper(
        renderBudgetContent(),
        'hidden md:flex flex-col gap-2 p-6 h-screen w-64 fixed left-0 top-0 bg-slate-50 dark:bg-slate-950 border-r border-slate-200/50 dark:border-slate-800/50 z-50',
        'fixed inset-y-0 left-0 w-72 z-50 flex flex-col gap-2 p-6 bg-slate-50 dark:bg-slate-950 border-r border-slate-200/50 dark:border-slate-800/50'
      );
    case 'reports':
      return renderWrapper(
        renderReportsContent(),
        'hidden md:flex flex-col gap-2 p-6 h-screen border-r border-slate-200/50 fixed left-0 top-0 w-64 bg-slate-50 transition-all duration-300 ease-in-out z-50',
        'fixed inset-y-0 left-0 w-72 z-50 flex flex-col gap-2 p-6 border-r border-slate-200/50 bg-slate-50'
      );
    case 'settings':
      return renderWrapper(
        renderSettingsContent(),
        'hidden md:flex flex-col gap-2 p-6 h-screen border-r border-slate-200/50 dark:border-slate-800/50 fixed left-0 top-0 w-64 bg-slate-50 dark:bg-slate-950 z-50',
        'fixed inset-y-0 left-0 w-72 z-50 flex flex-col gap-2 p-6 border-r border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950'
      );
    case 'dashboard':
    default:
      return renderWrapper(
        renderDashboardContent(),
        'hidden md:flex flex-col gap-2 p-6 h-screen border-r border-slate-200/50 dark:border-slate-800/50 h-screen w-64 fixed left-0 top-0 bg-slate-50 dark:bg-slate-950 transition-all duration-300 ease-in-out',
        'fixed inset-y-0 left-0 w-72 z-50 flex flex-col gap-2 p-6 border-r border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950'
      );
  }
};

export default SideNav;
