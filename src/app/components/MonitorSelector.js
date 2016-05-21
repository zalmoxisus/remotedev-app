import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { sideMonitors } from '../containers/DevTools';
import styles from '../styles';

export default class MonitorSelector extends Component {
  static propTypes = {
    selected: PropTypes.string,
    onSelect: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.selected !== this.props.selected;
  }

  render() {
    return (
      <SelectField
        style={styles.select}
        labelStyle={styles.selectLabel}
        iconStyle={styles.selectIcon}
        onChange={this.props.onSelect}
        value={this.props.selected || 'InspectorMonitor'}
      >
        {sideMonitors.map((item, i) =>
          <MenuItem key={i} value={item.key} primaryText={item.title} />
        )}
      </SelectField>
    );
  }
}
