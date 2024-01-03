import {React} from 'react';
import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout.js';
import Home from "./pages/Home/Home.js"
import Contact from './pages/Contact/Contact.js';
import About from './pages/About/About.js';
import Account from './pages/Account/UserAccount.js';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import LoginModal from './components/LoginModal/LoginModal';
import Shop from './components/Shop/Shop.js';
import { CartProvider } from './contexts/CartContext/CartContext.js';
import { Checkout } from './pages/Order/Checkout.js';
import { UserProvider } from './contexts/UserContext/UserContext.js';


function App() {

  return (
    <div>
      <UserProvider>
        <CartProvider>
          <HashRouter basename="/">
            <Routes>
              <Route path='/' element={<Layout  />}>  
                <Route index element={<Home />}/>
                <Route path="/about" element={<About />}/>
                <Route path="/contact" element={<Contact />}/> 
                <Route path="/shop" element={<Shop />}/> 
                <Route path="/reset/:resetToken" element={ 
                <>
                <Home />
                <LoginModal  />
                </>
                }/>
                <Route path="/account" element={
                  <PrivateRoute >
                    <Account />
                  </PrivateRoute> 
                } />
              </Route>
              <Route path='/checkout' element={<Checkout />} /> 
            </Routes>
          </HashRouter>
        </CartProvider>
      </UserProvider>
    </div>
  );
}

export default App;


