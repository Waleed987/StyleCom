import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';

const inputClass = 'h-12 w-full border border-[#c9c4b9] bg-transparent px-4 text-sm outline-none transition focus:border-black';

function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Use at least 8 characters for your password.');
      return;
    }

    setLoading(true);
    try {
      const user = await signUp(form);
      navigate(user.isAdmin ? '/admin' : '/', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="JOIN THE COMMUNITY"
      title="Create your account"
      description="Save your details and keep your orders together in one place. It only takes a moment."
      footer={<>Already have an account? <Link to="/login" className="ml-1 font-medium text-black underline underline-offset-4">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="signup-name" className="mb-2 block text-xs font-medium tracking-[0.12em]">FULL NAME</label>
          <input id="signup-name" name="username" type="text" autoComplete="name" required value={form.username} onChange={updateField} className={inputClass} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="signup-email" className="mb-2 block text-xs font-medium tracking-[0.12em]">EMAIL ADDRESS</label>
          <input id="signup-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={updateField} className={inputClass} placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="signup-password" className="mb-2 block text-xs font-medium tracking-[0.12em]">PASSWORD</label>
          <div className="relative">
            <input id="signup-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} required value={form.password} onChange={updateField} className={`${inputClass} pr-12`} placeholder="At least 8 characters" />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-[#6d685f]" aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="mt-2 text-xs text-[#827d73]">Use 8 or more characters.</p>
        </div>

        {error && <p role="alert" className="border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

        <button type="submit" disabled={loading} className="h-12 w-full bg-black text-xs font-semibold tracking-[0.2em] text-white transition hover:bg-[#2d2d28] disabled:cursor-wait disabled:opacity-60">
          {loading ? 'CREATING ACCOUNT…' : 'CREATE ACCOUNT'}
        </button>
      </form>
      <p className="mt-4 text-xs leading-5 text-[#827d73]">By creating an account, you agree to use StyleCom responsibly and keep your sign-in details secure.</p>
    </AuthShell>
  );
}

export default Signup;
