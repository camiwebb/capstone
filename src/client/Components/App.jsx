import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './Home';
import RestStopList from './RestStopList';
import RestStopDetails from './RestStopDetails';
import Account from './Account';
import ReviewForm from './ReviewForm';
import AuthForm from './AuthForm';

const App = ()=> {
  return (
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rest-stops" element={<RestStopList />} />
          <Route path="/rest-stops/:id" element={<RestStopDetails />} />
          <Route path="/account" element={ <Account />} />
          <Route path="/add-review" element={<ReviewForm />} />
          <Route path='/sign-up' element={<AuthForm />} />
        </Routes>
      </div>
  );
};

export default App;
