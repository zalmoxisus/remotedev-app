import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TimerIcon from 'react-icons/lib/md/timer';
import TimerOffIcon from 'react-icons/lib/md/timer-off';
import Button from '../Button';
import { toggleSlider } from '../../actions';

class SliderButton extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    toggleSlider: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.isOpen !== this.props.isOpen;
  }

  render() {
    return (
      <Button
        Icon={this.props.isOpen ? TimerOffIcon : TimerIcon}
        onClick={this.props.toggleSlider}
      >Slider</Button>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    toggleSlider: bindActionCreators(toggleSlider, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(SliderButton);
