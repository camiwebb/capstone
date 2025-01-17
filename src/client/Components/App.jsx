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
import LoginForm from './LoginForm';

function App() {

  return (
    <AuthProvider>

    <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rest-stops" element={<RestStopList />} />
          <Route path="/rest-stops/:id" element={<RestStopDetails />} />
          <Route path="/comment-section" element={<CommentSection />} />
          <Route path="/account" element={<Account />} />
          <Route path="/add-review" element={<ReviewForm />} />
          <Route path="/sign-up" element={<AuthForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </div>

    </AuthProvider>
  );
}

export default App;
