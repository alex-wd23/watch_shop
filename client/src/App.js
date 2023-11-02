import {React, useState} from 'react';
import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout.js';
import Home from "./pages/Home/Home.js"
import Contact from './pages/Contact/Contact.js';
import About from './pages/About/About.js';
import Account from './pages/Account/Account';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  console.log(token)

  return (
    <div>
      <HashRouter basename="/">
        <Routes>
          <Route path='/' element={<Layout setToken={setToken} token={token}/>}>  
            <Route index element={<Home />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/contact" element={<Contact />}/> 
            <Route path="/account" element={
              <PrivateRoute token={token}>
                <Account setToken={setToken}/>
              </PrivateRoute> 
            } />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;


