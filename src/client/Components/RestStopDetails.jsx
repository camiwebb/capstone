import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 

const RestStopDetails = ( {isLoggedIn} ) => {
  const { id } = useParams(); 
  const [restStop, setRestStop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const handleAddReview = () => {
    navigate('/add-review', { state: { restStopId: id } });
  };

  useEffect(() => {
    const fetchRestStop = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/rest-stops/${id}`);
        if (!response.ok) {
          throw new Error('Rest stop not found');
        }
        const data = await response.json();
        setRestStop(data); 
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchReviews = async () => {
      try {
       const response = await fetch(`http://localhost:3000/api/rest-stops/${id}/reviews`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRestStop();
    fetchReviews();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!restStop) {
    return <div>Loading...</div>;
  }

  return (
    <div className='rest-stop-container'>
      <h1>{restStop.name}</h1>
      <p>{restStop.description}</p>
      <p className='rating'>Rating: {restStop.average_rating}</p>
      <button className="back-button" onClick={goBack}>
        Go Back
      </button>
      
      {isLoggedIn && (
        <button className="add-review-button" onClick={handleAddReview}>
          Add Review
        </button>
      )}

      <h2>Reviews</h2>
    {reviews.length > 0 ? (
      <ul className="reviews-list">
        {reviews.map((review) => (
          <li key={review.id} className="review-item">
            {/* Show review text */}
            <p><strong>Review:</strong> {review.review_text}</p>
            {/* Show rating */}
            <p><strong>Rating:</strong> {review.rating}</p>
            {/* Optionally format `created_at` */}
            <p><strong>Created At:</strong> {new Date(review.created_at).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    ) : (
      <p>No reviews yet. Be the first to add one!</p>
    )}

    </div>
  );
};

export default RestStopDetails;