import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button } from 'remotedev-ui';
import RecordIcon from 'react-icons/lib/md/fiber-manual-record';
import { pauseRecording } from '../../actions';

class RecordButton extends Component {
  static propTypes = {
    paused: PropTypes.bool,
    pauseRecording: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.paused !== this.props.paused;
  }

  render() {
    return (
      <Button
        toolbar
        mark={!this.props.paused && 'base08'}
        title={this.props.paused ? 'Start recording' : 'Pause recording'}
        onClick={this.props.pauseRecording}
      >
        <RecordIcon />
      </Button>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    pauseRecording: () => dispatch(pauseRecording(!ownProps.paused))
  };
}

export default connect(null, mapDispatchToProps)(RecordButton);
