import React, { Component, PropTypes } from 'react';
import { Tabs } from 'remotedev-ui';
import Connection from './Connection';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.tabs = [
      { name: 'Connection', component: Connection }
    ];
    this.state = { selected: 'Connection' };
  }

  handleSelect = selected => {
    this.setState({ selected });
  };

  render() {
    return <Tabs tabs={this.tabs} selected={this.state.selected} onClick={this.handleSelect} />;
  }
}

export default Settings;
