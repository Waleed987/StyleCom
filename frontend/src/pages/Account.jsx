import { LogOut, Package, ShoppingBag } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';

function Account() {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const handleSignOut = () => {
    signOut();
    navigate('/', { replace: true });
  };

  return (
    <AuthShell
      eyebrow="YOUR ACCOUNT"
      title={`Welcome${user?.username ? `, ${user.username}` : ''}`}
      description="Your account is ready. Continue shopping or review the details connected to your profile."
      footer={<button onClick={handleSignOut} className="flex items-center gap-2 font-medium text-black underline underline-offset-4"><LogOut size={16} /> Sign out</button>}
    >
      <div className="border-y border-[#c9c4b9] py-6">
        <p className="text-xs tracking-[0.14em] text-[#827d73]">EMAIL</p>
        <p className="mt-2 text-sm">{user?.email}</p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button onClick={() => navigate('/all')} className="flex h-24 flex-col items-center justify-center gap-2 border border-black text-xs tracking-[0.12em] transition hover:bg-black hover:text-white">
          <ShoppingBag size={20} /> SHOP
        </button>
        <button onClick={() => navigate('/cart')} className="flex h-24 flex-col items-center justify-center gap-2 border border-black text-xs tracking-[0.12em] transition hover:bg-black hover:text-white">
          <Package size={20} /> CART
        </button>
      </div>
    </AuthShell>
  );
}

export default Account;
