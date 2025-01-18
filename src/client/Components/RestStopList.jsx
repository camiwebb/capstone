import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RestStopList = () => {
  const [restStops, setRestStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestStops = async () => {
      try {
        const response = await fetch('/api/rest-stops');

        if (!response.ok) {
          throw new Error('Failed to fetch rest stops.');
        }

        const data = await response.json();

        setRestStops(data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestStops();
  }, []);

  const handleViewDetails = (itemId) => {
    navigate(`/rest-stops/${itemId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>; 
  }

  return (
    <div className="rest-stop-list">
      <h1>Rest Stops</h1>
      <div className="rest-stop-cards">
        {restStops.length > 0 ? (
          restStops.map((stop) => (
            <div key={stop.id} className="rest-stop-card">
              <h3>{stop.name}</h3>
              <p>Rating: {stop.average_rating}</p>
              <button className="view-details-button" onClick={() => handleViewDetails(stop.id)}>View Details</button>
            </div>
          ))
        ) : (
          <div>No rest stops available.</div>
        )}
      </div>
    </div>
  );
};

export default RestStopList;