import React from 'react';
import EdgeWithContextMenu from './EdgeWithContextMenu';
import LabelEdge from './LabelEdge';

export default React.memo(
  (edgeProps) => {
    return (
      <EdgeWithContextMenu EdgeComponent={LabelEdge} edgeProps={edgeProps} />
    )
  }
);
