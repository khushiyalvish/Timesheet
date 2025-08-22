import React from 'react';
import Router from './router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <>
    <Router />
    <ToastContainer position="top-center" autoClose={3000} />
  </>
);

export default App;
