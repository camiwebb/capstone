import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 

const RestStopDetails = () => {
  const { id } = useParams(); 
  const [restStop, setRestStop] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  // Fetch the rest stop data
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

    fetchRestStop();
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
    </div>
  );
};

export default RestStopDetails;