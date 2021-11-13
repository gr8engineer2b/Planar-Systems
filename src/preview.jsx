import React from "react";
import Character from "./character.jsx";

class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      characters: [],
    };
  }

  componentDidUpdate() {
    let json = { data: [] };
    if (this.props.data()) {
      try {
        json = JSON.parse(this.props.data());
        if (
          json.character !== "character" &&
          JSON.stringify(this.state.characters) !== JSON.stringify(json.data)
        ) {
          this.setState({
            characters: [...json.data.map((character) => character)],
          });
        } else {
          console.log("unkown type, cannot handle component");
        }
      } catch (err) {
        console.log(
          "Please remedy your JSON error in " +
            this.props.filename +
            ":\n" +
            err
        );
      }
    } else {
      console.log("Recieved nothing to render");
    }
  }

  render() {
    return (
      <div className="previewpane">
        <div className="characterframe">
          {this.state.characters
            ? this.state.characters.map((character) => (
                <Character key={character.name} character={character} />
              ))
            : "No Characters Detected"}
        </div>
      </div>
    );
  }
}

export default Preview;
