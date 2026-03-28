import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { AppShellContext } from './AppShell';

const TopNav = ({ variant, searchValue, onSearchChange, searchPlaceholder = 'Search transactions...' }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const appShell = useContext(AppShellContext);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'SpendWise User';

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const UserMenu = () => {
    if (!menuOpen) return null;
    return (
      <div className="absolute right-0 top-full mt-3 w-44 rounded-2xl bg-surface-container-lowest shadow-2xl border border-outline-variant/20 py-2 z-50">
        <Link
          className="block px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
          onClick={() => setMenuOpen(false)}
          to="/settings"
        >
          Settings
        </Link>
        <button
          className="w-full text-left px-4 py-2 text-sm font-semibold text-error hover:bg-error-container/20 transition-colors"
          onClick={handleLogout}
          type="button"
        >
          Log out
        </button>
      </div>
    );
  };
  return (
    <header className="docked full-width top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl flex justify-between items-center w-full px-8 py-4 h-16 sticky shadow-sm dark:shadow-none transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <button
          aria-label="Open navigation menu"
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
          onClick={() => appShell?.toggleMobileNav?.()}
          type="button"
        >
          <span className="material-symbols-outlined text-on-surface-variant">menu</span>
        </button>
        {variant === 'transactions' ? (
          <div className="relative w-full max-w-md group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
              search
            </span>
            <input
              className="w-full bg-surface-container border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder={searchPlaceholder}
              type="text"
              {...(onSearchChange
                ? {
                    value: searchValue,
                    onChange: (event) => onSearchChange(event.target.value),
                  }
                : {})}
            />
          </div>
        ) : (
          <div />
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        <div className="relative">
          <button
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setMenuOpen((prev) => !prev)}
            type="button"
          >
            <div className="text-right">
              <p className="text-sm font-bold text-on-background leading-tight">{displayName}</p>
            </div>
            <img
              alt="User profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-primary/10 group-hover:border-primary/30 transition-all"
              data-alt="Professional portrait of a man with short dark hair and a neutral expression in natural soft studio lighting"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPuXrnue5eO5YUVie2_XsXgG0K2agVNnZViJ5747-AO0nuuMllS01BtqOYFqDRQqGNbaijnnNbFFebUDSXGZoizNst1kzd2cvM9T693mLv5ej4unxbfYj_tolWeicgPbo5bzE6edv9y59FDilZcjYS0lWVPn6RFx4gvQ7BncxWG18oyOMy_0JyglG6gEFzX8rIJ33rin0GZTPFuhmZPsFkWoghiiEw_DuMkFpt3-pWT7Y2I-qdf1PqRO334upwQFe2RelRizns2gY"
            />
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
