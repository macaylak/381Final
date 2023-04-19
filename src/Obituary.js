import React, { useState } from 'react';
import './obituary.css';

function Obituary(props) {
  const { name, birthDate, deathDate, image, isNew } = props;

  const [showMessage, setShowMessage] = useState(false);

  const birthDateFormatted = new Date(birthDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const deathDateFormatted = new Date(deathDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleClick = () => {
    setShowMessage(!showMessage);
  };

  const handlePlayClick = (event) => {
    event.stopPropagation();
    // Add play functionality here
  };

  return (
    <div className={`obituary${isNew ? ' new' : ''}`} onClick={handleClick}>
      <img src={image} alt={`${name}'s photo`} />
      <div className="details">
        <h2>{name}</h2>
        <p>{birthDateFormatted} - {deathDateFormatted}</p>
        {showMessage && (
          <div>
            <p id="message">{name}, born on {birthDateFormatted} and dying on {deathDateFormatted}</p>
            <button className="play-button" onClick={handlePlayClick}>Play</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Obituary;
