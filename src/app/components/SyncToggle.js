import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PinIcon from 'react-icons/lib/ti/pin';
import GoIcon from 'react-icons/lib/go/sync';
import Switch from 'react-switcher';
import { toggleSync } from '../actions';
import styles from '../styles';

class SyncToggle extends Component {
  static propTypes = {
    on: PropTypes.bool,
    style: PropTypes.object,
    onClick: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.on !== this.props.on || nextProps.style !== this.props.style;
  }

  render() {
    const { on, onClick, style } = this.props;
    return (
     <div style={style ? style : styles.syncToggle}>
       <Switch
         on={on}
         onClick={onClick}
         offIcon={<PinIcon/>}
         onIcon={<GoIcon/>}
       />
     </div>
   );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: bindActionCreators(toggleSync, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(SyncToggle);
