import React from 'react';
import './obituary.css';

function Obituary(props) {
  const { name, birthDate, deathDate, image, isNew } = props;

  const message = isNew ? `${name}, born on ${birthDate} and dying on ${deathDate}` : null;

  // format the birth and death dates

  const birthDateFormatted = new Date(birthDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const deathDateFormatted = new Date(deathDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`obituary ${isNew ? 'new-obituary' : ''}`}>
      <img className="obituary-image" src={image} alt={`${name}'s profile`} />
      <div className="obituary-details">
        <h3 className="obituary-name">{name}</h3>
        <p className="obituary-dates">
          {birthDateFormatted} - {deathDateFormatted}
        </p>
        {message && <p className="obituary-message">{message}</p>}
      </div>
    </div>
  );
}

export default Obituary;
