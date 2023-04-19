import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from "react-router-dom";
import './index.css';
import Obituary from './Obituary';
import { v4 as uuidv4 } from "uuid";

function App() {
  const [showBlueRectangle, setShowBlueRectangle] = useState(false);
  const [obituaries, setObituaries] = useState([]);
  const [newObituary, setNewObituary] = useState(null);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [deathDate, setDeathDate] = useState('');
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  // useEffect(() => {
  //   localStorage.setItem('obituaries', JSON.stringify(obituaries));
  // }, [obituaries]);


  const handleNewObituaryClick = () => {
    setShowBlueRectangle(true);
    resetFormFields();
  };


  const handleClose = () => {
    setShowBlueRectangle(false);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append('file', file);
  
    const id = uuidv4();
    const newObituaryData = { id, name, birthDate, deathDate, image: imageUrl };

    const res = await fetch("https://hhw3gmy5a7gdj2xqjlsaxaefh40qioms.lambda-url.ca-central-1.on.aws/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newObituaryData)
    }
  );

    setNewObituary(newObituaryData);
    setObituaries([...obituaries, { ...newObituaryData, isNew: true }]);
    console.log('New obituary added:', newObituaryData);
    handleClose();
  };


  const handleObituarySubmit = (obituary) => {
    setObituaries([...obituaries, obituary]);
  };
 
  return (
    <div id="container">
      <header>
        <aside>&nbsp;</aside>
        <div id="app-header">
          <h1>The Last Show</h1>
        </div>
        <aside>
          <button id="header-button" onClick={handleClick}>
            <h4>+ New Obituary</h4>
          </button>
        </aside>
      </header>
      {showOverlay && (
        <Overlay
        onClose={handleClose}
        onObituarySubmit={handleObituarySubmit}
        />
      )}
      <div id="main-container">
        {obituaries.length > 0 ? (
          <div className="obituary-grid">
            {obituaries.map((obituary) => (
              <div id="obituary-container" key={obituary.id}>
                <img src={obituary.image} alt="profile" style={{ maxWidth: "100%" }} /> <br/>
                <p><b>{obituary.name}</b></p>
                <small><FormattedDate label="Born" date={obituary.birthDate} /> - <FormattedDate label="Died" date={obituary.deathDate} /></small>
                <br/><p>{obituary.description}</p><br/>
                <audio controls >
                  <source src={obituary.mp3} type="audio/mp3" />
                </audio>
              </div>
            ))}
          </>
        )}
      </div>

      {showBlueRectangle && (
        <div id="center-box-wrapper">
          <div id="blue-rectangle">
            <div id="center-box-header">
              <button id="close-blue-rectangle-button" onClick={handleClose}>X</button>
            </div>
            <div id="center-box">
              <form onSubmit={onSubmitForm} id="new-obituary-form">
                <h2>Create a New Obituary</h2>
                <img id="obituary-image" src="line.png" alt="obituary" />
                <input
                  type="file"
                  required
                  accept="image/*"
                  placeholder="Upload an image"
                  onChange={onFileChange}
                />
                <input
                  type="text"
                  required
                  placeholder="Name of the deceased"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div id="dates-wrapper">
                  <label htmlFor="birthDate"><i>Born:</i></label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                  <label htmlFor="deathDate"><i>Died:</i></label>
                  <input
                    type="date"
                    required
                    value={deathDate}
                    onChange={(e) => setDeathDate(e.target.value)}
                  />
                </div>
                <button type="submit" id="submit-button">Write Obituary
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}


export default App;








