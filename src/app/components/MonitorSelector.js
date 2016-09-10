import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { sideMonitors } from '../containers/DevTools';
import { selectMonitor } from '../actions';
import styles from '../styles';

class MonitorSelector extends Component {
  static propTypes = {
    selected: PropTypes.string,
    selectMonitor: PropTypes.func.isRequired
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
        onChange={this.props.selectMonitor}
        value={this.props.selected || 'InspectorMonitor'}
      >
        {sideMonitors.map((item, i) =>
          <MenuItem key={i} value={item.key} primaryText={item.title} />
        )}
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
