import React from 'react';
import EdgeWithContextMenu from './EdgeWithContextMenu';
import EdgeWithStartIndicator from './EdgeWithStartIndicator';

export default React.memo(
  (edgeProps) => {
    return (
      <EdgeWithContextMenu EdgeComponent={EdgeWithStartIndicator} edgeProps={edgeProps} />
    )
  }
);
