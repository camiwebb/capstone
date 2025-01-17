import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const loggedIn = Boolean(token);

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    } else {
      fetchUserDetails();
      fetchUserReviews();
    }
  }, [loggedIn, navigate]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch('/api/me', {
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
      if (!userDetails) return;
      
      const response = await fetch(`http://localhost:3000/api/users/${userDetails.id}/reviews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user reviews');
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