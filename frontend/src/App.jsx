
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

function App() { 
  
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <CartProvider>
          <BrowserRouter>
            {demoMode && <div className="bg-black px-4 py-2 text-center text-sm text-white">Demo store — sample products for browsing and cart testing.</div>}
            <Routes>
              <Route path='/admin' element={<Admin/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/signup' element={<Signup/>}/>
              <Route path='/' element={<Home/>}/>
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
      </GoogleOAuthProvider>
    </>
  )
}

export default App
