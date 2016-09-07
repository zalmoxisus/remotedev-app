import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory, createMemoryHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store/configureStore';
import { CONNECT_REQUEST } from './constants/socketActionTypes';
import createElement from './utils/createElement';
import Layout from './containers/Layout';
import App from './containers/App';
import LogsTable from './components/logs/Table';

const Root = (props) => {
  const { hash, ...rest } = props;
  const store = configureStore();
  store.dispatch({ type: CONNECT_REQUEST, options: props.socketOptions });

  let history = hash ? hashHistory : createMemoryHistory(location);
  history = syncHistoryWithStore(history, store);

  return (
    <Provider store={store}>
      <Router history={history} createElement={createElement(rest)}>
        <Route path="/" component={Layout}>
          <IndexRoute component={App} />
          <Route path="logs" component={LogsTable} />
          <Route path="reports" component={LogsTable} />
        </Route>
      </Router>
    </Provider>
  );
};

Root.propTypes = {
  hash: PropTypes.bool,
  socketOptions: PropTypes.shape({
    hostname: PropTypes.string,
    port: PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    autoReconnect: PropTypes.bool,
    secure: PropTypes.bool
  })
};

export default Root;
