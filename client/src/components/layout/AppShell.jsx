import { createContext, useMemo, useState } from 'react';
import SideNav from './SideNav';

export const AppShellContext = createContext(null);

const AppShell = ({ sideNavVariant, className, children }) => {
  const wrapperClassName = ['min-h-screen', className].filter(Boolean).join(' ');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const contextValue = useMemo(
    () => ({
      mobileNavOpen,
      openMobileNav: () => setMobileNavOpen(true),
      closeMobileNav: () => setMobileNavOpen(false),
      toggleMobileNav: () => setMobileNavOpen((prev) => !prev),
    }),
    [mobileNavOpen]
  );

  return (
    <AppShellContext.Provider value={contextValue}>
      <div className={wrapperClassName}>
        <SideNav variant={sideNavVariant} isMobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        {children}
      </div>
    </AppShellContext.Provider>
  );
};

export default AppShell;
