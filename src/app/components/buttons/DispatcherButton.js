import React, { Component, PropTypes } from 'react';
import DispatchIcon from 'react-icons/lib/md/keyboard';
import DispatchHideIcon from 'react-icons/lib/md/keyboard-hide';
import Button from '../Button';

export default class DispatcherButton extends Component {
  static propTypes = {
    dispatcherIsOpen: PropTypes.bool,
    onClick: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.dispatcherIsOpen !== this.props.dispatcherIsOpen;
  }

  render() {
    return (
      <Button
        Icon={this.props.dispatcherIsOpen ? DispatchHideIcon : DispatchIcon}
        onClick={this.props.onClick}
      >Dispatcher</Button>
    );
  }
}
