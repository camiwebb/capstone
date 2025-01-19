import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CommentSection from './CommentSection';

const ReviewDetails = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviewDetails = async () => {
      try {
        const response = await fetch(`/api/reviews/${reviewId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch review details');
        }
        const data = await response.json();
        setReview(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewDetails();
  }, [reviewId]);

  if (loading) return <div>Loading review details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!review) return <div>Review not found</div>;

  return (
    <div className="review-details">
      <button onClick={() => navigate(-1)}>Go Back</button>
      <h1>{review.title}</h1>
      <p><strong>Author:</strong> {review.author}</p>
      <p><strong>Rating:</strong> {review.rating}/5</p>
      <p><strong>Content:</strong> {review.content}</p>
      <p><strong>Created At:</strong> {new Date(review.created_at).toLocaleDateString()}</p>

      <CommentSection reviewId={reviewId} />
    </div>
  );
};

export default ReviewDetails;
