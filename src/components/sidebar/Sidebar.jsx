import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputIcon from '@material-ui/icons/Input';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import HelpIcon from '@material-ui/icons/Help';
import ForumIcon from '@material-ui/icons/Forum';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { makeStyles } from '@material-ui/core/styles';
import CallMergeReverseIcon from '../icons/CallMergeReverse';
import CallSplitReverseIcon from '../icons/CallSplitReverse';
import FilterAltIcon from '../icons/FilterAlt';
import DraggableBlock from './DraggableBlock';
import StartNodeShell from '../nodes/StartNode/StartNodeShell';
import IntentNodeShell from '../nodes/IntentNode/IntentNodeShell';
import ConditionNodeShell from '../nodes/ConditionNode/ConditionNodeShell';
import ActionNodeShell from '../nodes/ActionNode/ActionNodeShell';
import TerminateNodeShell from '../nodes/TerminateNode/TerminateNodeShell';
import BaseWorkflowNodeShell from '../nodes/BaseWorkflowNode/BaseWorkflowNodeShell';

const SIDEBAR_WIDTH = 280;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: SIDEBAR_WIDTH,
    [theme.breakpoints.down('md')]: {
      display: 'none',
    }
  },
  drawerPaper: {
    width: SIDEBAR_WIDTH,
    border: 'none',
    boxShadow: theme.shadows[6],
    padding: theme.spacing(2)
  },
  mainBlockTitle: {
    fontSize: 20,
    color: 'var(--black)',
    marginTop: theme.spacing(3.5),
    fontWeight: 500
  },
  otherBlockTitle: {
    fontSize: 20,
    color: 'var(--black)',
    marginTop: 0,
    fontWeight: 500
  },
  draggableMainBlocks: {
    marginTop: theme.spacing(3),
  },
  draggableOtherBlocks: {
    marginTop: theme.spacing(3),
    flexGrow: 1,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userGuideButton: {
    display: 'flex',
    alignItems: 'center',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: theme.palette.primary.main,
    fontSize: 14,
    fontWeight: 500,
    transition: 'color 0.3s ease-in',
    '& .MuiSvgIcon-root': {
      color: theme.palette.grey[700],
      marginRight: theme.spacing(0.75),
      transition: 'color 0.3s ease-in',
    },
    '&:hover': {
      color: theme.palette.primary.dark,
      '& .MuiSvgIcon-root': {
        color: theme.palette.grey[800],
      }
    }
  },
  exitButton: {
    '& .MuiSvgIcon-root': {
      marginRight: theme.spacing(0.75)
    }
  }
}));

const draggableMainBlocks = [
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
];

const draggableOtherBlocks = [
  {
    name: 'Base workflow',
    description: 'A base workflow (or a child workflow)',
    nodeType: 'baseWorkflowNode',
    Icon: ForumIcon,
    DragShell: BaseWorkflowNodeShell,
  },
];

const Sidebar = () => {
  const classes = useStyles();

  return (
    <>
      <Drawer className={classes.drawer} variant="permanent" anchor="left" classes={{ paper: classes.drawerPaper }}>
        <img src="/assets/WorkflowLogo.png" width="193" height="auto" style={{ userSelect: 'none', pointerEvents: 'none' }} />
        <Typography className={classes.mainBlockTitle} variant="h5" align="left">
          Main blocks
        </Typography>
        <section className={classes.draggableMainBlocks}>
          {draggableMainBlocks.map(({ name, description, nodeType, Icon, DragShell }) => (
            <DraggableBlock key={name} Icon={Icon} DragShell={DragShell} name={name} description={description} nodeType={nodeType} />
          ))}
        </section>
        <Typography className={classes.otherBlockTitle} variant="h5" align="left">
          Others
        </Typography>
        <section className={classes.draggableOtherBlocks}>
          {draggableOtherBlocks.map(({ name, description, nodeType, Icon, DragShell }) => (
            <DraggableBlock key={name} Icon={Icon} DragShell={DragShell} name={name} description={description} nodeType={nodeType} />
          ))}
        </section>
        <footer className={classes.footer}>
          <button className={classes.userGuideButton}>
            <HelpIcon />
            User Guide
          </button>
          <Button color="primary" className={classes.exitButton}>
            <ExitToAppIcon />
            Exit
          </Button>
        </footer>
      </Drawer>
    </>
  );
};

export default React.memo(Sidebar);
