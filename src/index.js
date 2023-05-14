import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import AppRouter from "./AppRouter.js";
import { Navbar, Button, Link, Text } from "@nextui-org/react";
import Nav from './Nav';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <div className="fApp">
    <Nav/>
    {/* <App /> */}
    <AppRouter />
    </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
