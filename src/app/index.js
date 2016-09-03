import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, hashHistory, createMemoryHistory } from 'react-router';
import Layout from './containers/Root';
import App from './containers/App';
import LogsTable from './components/logs/Table';

const Root = (props) => {
  const { hash, ...rest } = props;
  const history = hash ? hashHistory : createMemoryHistory(location);
  return (
    <Router history={history}>
      <Route path="/" component={Layout} {...rest}>
        <IndexRoute component={App} />
        <Route path="logs" component={LogsTable} />
        <Route path="reports" component={LogsTable} />
      </Route>
    </Router>
  );
};

Root.propTypes = {
  hash: PropTypes.bool
};

export default Root;
