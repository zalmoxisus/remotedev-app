import React, { Component, PropTypes } from 'react';
import { sideMonitors } from '../containers/DevTools';
import styles from '../styles';

export default class MonitorSelector extends Component {
  static propTypes = {
    selected: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.selected !== this.props.selected;
  }

  render() {
    return (
      <select
        style={{ ...styles.instances, ...styles.monitors }}
        onChange={this.props.onSelect}
        value={this.props.selected}
      >
        {sideMonitors.map((item, i) =>
          <option key={i} value={item.key}>{item.title}</option>
        )}
      </select>
    );
  }
}
