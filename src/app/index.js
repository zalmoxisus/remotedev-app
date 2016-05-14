import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { blueGrey300 } from 'material-ui/styles/colors';
import App from './containers/App';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: blueGrey300
  }
});

export default class Root extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <App />
      </MuiThemeProvider>
    );
  }
}
