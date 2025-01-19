import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CommentSection = ({ reviewId }) => {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentText: newComment }),
      });
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      const newCommentData = await response.json();
      setComments((prev) => [...prev, newCommentData]);
      setNewComment('');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [reviewId]);

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="comment-section">
      <h2>Comments</h2>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>{comment.comment_text}</p>
            <p><small>By User {comment.user_id}</small></p>
            <p><small>{new Date(comment.created_at).toLocaleString()}</small></p>
          </div>
        ))
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}

      {isAuthenticated ? (
        <div className="add-comment">
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment} disabled={!newComment.trim()}>
            Add Comment
          </button>
        </div>
      ) : (
        <p>Please log in to add a comment.</p>
      )}
    </div>
  );
};

export default CommentSection;