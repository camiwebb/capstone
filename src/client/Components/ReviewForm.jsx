import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const ReviewForm = ({ restStopId, onSubmit }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [review, setReview] = useState({
    content: "",
    rating: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview({ ...review, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!review.content || !review.rating) {
      alert("Please fill in all fields before submitting the review.");
      return; 
    }

    if (!user) {
      alert("You must be logged in to submit a review.");
      return;
    }

    const reviewData = {
      ...review,
      userId: user.id,
      restStopId: restStopId,
    };
    
    fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit the review.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Review successfully submitted:", data);
        setReview({
          content: "",
          rating: "",
        });
        setSuccess("Your review has been submitted!");
        setError("");
  
        if (onSubmit) onSubmit(data);
        navigate(`/rest-stops/${restStopId}`);
    })
    .catch((error) => {
      console.error("Error submitting review:", error);
      setError("There was an error submitting your review. Please try again later.");
      setSuccess("");
    });
};

return (
  <div className="add-review-form">
    <h2>Add a Review</h2>
    {user ? (
      <form onSubmit={handleSubmit}>
        <label htmlFor="content">Your Review</label>
        <textarea
          id="content"
          name="content"
          placeholder="Write your review here..."
          value={review.content}
          onChange={handleChange}
        ></textarea>

        <label htmlFor="rating">Rating</label>
        <select
          id="rating"
          name="rating"
          value={review.rating}
          onChange={handleChange}
        >
          <option value="">Select a rating</option>
          <option value="1">1 - Poor</option>
          <option value="2">2 - Fair</option>
          <option value="3">3 - Good</option>
          <option value="4">4 - Very Good</option>
          <option value="5">5 - Excellent</option>
        </select>

        <button type="submit">Submit Review</button>
      </form>
    ) : (
      <p>Please log in to submit a review.</p>
    )}
  </div>
);
};

export default ReviewForm;