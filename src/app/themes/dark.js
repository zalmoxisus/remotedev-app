import {
  cyan700,
  grey600,
  blueGrey100, blueGrey200, blueGrey400,
  fullWhite,
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

export default {
  spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: cyan700,
    primary2Color: cyan700,
    primary3Color: grey600,
    accent1Color: blueGrey200,
    accent2Color: blueGrey400,
    accent3Color: blueGrey100,
    textColor: fullWhite,
    alternateTextColor: '#2A2F3A',
    canvasColor: '#2A2F3A',
    borderColor: fade(fullWhite, 0.3),
    disabledColor: fade(fullWhite, 0.3)
  }
};
