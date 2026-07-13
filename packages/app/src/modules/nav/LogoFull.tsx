import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  svg: {
    width: 'auto',
    height: 30,
  },
});

export const LogoFull = () => {
  const classes = useStyles();

  return (
    <svg
      className={classes.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 210 44"
    >
      <text
        x="4" y="33"
        fontFamily="'Roboto', 'Arial', sans-serif"
        fontWeight="800"
        fontSize="31"
        fill="#F0D224"
        letterSpacing="-1"
      >BDP</text>
      <rect x="87" y="7" width="1.5" height="30" fill="#F0D224" opacity="0.45" />
      <text
        x="96" y="20"
        fontFamily="'Roboto', 'Arial', sans-serif"
        fontWeight="700"
        fontSize="13"
        fill="#FFFFFF"
        letterSpacing="0.5"
      >BANAMEX</text>
      <text
        x="96" y="35"
        fontFamily="'Roboto', 'Arial', sans-serif"
        fontWeight="400"
        fontSize="11"
        fill="#F0D224"
        fillOpacity="0.80"
        letterSpacing="0.2"
      >Developer Portal</text>
    </svg>
  );
};