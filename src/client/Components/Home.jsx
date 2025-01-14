import React from 'react';
import { useNavigate } from 'react-router-dom';


const Home = ()=> {
  const navigate = useNavigate();

  const goToRestStops = () => {
    navigate('/rest-stops');
  };


  return (
    <div className='home-container'>
      <h1>Welcome to Utah Rest Stop Reviews</h1>
      <p>Planning a roadtrip? Visiting family? Whatever takes you on the open road, find and review rest stops along the way.</p>
      <button onClick={goToRestStops}>Check Out Available Rest Stops</button>
    </div>
  );
};

export default Home;
