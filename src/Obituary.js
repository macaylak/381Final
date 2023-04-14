import React from 'react';
import './obituary.css';

function Obituary(props) {
  const { name, birthDate, deathDate, image, isNew } = props;

  // const message = isNew ? `${name}, born on ${birthDate} and dying on ${deathDate}` : null;

  // format the birth and death dates

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

  return (
    <div className={`obituary${isNew ? ' new' : ''}`}>
      <img src={image} alt={`${name}'s photo`} />
      <div className="details">
        <h2>{name}</h2>
        <p>{birthDateFormatted} - {deathDateFormatted}</p>
      </div>
    </div>
  );
}

export default Obituary;
