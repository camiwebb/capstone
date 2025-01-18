import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Account = () => {
  const { authData } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = authData.token;
  const loggedIn = Boolean(token);

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    } else {
      fetchUserDetails();
      if (userDetails) fetchUserDetails();
    }
  }, [loggedIn, navigate, userDetails]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch('/api/account', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch user details');

      const data = await response.json();
      setUserDetails(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please log in again.');
          navigate('/login');
        } else {
          throw new Error('Failed to fetch user reviews');
        }
      }
      const data = await response.json();
      setUserReviews(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {loggedIn ? (
        <div>
          <h2>Your Account</h2>
          {userDetails ? (
            <div>
              <p><strong>Name:</strong> {userDetails.name}</p>
              <p><strong>Email:</strong> {userDetails.email}</p>
              <h3>Your Reviews</h3>
              {userReviews.length > 0 ? (
                <ul>
                  {userReviews.map((review) => (
                    <li key={review.id}>
                      <p>{review.review_text}</p>
                      <p><strong>Rating:</strong> {review.rating}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>You haven't reviewed any rest stops yet.</p>
              )}
            </div>
          ) : (
            <p>Loading user details...</p>
          )}
        </div>
      ) : (
        <div>
          <h2>Login to view your account</h2>
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Account;