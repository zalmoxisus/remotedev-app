import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'remotedev-ui';
import HistoryIcon from 'react-icons/lib/md/av-timer';
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
        mark={this.props.isOpen && 'base0B'}
        title={this.props.isOpen ? 'Hide slider' : 'Show slider'}
        tooltipPosition="top-left"
        onClick={this.props.toggleSlider}
      >
        <HistoryIcon />
      </Button>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    toggleSlider: bindActionCreators(toggleSlider, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(SliderButton);
