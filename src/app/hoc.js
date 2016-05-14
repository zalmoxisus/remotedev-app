import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { blueGrey300 } from 'material-ui/styles/colors';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: blueGrey300
  }
});


const enhance = ComposedComponent => class extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <ComposedComponent {...this.props} />
      </MuiThemeProvider>
    );
  }
};

export default enhance;
