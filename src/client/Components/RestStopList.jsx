import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RestStopList = () => {
  const [restStops, setRestStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestStops = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/rest-stops');
        const data = await response.json();
        console.log(data); 
        setRestStops(data); 
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rest stops:', err);
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