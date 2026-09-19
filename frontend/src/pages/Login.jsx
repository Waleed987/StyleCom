import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';

const inputClass = 'h-12 w-full border border-[#c9c4b9] bg-transparent px-4 text-sm outline-none transition focus:border-black';

function errorMessage(error) {
  return error.response?.data?.message || 'We could not sign you in. Please try again.';
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const googleEnabled = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const finishSignIn = (user) => {
    const requestedPage = location.state?.from;
    navigate(user.isAdmin ? '/admin' : requestedPage || '/', { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      finishSignIn(await signIn(form));
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async ({ credential }) => {
    setError('');
    setLoading(true);
    try {
      finishSignIn(await signInWithGoogle(credential));
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="WELCOME BACK"
      title="Sign in to your account"
      description="Access your saved details, checkout faster, and keep track of every order."
      footer={<>New to Rastah? <Link to="/signup" className="ml-1 font-medium text-black underline underline-offset-4">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="login-email" className="mb-2 block text-xs font-medium tracking-[0.12em]">EMAIL ADDRESS</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="mb-2 block text-xs font-medium tracking-[0.12em]">PASSWORD</label>
          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className={`${inputClass} pr-12`}
              placeholder="Your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-[#6d685f]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && <p role="alert" className="border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full bg-black text-xs font-semibold tracking-[0.2em] text-white transition hover:bg-[#2d2d28] disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? 'SIGNING IN…' : 'SIGN IN'}
        </button>
      </form>

      {googleEnabled && (
        <>
          <div className="my-6 flex items-center gap-4 text-[11px] tracking-[0.15em] text-[#8c877d]">
            <span className="h-px flex-1 bg-[#d2cdc2]" /> OR CONTINUE WITH <span className="h-px flex-1 bg-[#d2cdc2]" />
          </div>
          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google sign-in was cancelled or failed.')} width="400" />
          </div>
        </>
      )}
    </AuthShell>
  );
}

export default Login;
