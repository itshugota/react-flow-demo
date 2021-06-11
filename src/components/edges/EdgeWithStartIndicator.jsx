import React from 'react';
import clsx from 'clsx';

import { StandardEdge } from 'react-flowy/lib';

export default React.memo(
  ({
    waypoints,
    isInvalid,
    ...rest
  }) => {
    return (
      <>
        <circle className={clsx('edge__start-indicator', isInvalid ? 'edge__start-indicator--invalid' : '')} cx={waypoints[0].x} cy={waypoints[0].y} r="4" />
        <StandardEdge waypoints={waypoints} isInvalid={isInvalid} {...rest} />
      </>
    );
  }
);
