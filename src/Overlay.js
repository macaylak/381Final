import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { currentDate } from "./utils";


const Overlay = ({onClose, onObituarySubmit }) => {
  const [imageName, setImageName] = useState(null);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [deathDate, setDeathDate] = useState("");
  const [loading, setLoading] = useState(false);


  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    setImageName(selectedImage.name);
  };


  const submitForm = async (event) => {
    event.preventDefault();
    setLoading(true);


    const data = new FormData();
    data.append("image", image);
    data.append("name", name);
    data.append("birthDate", birthDate);
    data.append("deathDate", deathDate);
    data.append("id", uuidv4());


    try {
      const promise = await fetch(
        "https://y7hm73yzfnppotowqxjp4yvs540yfeiq.lambda-url.ca-central-1.on.aws/",
        {
          method: "POST",
          body: data,
        }
      );


      const result = await promise.json();
      const obituary = {
        id: result["id"],
        name: result["name"],
        "born_year": result["born_year"],
        "died_year": result["died_year"],
        "img_resp": result["img_resp"],
        "polly_resp": result["polly_resp"],
        "chatgpt": result["chatgpt"],
      };
      onObituarySubmit(obituary);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div id="overlay">
        <div id="overlay-content">
            <button id="close-overlay-content-button" onClick={onClose}>
                <h1>X</h1>
            </button>
            <h1>Create a New Obituary</h1>
            <img id="obituary-image" src="line.png" alt="obituary" />
                     <form onSubmit = {(e) => submitForm(e)}>
                <label htmlFor="image-input" id="select-image-label">
                    Select an image for the deceased <mark style={{backgroundColor:"pink"} }>{imageName && `(${imageName})`}</mark>
                </label>
                <input
                    type="file"
                    id="image-input"
                    accept="image/*"
                    style={{display: "none"}}
                    onChange={handleImageChange}
                    required
                />

                <input
                    type="text"
                    id="input-name"
                    placeholder="Name of the deceased"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <div id="input-dates" style={{margin:"0 0 25px 0"}}>
                    <label htmlFor="born-date-input"><i>Born: </i></label>
                    <input
                        type="datetime-local"
                        id="born-date-input"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                    />
                    <label htmlFor="died-date-input"><i> Died: </i></label>
                    <input
                        type="datetime-local"
                        id="died-date-input"
                        value={deathDate}
                        onChange={(e) => setDeathDate(e.target.value)}
                        required
                    />
                </div>
                <button id="submit-button" type="submit">
                {loading ? "Please wait ..." : "Write Obituary"}
                </button>
            </form>
        </div>
    </div>
  );
};


export default Overlay;