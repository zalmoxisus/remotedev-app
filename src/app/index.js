import 'devui/lib/presets';
import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import enhance from './hoc';
import configureStore from './store/configureStore';
import { CONNECT_REQUEST } from './constants/socketActionTypes';
import App from './containers/App';

class Root extends Component {
  componentWillMount() {
    configureStore((store, preloadedState) => {
      this.store = store;
      store.dispatch({
        type: CONNECT_REQUEST,
        options: preloadedState.connection || this.props.socketOptions
      });
      this.forceUpdate();
    });
  }

  render() {
    if (!this.store) return null;
    return (
      <Provider store={this.store}>
        <App {...this.props} />
      </Provider>
    );
  }
}

Root.propTypes = {
  socketOptions: PropTypes.shape({
    hostname: PropTypes.string,
    port: PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    autoReconnect: PropTypes.bool,
    secure: PropTypes.bool
  })
};

export default enhance(Root);
