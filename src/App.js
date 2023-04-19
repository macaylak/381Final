import React, { useState } from "react";
import Overlay from "./Overlay";
import FormattedDate from "./FormattedDate.js"




function App() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [obituaries, setObituaries] = useState([]);




  const handleClick = () => {
    setShowOverlay(true);
  };
  const handleObituarySubmit = (obituary) => {
    setObituaries([...obituaries, obituary]);
  };


  const handleClose = () => {
    setShowOverlay(false);
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
          </div>
        ) : (
          <div id="empty-container">
            <h5>No Obituary Yet</h5>
          </div>
        )}
      </div>
    </div>
  );
}




export default App;



















