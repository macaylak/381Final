import React, { useState, useEffect } from "react";
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

  // once the component is rendered
  useEffect(()=> {
    // this will run once the component is rendered and not anymore
    const asyncEffect = async () => {
      const promise = await fetch("https://3vfkgsmxhfok7zo7gjloi5egsa0orfkv.lambda-url.ca-central-1.on.aws/");

      // turn the result into json
      const res = await promise.json();
      setObituaries(res)
    }
    asyncEffect();
  }, [])





 
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
                <img src={obituary["img_resp"]} alt="profile" style={{ maxWidth: "100%" }} /> <br/>
                <p><b>{obituary.name}</b></p>
                <small><FormattedDate label="Born" date={obituary["born_year"]} /> - <FormattedDate label="Died" date={obituary["died_year"]} /></small>
                <br/><p>{obituary["chatgpt"]}</p><br/>
                <audio controls >
                  <source src={obituary["polly_resp"]} type="audio/mp3" />
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



















