import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import NavBar from './NavBar';
import Home from './Home';
import RestStopList from './RestStopList';
import RestStopDetails from './RestStopDetails';
import CommentSection from './CommentSection';
import Account from './Account';
import ReviewForm from './ReviewForm';
import AuthForm from './AuthForm';
import ProtectedRoute from './ProtectedRoute';
import ReviewDetails from './ReviewDetails';

function App() {

  return (
    <AuthProvider>

    <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rest-stops" element={<RestStopList />} />
          <Route path="/rest-stops/:id" element={<RestStopDetails />} />
          <Route path="/reviews/:reviewId" element={<ReviewDetails />} />
          <Route path="/comment-section" element={<CommentSection />} />
          <Route path="/account" element={<ProtectedRoute element={<Account />} />} />
          <Route path="/add-review" element={<ProtectedRoute element={<ReviewForm />} />} />
          <Route path="/sign-up" element={<AuthForm type="register"/>} />
          <Route path="/login" element={<AuthForm type="login" />} />
        </Routes>
      </div>

    </AuthProvider>
  );
}

export default App;
