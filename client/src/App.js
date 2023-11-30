import {React, useState} from 'react';
import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout.js';
import Home from "./pages/Home/Home.js"
import Contact from './pages/Contact/Contact.js';
import About from './pages/About/About.js';
import Account from './pages/Account/Account';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import LoginModal from './components/LoginModal/LoginModal';
import Shop from './components/Shop/Shop.js';
import { CartProvider } from './contexts/CartContext/CartContext.js';


function App() {
 
  const [showModal, setShowModal] = useState(false);  


  return (
    <div>
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
            <LoginModal setShowModal={setShowModal} />
            </>
            }/>
            <Route path="/account" element={
              <PrivateRoute >
                <Account />
              </PrivateRoute> 
            } />
          </Route>
        </Routes>
      </HashRouter>
      </CartProvider>
    </div>
  );
}

export default App;


