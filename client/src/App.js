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

// Reset link for testing
// http://localhost:3000/watch_shop/#reset/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTY5OTIxNzA3NCwiZXhwIjoxNjk5MjIwNjc0fQ.gCBkvGppTkljaGq_9KaNAwTT_8lzNiVj4RtKV2YSYNg

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [showModal, setShowModal] = useState(false);
  

  return (
    <div>
      <HashRouter basename="/">
        <Routes>
          <Route path='/' element={<Layout setToken={setToken} token={token}/>}>  
            <Route index element={<Home />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/contact" element={<Contact />}/> 
            <Route path="/reset/:resetToken" element={ 
            <>
            <Home />
            <LoginModal setShowModal={setShowModal} />
            </>
            }/>
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


