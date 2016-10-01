import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import RecordIcon from 'react-icons/lib/md/fiber-manual-record';
import PauseIcon from 'react-icons/lib/md/pause-circle-filled';
import Button from '../Button';
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
        Icon={this.props.paused ? RecordIcon : PauseIcon}
        onClick={this.props.pauseRecording}
      >{this.props.paused ? 'Start recording' : 'Pause recording'}</Button>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    pauseRecording: () => dispatch(pauseRecording(!ownProps.paused))
  };
}

export default connect(null, mapDispatchToProps)(RecordButton);
