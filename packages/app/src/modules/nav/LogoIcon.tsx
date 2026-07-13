import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  svg: {
    width: 28,
    height: 28,
  },
});

export const LogoIcon = () => {
  const classes = useStyles();

  return (
    <svg
      className={classes.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
    >
      <rect x="0" y="0" width="36" height="36" rx="7" fill="#122FB1" />
      <text
        x="18" y="26"
        fontFamily="'Roboto', 'Arial', sans-serif"
        fontWeight="800"
        fontSize="16"
        fill="#F0D224"
        textAnchor="middle"
      >BDP</text>
    </svg>
  );
};