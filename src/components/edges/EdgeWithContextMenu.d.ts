import React from 'react';
import { EdgeProps } from 'react-flowy/lib';

interface EdgeWithContextMenuProps {
  EdgeComponent: React.FC;
  edgeProps: EdgeProps;
}

export default function EdgeWithContextMenu(props: EdgeWithContextMenuProps): JSX.Element;
