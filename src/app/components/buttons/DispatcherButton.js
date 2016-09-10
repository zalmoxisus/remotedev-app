import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DispatchIcon from 'react-icons/lib/md/keyboard';
import DispatchHideIcon from 'react-icons/lib/md/keyboard-hide';
import Button from '../Button';
import { toggleDispatcher } from '../../actions';

class DispatcherButton extends Component {
  static propTypes = {
    dispatcherIsOpen: PropTypes.bool,
    toggleDispatcher: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.dispatcherIsOpen !== this.props.dispatcherIsOpen;
  }

  render() {
    return (
      <Button
        Icon={this.props.dispatcherIsOpen ? DispatchHideIcon : DispatchIcon}
        onClick={this.props.toggleDispatcher}
      >Dispatcher</Button>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    toggleDispatcher: bindActionCreators(toggleDispatcher, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(DispatcherButton);
