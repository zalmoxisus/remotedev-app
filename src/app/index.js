import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import enhance from './hoc';
import configureStore from './store/configureStore';
import {
  getMonitorSettings, getSocketSettings, getTestTemplates, getTemplatesSelected
} from './utils/localStorage';
import { CONNECT_REQUEST } from './constants/socketActionTypes';
import App from './containers/App';

class Root extends Component {
  componentWillMount() {
    this.store = configureStore({
      monitor: getMonitorSettings() || this.props.monitorOptions,
      test: {
        selected: getTemplatesSelected(),
        templates: getTestTemplates() || this.props.testTemplates
      }
    });
    this.store.dispatch({
      type: CONNECT_REQUEST,
      options: getSocketSettings() || this.props.socketOptions
    });
  }

  render() {
    return (
      <Provider store={this.store}>
        <App {...this.props} />
      </Provider>
    );
  }
}

Root.propTypes = {
  hash: PropTypes.bool,
  socketOptions: PropTypes.shape({
    hostname: PropTypes.string,
    port: PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    autoReconnect: PropTypes.bool,
    secure: PropTypes.bool
  }),
  monitorOptions: PropTypes.shape({
    selected: PropTypes.string
  }),
  testTemplates: PropTypes.array
};

export default enhance(Root);
