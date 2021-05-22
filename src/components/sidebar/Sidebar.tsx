import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import InputIcon from '@material-ui/icons/Input';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import { makeStyles } from '@material-ui/core/styles';
import WorkflowLogo from './WorkflowLogo';
import CallMergeReverseIcon from '../icons/CallMergeReverse';
import CallSplitReverseIcon from '../icons/CallSplitReverse';
import FilterAltIcon from '../icons/FilterAlt';
import DraggableBlock from './DraggableBlock';
import StartNodeShell from '../nodes/StartNode/StartNodeShell';
import IntentNodeShell from '../nodes/IntentNode/IntentNodeShell';
import ConditionNodeShell from '../nodes/ConditionNode/ConditionNodeShell';
import ActionNodeShell from '../nodes/ActionNode/ActionNodeShell';
import TerminateNodeShell from '../nodes/TerminateNode/TerminateNodeShell';

const SIDEBAR_WIDTH = 280;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: SIDEBAR_WIDTH,
  },
  drawerPaper: {
    width: SIDEBAR_WIDTH,
    boxShadow: theme.shadows[4],
    padding: theme.spacing(2)
  },
  blockTitle: {
    fontSize: 20,
    color: 'var(--black)',
    marginTop: theme.spacing(3.5),
    fontWeight: 500
  },
  draggableBlocks: {
    marginTop: theme.spacing(3)
  }
}));

const draggableBlocks = [
  {
    name: 'Start',
    description: 'The entry point of the workflow',
    nodeType: 'startNode',
    Icon: CallMergeReverseIcon,
    DragShell: StartNodeShell,
  },
  {
    name: 'Intent',
    description: 'An intent or action of a user',
    nodeType: 'intentNode',
    Icon: InputIcon,
    DragShell: IntentNodeShell,
  },
  {
    name: 'Condition',
    description: 'A condition of the parameter(s) in an intent',
    nodeType: 'conditionNode',
    Icon: FilterAltIcon,
    DragShell: ConditionNodeShell,
  },
  {
    name: 'Action',
    description: 'An action of the bot',
    nodeType: 'actionNode',
    Icon: FlashOnIcon,
    DragShell: ActionNodeShell,
  },
  {
    name: 'Terminate',
    description: 'The point where the workflow terminates',
    nodeType: 'terminateNode',
    Icon: CallSplitReverseIcon,
    DragShell: TerminateNodeShell,
  }
]

const Sidebar = () => {
  const classes = useStyles();

  return (
    <>
      <Drawer className={classes.drawer} variant="permanent" anchor="left" classes={{ paper: classes.drawerPaper }}>
        <WorkflowLogo />
        <Typography className={classes.blockTitle} variant="h5" align="left">
          Blocks
        </Typography>
        <section className={classes.draggableBlocks}>
          {draggableBlocks.map(({ name, description, nodeType, Icon, DragShell }) => (
            <DraggableBlock key={name} Icon={Icon} DragShell={DragShell} name={name} description={description} nodeType={nodeType} />
          ))}
        </section>
      </Drawer>
    </>
  );
};

export default Sidebar;
