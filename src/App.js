import React, { useState, useEffect } from "react";
import Overlay from "./Overlay";
import FormattedDate from "./FormattedDate.js";

function App() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [obituaries, setObituaries] = useState([]);
  const [selectedObituary, setSelectedObituary] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [selectedObituaries, setSelectedObituaries] = useState([]);

  const handleClick = () => {
    setShowOverlay(true);
  };

  const handleObituarySubmit = (obituary) => {
    setObituaries([...obituaries, obituary]);
  };

  const handleClose = () => {
    setShowOverlay(false);
  };

  useEffect(() => {
    const asyncEffect = async () => {
      const promise = await fetch("https://z5ogfwmsriman66d7ioucpguh40kpbod.lambda-url.ca-central-1.on.aws/");
      const res = await promise.json();
      setObituaries(res);
    };
    asyncEffect();
  }, []);

  const handleObituaryClick = (id) => {
    setSelectedObituary(id);
    setSelectedObituaries([id]);
    setShowMessage(true);
    // close on second click
    if (selectedObituary === id) {
      setSelectedObituary(null);
      setShowMessage(false);
    }
  };

  // show newest obituary message when it is created
  useEffect(() => {
    if (obituaries.length > 0) {
      setSelectedObituary(obituaries[obituaries.length - 1].id);
      setSelectedObituaries([obituaries[obituaries.length - 1].id]);
      setShowMessage(true);
    }
  }, [obituaries]);


  return (
    <div id="container">
      <header>
        <aside>&nbsp;</aside>
        <div id="app-header">
          <h1>The Last Show</h1>
        </div>
        <aside>
          <button id="new-obituary-button" onClick={handleClick}>
            <h4>+ New Obituary</h4>
          </button>
        </aside>
      </header>
      {showOverlay && <Overlay onClose={handleClose} onObituarySubmit={handleObituarySubmit} />}
      <div id="body">
        {obituaries.length > 0 ? (
          <div className="obituary-grid">
            {obituaries.map((obituary) => (
              <div
                id="obituary-container"
                key={obituary.id}
                onClick={() => handleObituaryClick(obituary.id)}
                className={selectedObituary === obituary.id ? "selected" : ""}
              >
                <img src={obituary["img_resp"]} alt="profile" style={{ maxWidth: "100%" }} /> <br />
                <p class="obituary-name">
                  <b>{obituary.name}</b>
                </p>
                <p className="dates">
                  <span>
                    <FormattedDate date={obituary["born_year"]} /> - <FormattedDate date={obituary["died_year"]} />
                  </span>
                </p>

                <br />
                {selectedObituary === obituary.id && (
                  <div id="message">
                    <p>{obituary["chatgpt"]}</p>
                    <br />
                    <div className="audio-player">
                      <audio controls className="audio-element">
                        <source src={obituary["polly_resp"]} type="audio/mp3" />
                      </audio>
                      <div className="play-pause-button"></div>
                    </div>

                  </div>
                )}
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
