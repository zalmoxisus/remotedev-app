import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightTheme from './themes/light';
import darkTheme from './themes/dark';

injectTapEventPlugin();

const enhance = (ComposedComponent, isLightTheme) => class extends Component {
  theme = getMuiTheme(isLightTheme ? lightTheme : darkTheme);

  render() {
    return (
      <MuiThemeProvider muiTheme={this.theme}>
        <ComposedComponent {...this.props} />
      </MuiThemeProvider>
    );
  }
};

export default enhance;
