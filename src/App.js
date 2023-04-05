import React, { useState } from 'react';
import './index.css';
import Obituary from './Obituary';


function App() {
  const [showBlueRectangle, setShowBlueRectangle] = useState(false);
  const [obituaries, setObituaries] = useState([]);
  const [newObituary, setNewObituary] = useState(null);

  const handleNewObituaryClick = () => {
    setShowBlueRectangle(true);
  };

  const handleClose = () => {
    setShowBlueRectangle(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    const nameInput = event.target.elements['name-input'];
    const birthDateInput = event.target.elements['birth-date-input'];
    const deathDateInput = event.target.elements['death-date-input'];
    const imageInput = event.target.elements['image-selector'];
  
    if (!nameInput.value && !birthDateInput.value && !deathDateInput.value && !imageInput.files[0]) {
      alert('All fields are required');
      return;
    }

    if (!nameInput.value){
      alert('Please provide the name of the deceased');
      return;
    }

    if (!birthDateInput.value){
      alert('Please provide the birth date of the deceased');
      return;
    }

    if (!deathDateInput.value){
      alert('Please provide the death date of the deceased');
      return;
    }

    if (!imageInput.files[0]){
      alert('Please provide an image of the deceased');
      return;
    }
  
    const name = nameInput.value;
    const birthDate = birthDateInput.value;
    const deathDate = deathDateInput.value;
    const image = URL.createObjectURL(imageInput.files[0]);
    const newObituary = { name, birthDate, deathDate, image };
  
    setObituaries([...obituaries, { ...newObituary, isNew: true }]);
    console.log('New obituary added:', newObituary);
  
    handleClose();
  };
  

  return (
    <div id="wrapper">
      <div id="header-wrapper">
        <header>
          <div id="app-header">
            <h1>The Last Show</h1>
          </div>
          <div id="header-button">
            <aside>
              <button id="new-obituary-button" onClick={handleNewObituaryClick}>
                + New Obituary
              </button>
            </aside>
          </div>
        </header>
      </div>
      <div id="body">
        {obituaries.length === 0 && !newObituary ? (
          <h1>No Obituary Yet.</h1>
        ) : (
          <>
            {newObituary && (
              <Obituary
                key={obituaries.length}
                name={newObituary.name}
                birthDate={newObituary.birthDate}
                deathDate={newObituary.deathDate}
                image={newObituary.image}
                isNew
              />
            )}
            {obituaries.map((obituary, index) => (
              <Obituary
                key={index}
                name={obituary.name}
                birthDate={obituary.birthDate}
                deathDate={obituary.deathDate}
                image={obituary.image}
                isNew={false}
              />
            ))}
          </>
        )}
      </div>


      {showBlueRectangle && (
        <div id="center-box-wrapper">
          <div id="blue-rectangle">
            <div id="center-box-header">
              <button id="close-blue-rectangle-button" onClick={handleClose}>X</button>
            <div id="center-box">
            <form onSubmit={handleSubmit}>
              <h2>Create a New Obituary</h2>
              <img id="obituary-image" src="line.png" alt="obituary" />
              <div id="image-wrapper">
                <label id="image-selector-label" htmlFor="image-selector">Select an image for the deceased</label>
                <input type="file" id="image-selector" name="image-selector" accept="image/*" />
              </div>
              <input type="text" id="name-input" name="name-input" placeholder="Name of the deceased" />
              <div id="dates-wrapper">
                <label htmlFor="birth-date-input"><i>Birth:</i></label>
                <input type="datetime-local" id="birth-date-input" name="birth-date-input"/>
                <label htmlFor="death-date-input"><i>Died: </i></label>
                <input type="datetime-local" id="death-date-input" name="death-date-input"/>
              </div>
              <div id="submit-button">
                <button type="submit">Write Obituary</button>
                <span id="error-message" style={{ color: 'red' }}></span>
              </div>
            </form>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
  
}

export default App;
