import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import LockIcon from 'react-icons/lib/md/lock';
import LockOpenIcon from 'react-icons/lib/md/lock-open';
import Button from '../Button';
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
        Icon={this.props.locked ? LockIcon : LockOpenIcon}
        onClick={this.props.lockChanges}
      >{this.props.locked ? 'Unlock changes' : 'Lock changes'}</Button>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    lockChanges: () => dispatch(lockChanges(!ownProps.locked))
  };
}

export default connect(null, mapDispatchToProps)(LockButton);
