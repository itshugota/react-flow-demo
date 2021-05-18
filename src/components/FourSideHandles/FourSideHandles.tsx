import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  rightArrow: {
    position: 'absolute',
    top: '50%',
    right: -36
  }
}));

const RightArrow = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.8484 22.3389L23.854 12.3383C23.948 12.2443 24 12.1173 24 11.9844C24 11.8515 23.947 11.7245 23.853 11.6305L13.8484 1.65983C13.7054 1.51686 13.4905 1.47488 13.3036 1.55187C13.1166 1.62984 12.9956 1.8118 12.9956 2.01371L12.9956 7.51186L0.499803 7.51186C0.223895 7.51186 -4.52633e-05 7.7358 -4.52754e-05 8.01171L-4.56249e-05 16.0091C-4.5637e-05 16.285 0.223895 16.5089 0.499803 16.5089L12.9957 16.5089L12.9957 21.9861C12.9957 22.188 13.1177 22.3699 13.3046 22.4479C13.4915 22.5259 13.7054 22.4819 13.8484 22.3389Z" fill="#253134"/>
    </svg>
  )
}

const FourSideHandles = () => {
  const classes = useStyles();

  return (
    <>
      <span className={classes.rightArrow}>
        <RightArrow />
      </span>
    </>
  )
}

export default FourSideHandles;
