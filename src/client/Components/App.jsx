import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import RestStopList from './RestStopList';
import RestStopDetails from './RestStopDetails';
import MyReviews from './MyReviews';
import ReviewForm from './ReviewForm';

const App = ()=> {
  return (
    <Router>
      <div>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/rest-stops" element={<RestStopList />}></Route>
          <Route path="/rest-stops/:id" element={<RestStopDetails />}></Route>
          <Route path="/my-reviews" element={<MyReviews />}></Route>
          <Route path="/add-review" element={<ReviewForm />}></Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
