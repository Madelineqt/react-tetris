import React from 'react';
import { StyledStage, StyledStage2 } from './styles/StyledStage';

import Cell from './Cell';

const Stage = ({ stage }) => (
  <StyledStage width={stage[0].length} height={stage.length}>
    {stage.map(row => row.map((cell, x) => <Cell key={x} type={cell[0]} />))}
  </StyledStage>
);
const Stage2 = ({ stage, tabla }) => (
  <StyledStage2 height={stage.length}>
    
    <table>
    <thead>
      <th>#</th>
      <th>Nombre</th>
      <th>Score</th>
    </thead>
    {tabla.resultado.sort((a, b) => b.score - a.score).slice(0, 15).map((item, key) => (<tbody><tr key={key}>
    <th>{key + 1}</th>
    <th>{item.nombre}</th>
    <th>{item.score}</th>
    </tr>
    </tbody>
    ))}
</table>
  </StyledStage2>
);

export {Stage, Stage2};
