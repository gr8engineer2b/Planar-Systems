import React, { useEffect, useState } from "react";
import Character from "./character.jsx";

const Preview = (props) => {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    //checking for null
    if (props.data) {
      try {
        const json = JSON.parse(props.data);
        if (json.type === "character") {
          //if there is a change to be made
          if (JSON.stringify(characters) !== JSON.stringify(json.data)) {
            setCharacters([...json.data.map((character) => character)]);
          }
        } else {
          console.log("unkown type, cannot handle component");
        }
      } catch (err) {
        console.log(
          "Please remedy your JSON error in " + props.filename + ":\n" + err
        );
      }
    }
  });

  return (
    <div className="previewpane">
      <h3>Preview</h3>
      <div className="characterframe">
        {characters !== [] ? (
          characters.map((character) => (
            <Character key={character.name} character={character} />
          ))
        ) : (
          <p>No Characters to Display</p>
        )}
      </div>
    </div>
  );
};

export default Preview;
