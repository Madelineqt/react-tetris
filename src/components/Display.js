import React from 'react';
import { StyledDisplay } from './styles/StyledDisplay';

const Display = ({ gameOver, text }) => (
  <StyledDisplay gameOver={gameOver}>{text}</StyledDisplay>
);
const Display2 = ({ gameOver, text, onChange, handleInputChange, scoresubmit }) => (
  <StyledDisplay gameOver={gameOver}>Name:<input type="text" name="nombre" id="nombre" maxLength="10" size="10" onChange={handleInputChange} value={scoresubmit.nombre}></input></StyledDisplay>
);

export {Display, Display2};
