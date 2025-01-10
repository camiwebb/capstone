import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import RestStopList from './RestStopList';
import RestStopDetails from './RestStopDetails';
import Account from './Account';
import ReviewForm from './ReviewForm';
import AuthForm from './AuthForm';

const App = ()=> {
  return (
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/rest-stops" element={<RestStopList />}></Route>
          <Route path="/rest-stops/:id" element={<RestStopDetails />}></Route>
          <Route path="/account" element={<Account />}></Route>
          <Route path="/add-review" element={<ReviewForm />}></Route>
          <Route path='/sign-up' element={<AuthForm />}></Route>
        </Routes>
      </div>
  );
};

export default App;
