import React, { Component, PropTypes } from 'react';
import { ActionCreators } from 'redux-devtools-instrument';
import { Button, Toolbar, Divider, Spacer } from 'remotedev-ui';
import RecordButton from './buttons/RecordButton';
import LockButton from './buttons/LockButton';
import InstanceSelector from './InstanceSelector';
import SyncButton from './buttons/SyncButton';

const { reset, rollback, commit, sweep } = ActionCreators;

export default class ButtonBar extends Component {
  static propTypes = {
    shouldSync: PropTypes.bool,
    liftedState: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    lib: PropTypes.string
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.lib !== this.props.lib
      || nextProps.liftedState !== this.props.liftedState;
  }

  handleRollback = () => {
    this.props.dispatch(rollback());
  };

  handleSweep = () => {
    this.props.dispatch(sweep());
  };

  handleCommit = () => {
    this.props.dispatch(commit());
  };

  handleReset = () => {
    this.props.dispatch(reset());
  };

  render() {
    const { computedStates, skippedActionIds, isPaused, isLocked } = this.props.liftedState;
    const noStates = computedStates.length < 2;

    return (
      <Toolbar>
        <RecordButton paused={isPaused} />
        <LockButton
          locked={isLocked}
          disabled={this.props.lib !== 'redux'}
        />
        <Divider />
        <Button
          title="Reset to the state you created the store with"
          tooltipPosition="bottom"
          onClick={this.handleReset}
        >
          Reset
        </Button>
        <Button
          title="Roll back to the last committed state"
          tooltipPosition="bottom"
          onClick={this.handleRollback}
          disabled={noStates}
        >
          Revert
        </Button>
        <Button
          title="Remove all currently disabled actions from the log"
          tooltipPosition="bottom"
          onClick={this.handleSweep}
          disabled={skippedActionIds.length === 0}
        >
          Sweep
        </Button>
        <Button
          title="Remove all actions from the log,\a and make the current state your initial state"
          tooltipPosition="bottom"
          onClick={this.handleCommit}
          disabled={noStates}
        >
          Commit
        </Button>
        <Divider />
        <InstanceSelector />
        <SyncButton />
      </Toolbar>
    );
  }
}
