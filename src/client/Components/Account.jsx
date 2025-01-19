import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Account = () => {
  const { authData } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const token = authData.token;
  const loggedIn = Boolean(token);

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const userResponse = await fetch('/api/account', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userResponse.ok) throw new Error('Failed to fetch user details');
        const userData = await userResponse.json();
        setUserDetails(userData);

        const reviewsResponse = await fetch(`/api/reviews/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!reviewsResponse.ok) throw new Error('Failed to fetch user reviews');
        const reviewsData = await reviewsResponse.json();
        setUserReviews(reviewsData);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [loggedIn, navigate, token]);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : loggedIn ? (
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