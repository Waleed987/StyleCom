
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Login from './pages/Login'
import './App.css'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Allcollection from './pages/Allcollection'
import Admin from './pages/Admin'
import Mens from './pages/Mens'
import Women from './pages/Women'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderDetail from './pages/OrderDetail'
import { CartProvider } from './context/CartContext'
import { demoMode } from './catalog'
import { AuthProvider, useAuth } from './context/AuthContext'
import Account from './pages/Account'

function OptionalGoogleProvider({ children }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  return clientId
    ? <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
    : children
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to='/login' state={{ from: '/admin' }} replace />
  if (!user?.isAdmin) return <Navigate to='/' replace />
  return children
}

function App() { 
  
  return (
    <>
      <OptionalGoogleProvider>
        <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            {demoMode && <div className="bg-black px-4 py-2 text-center text-sm text-white">Demo store — sample products for browsing and cart testing.</div>}
            <Routes>
              <Route path='/admin' element={<AdminRoute><Admin/></AdminRoute>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/signup' element={<Signup/>}/>
              <Route path='/account' element={<Account/>}/>
              <Route path='/' element={<Home/>}/>
              <Route path='/home' element={<Navigate to='/' replace />} />
              <Route path='/mens' element={<Mens/>}/>
              <Route path='/womens' element={<Women/>}/>
              <Route path='/all' element={<Allcollection/>} />
              <Route path='/product/:productId' element={<ProductDetail/>} />
              <Route path='/cart' element={<Cart/>} />
              <Route path='/checkout' element={<Checkout/>} />
              <Route path='/order/:orderId' element={<OrderDetail/>} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
        </AuthProvider>
      </OptionalGoogleProvider>
    </>
  )
}

export default App
