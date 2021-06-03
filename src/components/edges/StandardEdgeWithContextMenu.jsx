import React, { useState } from 'react';
import { StandardEdge } from 'react-flowy/lib';
import EdgeWithContextMenu from './EdgeWithContextMenu';

export default React.memo(
  (edgeProps) => {
    return (
      <EdgeWithContextMenu EdgeComponent={StandardEdge} edgeProps={edgeProps} />
    )
  }
);
