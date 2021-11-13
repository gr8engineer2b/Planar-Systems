import React from "react";

const Character = ({ character }) => {
  return (
    <div className="character">
      {character.name}, The {character.profession}
    </div>
  );
};

export default Character;
