import { useEffect, useState } from "react";
import "./App.css";
import wallyImg from "./assets/wally.jpg";
import CharacterSelection from "./components/CharacterSelection";
import { differenceInSeconds } from "date-fns";
import NameInputModal from "./components/NameInputModal";

function App() {
  const [visible, setVisible] = useState(false);
  const [clickCoordinates, setClickCoordinates] = useState({ x: 0, y: 0 });
  const [relativeCoord, setRelativeCoord] = useState({ x: 0, y: 0 });
  const [markers, setMarkers] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [scoreId, setScoreId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Get Characters from Backend
  useEffect(() => {
    const getCharacters = async () => {
      const response = await fetch("http://localhost:3000/personages");
      const charactersObjects = await response.json();
      setCharacters(charactersObjects);
    };
    getCharacters();
  }, []);

  // Check for game over
  useEffect(() => {
    markers.length === characters.length &&
      markers.length > 0 &&
      setGameOver(true);
  }, [markers.length, characters.length]);

  // Get the score (time) of the last player
  useEffect(() => {
    const getScore = async (id) => {
      if (!gameOver) {
        return;
      }
      const response = await fetch(`http://localhost:3000/scores/${id}`);
      const result = await response.json();
      const startTime = new Date(result.created_at);
      const now = new Date();
      console.log(differenceInSeconds(now, startTime));
      setIsOpen(true);
    };
    getScore(scoreId);
  }, [gameOver, scoreId]);

  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const inImgX = Math.round(e.clientX - rect.x);
    const inImgY = Math.round(e.clientY - rect.y);
    const inImgCoordinates = { x: inImgX, y: inImgY };
    const clientCoordinates = { x: e.clientX, y: e.clientY };
    setClickCoordinates(clientCoordinates);
    setRelativeCoord(inImgCoordinates);
    setVisible(visible ? false : true);
    setAnswer(null);
  };

  const Answer = () => {
    return <div className={answer}>{answer === "correct" ? "✅" : "❌"}</div>;
  };

  const answerBox = answer && visible ? <Answer /> : "";

  const markerList = markers.map((marker) => {
    return (
      <div
        key={marker.name}
        className="marker"
        style={{ top: marker.y, left: marker.x }}
      >
        <span>{"❎"}</span>
        <span className="marker-name">{marker.name}</span>
      </div>
    );
  });

  const placeMarker = (marker) => {
    setMarkers([
      ...markers,
      {
        name: marker.name,
        x: marker.x,
        y: marker.y,
      },
    ]);
  };

  return (
    <>
      <div className="answer-box">{answerBox}</div>
      <CharacterSelection
        clickCoordinates={clickCoordinates}
        relativeCoord={relativeCoord}
        visible={visible}
        setAnswer={setAnswer}
        placeMarker={placeMarker}
        characters={characters}
        gameOver={gameOver}
        setScoreId={setScoreId}
      />
      <NameInputModal isOpen={isOpen} />
      <img onClick={handleClick} src={wallyImg}></img>
      <div className="markers">{markerList}</div>
    </>
  );
}

export default App;
