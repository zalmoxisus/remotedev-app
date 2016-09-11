import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory, createMemoryHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store/configureStore';
import { getMonitorSettings, getSocketSettings } from './utils/localStorage';
import { CONNECT_REQUEST } from './constants/socketActionTypes';
import createElement from './utils/createElement';
import Layout from './containers/Layout';
import App from './containers/App';
import LogsTable from './components/reports/Table';

export default class Root extends Component {
  componentWillMount() {
    this.store = configureStore({
      monitor: getMonitorSettings() || this.props.monitorOptions
    });
    this.store.dispatch({
      type: CONNECT_REQUEST,
      options: getSocketSettings() || this.props.socketOptions
    });

    const history = this.props.hash ? hashHistory : createMemoryHistory(location);
    this.history = syncHistoryWithStore(history, this.store);
  }

  render() {
    return (
      <Provider store={this.store}>
        <Router history={this.history} createElement={createElement(this.props)}>
          <Route path="/" component={Layout}>
            <IndexRoute component={App} />
            <Route path="logs" component={LogsTable} />
            <Route path="reports" component={LogsTable} />
          </Route>
        </Router>
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
  })
};
