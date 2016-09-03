import {
  grey600,
  blueGrey100,
  blueGrey400,
  fullWhite,
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

export default {
  spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: 'rgb(79, 90, 101)',
    primary2Color: 'rgb(79, 90, 101)',
    primary3Color: grey600,
    accent1Color: blueGrey400,
    accent2Color: blueGrey400,
    accent3Color: blueGrey100,
    textColor: fullWhite,
    alternateTextColor: fullWhite,
    canvasColor: '#2A2F3A',
    borderColor: fade(fullWhite, 0.3),
    disabledColor: fade(fullWhite, 0.3)
  }
};
