import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/authApi';
import { useAuth } from '../context/AuthContext.jsx';

const AuthPage = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const isSignup = pathname === '/signup';

  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState({ loading: false, error: '' });
  const DEBUG_AUTH = import.meta.env.DEV || import.meta.env.VITE_DEBUG_API === 'true';

  const submitLabel = useMemo(() => (isSignup ? 'Create Account' : 'Sign In'), [isSignup]);

  const handleChange = (field) => (event) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status.loading) return;

    if (isSignup && formState.password !== formState.confirmPassword) {
      setStatus({ loading: false, error: 'Passwords do not match.' });
      return;
    }

    setStatus({ loading: true, error: '' });
    if (DEBUG_AUTH) {
      console.info('[AUTH][SUBMIT]', {
        mode: isSignup ? 'signup' : 'login',
        email: formState.email,
        apiBaseUrl: import.meta.env.VITE_API_URL || '(missing)',
      });
    }

    try {
      const payload = isSignup
        ? {
            firstName: formState.firstName,
            lastName: formState.lastName,
            email: formState.email,
            password: formState.password,
            currency: 'GHS',
          }
        : {
            email: formState.email,
            password: formState.password,
          };

      const response = isSignup ? await registerUser(payload) : await loginUser(payload);
      if (DEBUG_AUTH) {
        console.info('[AUTH][SUCCESS]', {
          mode: isSignup ? 'signup' : 'login',
          hasToken: Boolean(response?.token),
          hasUser: Boolean(response?.user),
        });
      }
      login({ token: response.token, user: response.user });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      if (DEBUG_AUTH) {
        console.error('[AUTH][FAILURE]', {
          mode: isSignup ? 'signup' : 'login',
          message: error?.message || 'Unknown auth error',
        });
      }
      setFormState((prev) => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));
      setStatus({
        loading: false,
        error: error.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <>
      <main className="relative min-h-screen flex items-center justify-center p-6 lg:p-12 bg-surface font-body text-on-surface antialiased overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-container/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary-container/10 rounded-full blur-[120px]"></div>
        </div>
        <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 bg-surface-container-lowest rounded-[2rem] shadow-2xl overflow-hidden border border-outline-variant/10">
          <div className="hidden lg:flex flex-col gap-20 p-12 bg-surface-container-low relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl shadow-lg">
                <span
                  className="material-symbols-outlined text-on-primary text-2xl"
                  data-icon="account_balance_wallet"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  account_balance_wallet
                </span>
              </div>
              <span className="font-headline font-extrabold text-2xl text-on-primary-container tracking-tight">
                SpendWise
              </span>
            </div>
            <div className="space-y-8">
              <h1 className="font-headline text-5xl font-extrabold text-on-surface editorial-spacing leading-tight">
                Architecture of <br />
                <span className="text-primary">Financial Freedom.</span>
              </h1>
              <p className="text-on-surface-variant text-lg max-w-sm leading-relaxed">
                Experience the sanctuary of calm data. Professional tools designed for the serene architect of their own
                future.
              </p>
            </div>
            {/* Social proof removed for now */}
          </div>
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <div className="mb-6 text-center lg:text-left">
              <div className="lg:hidden flex justify-center mb-8">
                <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-xl shadow-lg">
                  <span
                    className="material-symbols-outlined text-on-primary text-2xl"
                    data-icon="account_balance_wallet"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    account_balance_wallet
                  </span>
                </div>
              </div>
              <h2 className="font-headline text-3xl font-bold text-on-surface -mt-1 mb-2">
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-on-surface-variant font-medium">
                {isSignup
                  ? 'Create your account to begin your financial sanctuary.'
                  : 'Please enter your credentials to access your sanctuary.'}
              </p>
            </div>
            {status.error && (
              <p className="mb-4 text-sm font-semibold text-error" role="alert">
                {status.error}
              </p>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {isSignup && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant ml-1">First Name</label>
                    <div className="relative">
                      <input
                        className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="First name"
                        type="text"
                        value={formState.firstName}
                        onChange={handleChange('firstName')}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant ml-1">Last Name</label>
                    <div className="relative">
                      <input
                        className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="Last name"
                        type="text"
                        value={formState.lastName}
                        onChange={handleChange('lastName')}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant ml-1">Email Address</label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="name@company.com"
                    type="email"
                    value={formState.email}
                    onChange={handleChange('email')}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-bold text-on-surface-variant">Password</label>
                  {!isSignup && (
                    <a className="text-xs font-bold text-primary hover:text-primary-dim transition-colors" href="#">
                      Forgot Password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="••••••••"
                    type="password"
                    value={formState.password}
                    onChange={handleChange('password')}
                  />
                </div>
              </div>
              {isSignup && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface-variant ml-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="••••••••"
                      type="password"
                      value={formState.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                    />
                  </div>
                </div>
              )}
              <button
                className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dim active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={status.loading}
              >
                {status.loading ? 'Please wait...' : submitLabel}
              </button>
            </form>
            {/* Social auth buttons removed for now */}
            <div className="mt-8 text-center">
              <p className="text-on-surface-variant font-medium">
                {isSignup ? 'Already have an account?' : "Don&apos;t have an account?"}
                <Link
                  className="text-primary font-bold ml-1 hover:underline underline-offset-4 decoration-primary/30"
                  to={isSignup ? '/login' : '/signup'}
                >
                  {isSignup ? 'Back to Login' : 'Create Account'}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <div className="fixed top-0 right-0 p-12 pointer-events-none opacity-20 lg:opacity-100">
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl"></div>
          <svg className="w-24 h-24 text-primary/10" viewBox="0 0 100 100">
            <circle cx="50" cy="50" fill="none" r="40" stroke="currentColor" strokeWidth="0.5"></circle>
            <circle cx="50" cy="50" fill="none" r="30" stroke="currentColor" strokeWidth="0.5"></circle>
            <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="0.5"></path>
          </svg>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
