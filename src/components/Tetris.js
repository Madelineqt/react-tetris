import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import { createStage, checkCollision } from '../gameHelpers';
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';
// Custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';

// Components
import {Stage, Stage2} from './Stage';
import {Display, Display2} from './Display';
import {StartButton, StartButton2} from './StartButton';


const Tetris = () => {
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);


  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
    rowsCleared
  );
  const [scoresubmit, setScoreSubmit] = useState({
    nombre: '',
    score: `${score}`
  })
  const [tabla, setTabla] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  async function cargarTabla() {
    if (cargando) {
      return
    }
    try {
      setCargando(true)
      const { data: resultado } = await Axios.get(`https://sjotetris.herokuapp.com/leaderboard`)
      setTabla({
        resultado
      })
      console.log("refreshing leaderboard", tabla)
      setCargando(false)
    } catch (error) {
      console.error(error)
      setCargando(false)
    }
  }
  useEffect(() => {
    // Refresh the leaderboard at the start
    cargarTabla()

    // Refresh every two minutes
    const interval = setInterval(() => {
      cargarTabla()
    }, 1200000);
    return () => clearInterval(interval);
  }, [])

  async function handleSubmit(e){
    if (submitting){
      return
    }
    e.preventDefault()

    // Reload leaderboard on submit
    cargarTabla()

    try {
      setSubmitting(true)
      await Axios.post(`https://sjotetris.herokuapp.com/leaderboard`, scoresubmit);
      setSubmitting(false)
      setSubmitted(true)
    } catch (error){
      console.log(error)
      setSubmitting(false)
    }
  }

  function handleInputChange(e){

    setScoreSubmit({
      nombre: document.getElementById("nombre").value,
      score: `${score}`,
      [e.target.name]: e.target.value
    })
    console.log(scoresubmit)
  }


  const movePlayer = dir => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  };

  const keyUp = ({ keyCode }) => {
    if (!gameOver) {
      // Activate the interval again when user releases down arrow.
      if (keyCode === 40) {
        setDropTime(1000 / (level + 1));
      }
    }
  };

  const startGame = () => {
    // Reset everything
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setScore(0);
    setLevel(0);
    setRows(0);
    setGameOver(false);
    setScoreSubmit({
      ...scoresubmit,
      score: 0
    })
    setSubmitted(false)
  };

  const drop = () => {
    // Increase level when player has cleared 10 rows
    if (rows > (level + 1) * 10) {
      setLevel(prev => prev + 1);
      // Also increase speed
      setDropTime(1000 / (level + 1) + 200);
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      // Game over!
      if (player.pos.y < 1) {
        console.log('GAME OVER!!!');
        setGameOver(true);
        setDropTime(null);
        setScoreSubmit({
          ...scoresubmit,
          score: `${score}`
        })
        cargarTabla()
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const dropPlayer = () => {
    // We don't need to run the interval when we use the arrow down to
    // move the tetromino downwards. So deactivate it for now.
    setDropTime(null);
    drop();
  };

  // This one starts the game
  // Custom hook by Dan Abramov
  useInterval(() => {
    drop();
  }, dropTime);

  const move = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1);
      } else if (keyCode === 40) {
        dropPlayer();
      } else if (keyCode === 38) {
        playerRotate(stage, 1);
      }
    }
  };

  return (
      <StyledTetrisWrapper
    role="button"
    tabIndex="0"
    onKeyDown={e => move(e)}
    onKeyUp={keyUp}
      >
      <StyledTetris>
      <Stage stage={stage} />
      <aside>
      {gameOver ? (
          <div>
          <Display gameOver={gameOver} text="Game Over" />
          <Display text={`Score: ${score}`} />
          {submitted ? null : <form onSubmit={handleSubmit}>
           <Display2 handleInputChange={handleInputChange} scoresubmit={scoresubmit}></Display2>
           <StartButton2></StartButton2>
           </form>}
        </div>
      ) : (
          <div>
          <Display text={`Score: ${score}`} />
          <Display text={`rows: ${rows}`} />
          <Display text={`Level: ${level}`} />
          </div>
      )}
      <StartButton callback={startGame} />
      </aside>
      {!tabla ?
       null
       :
       <Stage2 stage={stage} tabla={tabla}></Stage2>
      }
    </StyledTetris>


    </StyledTetrisWrapper>
  );
};

export default Tetris;
