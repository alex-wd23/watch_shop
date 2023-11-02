import React from 'react';
import { Outlet } from "react-router-dom";
import Header from '../Header/Header.js';
import Footer from '../Footer/Footer.js';



// Here all the pages are displayed
const Layout = ({ setToken, token }) => {
  return (
    <div>
        <Header setToken={setToken} token={token} />
        <Outlet />  
        <Footer />
    </div>
  );
}

export default Layout