import React, { Component, PropTypes, cloneElement } from 'react';
import { withRouter } from 'react-router';
import { Tabs, Tab } from 'material-ui/Tabs';
import enhance from '../hoc';
import styles from '../styles';

export default class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = { tab: 0 };
  }
  handleChange = (pathname) => {
    this.props.router.push(pathname);
  };
  render() {
    const { children, ...rest } = this.props;
    return (
      <div style={{ height: '100%', display: 'flex', flexFlow: 'column nowrap' }}>
        <Tabs
          onChange={this.handleChange}
          value={this.props.location.pathname}
        >
          <Tab label="Monitoring" style={styles.tab} value="/"/>
          <Tab label="Logs" style={styles.tab} value="/logs"/>
          <Tab label="Reports" style={styles.tab} value="/reports"/>
        </Tabs>
        {cloneElement(children, rest)}
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.any,
  router: PropTypes.object,
  location: PropTypes.object
};

export default enhance(withRouter(Layout));
