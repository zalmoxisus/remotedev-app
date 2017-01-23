import React, { Component, PropTypes } from 'react';
import { Button, Toolbar, Divider, Spacer } from 'remotedev-ui';
import RecordButton from './buttons/RecordButton';
import LockButton from './buttons/LockButton';
import InstanceSelector from './InstanceSelector';
import SyncButton from './buttons/SyncButton';

export default class ButtonBar extends Component {
  static propTypes = {
    shouldSync: PropTypes.bool,
    liftedState: PropTypes.object.isRequired,
    lib: PropTypes.string
  };

  constructor() {
    super();
    this.state = { settingsOpened: false };
    this.openSettings = this.openSettings.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.lib !== this.props.lib
      || nextProps.liftedState.isLocked !== this.props.liftedState.isLocked
      || nextProps.liftedState.isPaused !== this.props.liftedState.isPaused;
  }

  render() {
    return (
      <Toolbar>
        <RecordButton paused={this.props.liftedState.isPaused} />
        <LockButton
          locked={this.props.liftedState.isLocked}
          disabled={this.props.lib !== 'redux'}
        />
        <Divider />
        <InstanceSelector />
        <SyncButton />
      </Toolbar>
    );
  }
}
