import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { monitors } from '../utils/getMonitor';
import { selectMonitor } from '../actions';
import styles from '../styles';

class MonitorSelector extends Component {
  static propTypes = {
    selected: PropTypes.string,
    selectMonitor: PropTypes.func.isRequired
  };

  items = monitors.map((item, i) =>
    <MenuItem key={i} value={item.key} primaryText={item.title} />
  );

  shouldComponentUpdate(nextProps) {
    return nextProps.selected !== this.props.selected;
  }

  render() {
    return (
      <SelectField
        style={styles.select}
        labelStyle={styles.selectLabel}
        iconStyle={styles.selectIcon}
        onChange={this.props.selectMonitor}
        value={this.props.selected || 'InspectorMonitor'}
      >
        {this.items}
      </SelectField>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    selectMonitor: bindActionCreators(selectMonitor, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(MonitorSelector);
