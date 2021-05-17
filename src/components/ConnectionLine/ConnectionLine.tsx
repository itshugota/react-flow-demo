import React from 'react';
import { ConnectionLineComponentProps } from 'react-flow-renderer';

const ConnectionLine: React.FC<ConnectionLineComponentProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
}) => {
  return (
    <g>
      <path
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        d={`M${sourceX},${sourceY} C ${sourceX} ${targetY} ${sourceX} ${targetY} ${targetX},${targetY}`}
      />
      <circle cx={targetX} cy={targetY} fill="#fff" r={3} stroke="#222" strokeWidth={1.5} />
    </g>
  );
};

export default ConnectionLine;
