import React, { useMemo } from 'react';

import { StandardEdge } from 'react-flowy/lib';

export default React.memo(
  ({
    waypoints,
    ...rest
  }) => {
    return (
      <>
        <circle className="edge__start-indicator" cx={waypoints[0].x} cy={waypoints[0].y} r="4" />
        <StandardEdge waypoints={waypoints} {...rest} />
      </>
    );
  }
);
