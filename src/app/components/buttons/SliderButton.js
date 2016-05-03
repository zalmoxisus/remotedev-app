import React, { Component, PropTypes } from 'react';
import TimerIcon from 'react-icons/lib/md/timer';
import TimerOffIcon from 'react-icons/lib/md/timer-off';
import Button from '../Button';

export default class DispatcherButton extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onClick: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.isOpen !== this.props.isOpen;
  }

  render() {
    return (
      <Button
        Icon={this.props.isOpen ? TimerOffIcon : TimerIcon}
        onClick={this.props.onClick}
      >Slider</Button>
    );
  }
}
