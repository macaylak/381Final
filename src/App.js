import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from "react-router-dom";
import './index.css';
import Obituary from './Obituary';
import { v4 as uuidv4 } from "uuid";
import DateTime from "react-datetime";


function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBlueRectangle, setShowBlueRectangle] = useState(false);
  const [obituaries, setObituaries] = useState([]);
  const [newObituary, setNewObituary] = useState(null);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [deathDate, setDeathDate] = useState('');
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    localStorage.setItem('obituaries', JSON.stringify(obituaries));
  }, [obituaries, isSubmitting]);
  
  const handleNewObituaryClick = () => {
    setShowBlueRectangle(true);
    resetFormFields();
  };

  const handleClose = () => {
    setShowBlueRectangle(false);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formData = new FormData();
    formData.append('file', file);
  
    const id = uuidv4();
    const newObituaryData = { id, name, birthDate, deathDate, image: imageUrl };
    const data = { ...newObituaryData, ...Object.fromEntries(formData.entries()) };
  
    const res = await fetch("https://hhw3gmy5a7gdj2xqjlsaxaefh40qioms.lambda-url.ca-central-1.on.aws/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    setIsSubmitting(false);
  

  // // call store_files lambda function
  // const cloud = await fetch("https://eqq5a2s4mu2muc52zrqp6ht4iy0pcuyj.lambda-url.ca-central-1.on.aws/",
  // {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({image, file})
  // });

    setNewObituary(newObituaryData);
    setObituaries([...obituaries, { ...newObituaryData, isNew: true }]);
    console.log('New obituary added:', newObituaryData);
    handleClose();
  };
  

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const resetFormFields = () => {
    setName('');
    setBirthDate('');
    setDeathDate('');
    setFile(null);
    setImage(null);
    setImageUrl(null);
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
            {newObituary && !obituaries.find(obituary => obituary.name === newObituary.name) && (
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
                    type="datetime-local"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                  <label htmlFor="deathDate"><i>Died:</i></label>
                  <input
                    type="datetime-local"
                    required
                    inputProps={{ placeholder: "yyyy-mm-dd, --:-- --" }}
                    value={deathDate}
                    onChange={(e) => setDeathDate(e.target.value)}
                  />
                </div>
                <button
                  id="submit-button"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Loading..." : "Write Obituary"}
                </button>
            </form>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
                
export default App;
