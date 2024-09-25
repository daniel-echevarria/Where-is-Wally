import "./CharacterSelection.css";
import _ from "lodash";
import { useState, useEffect, useRef } from "react";
import TargetingCircle from "./TargetingCircle/TargetingCircle";
import CharacterList from "./CharacterList/CharacterList";
import apiUrl from "../../config";

const CharacterSelection = ({
  clickCoordinates,
  visible,
  setVisible,
  relativeCoord,
  setAnswer,
  placeMarker,
  characters,
  setCharacters,
}) => {
  const circleDiameter = 50;
  const circleRadius = circleDiameter / 2;
  const xPos = clickCoordinates.x - circleRadius - 2;
  const yPos = clickCoordinates.y - circleRadius - 2;
  const display = visible ? "flex" : "none";

  const isInTargetRange = (value, target, errorMargin) => {
    const lowerRange = target - errorMargin;
    const upperRange = target + errorMargin;
    const range = _.range(lowerRange, upperRange);
    return range.includes(value);
  };

  const charIsInCircle = (relativeCoord, char) => {
    return (
      isInTargetRange(relativeCoord.x, char.x, circleRadius) &&
      isInTargetRange(relativeCoord.y, char.y, circleRadius)
    );
  };

  const handleCharacterSelection = (e) => {
    const selectedChar = characters.find(
      (char) => char.name === e.target.value
    );
    if (charIsInCircle(relativeCoord, selectedChar)) {
      setCharacters(characters.filter((char) => char !== selectedChar));
      placeMarker({ name: e.target.value, x: xPos, y: yPos });
      setAnswer("correct");
    } else {
      setAnswer("wrong");
    }
    // const nailedIt = charIsInCircle(relativeCoord, selectedChar);
    // nailedIt && placeMarker({ name: e.target.value, x: xPos, y: yPos });
    // setAnswer(nailedIt ? "correct" : "wrong");
    setVisible(false);
  };

  return (
    <div
      className="char-selection"
      style={{ display: display, top: yPos, left: xPos }}
    >
      <TargetingCircle circleDiameter={circleDiameter} />
      <CharacterList
        characters={characters}
        handleCharacterSelection={handleCharacterSelection}
      />
    </div>
  );
};

export default CharacterSelection;
