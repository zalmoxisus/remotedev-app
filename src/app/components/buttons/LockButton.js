import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button } from 'remotedev-ui';
import LockIcon from 'react-icons/lib/go/lock';
import { lockChanges } from '../../actions';

class LockButton extends Component {
  static propTypes = {
    locked: PropTypes.bool,
    lockChanges: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.locked !== this.props.locked;
  }

  render() {
    return (
      <Button
        toolbar
        mark={this.props.locked && 'base0D'}
        title={this.props.locked ? 'Unlock changes' : 'Lock changes'}
        onClick={this.props.lockChanges}
      >
        <LockIcon />
      </Button>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    lockChanges: () => dispatch(lockChanges(!ownProps.locked))
  };
}

export default connect(null, mapDispatchToProps)(LockButton);
