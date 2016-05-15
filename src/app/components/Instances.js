import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import shallowCompare from 'react-addons-shallow-compare';
import styles from '../styles';

export default class Instances extends Component {
  static propTypes = {
    selected: PropTypes.string,
    instances: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.initialSelect = [['Autoselect instances', 'auto']];
  }

  shouldComponentUpdate(nextProps) {
    return shallowCompare(this, nextProps);
  }

  render() {
    this.select = [...this.initialSelect];
    Object.keys(this.props.instances).forEach(key => {
      this.select.push([this.props.instances[key], key]);
    });

    return (
      <SelectField
        style={styles.select}
        labelStyle={styles.selectLabel}
        iconStyle={styles.selectIcon}
        onChange={this.props.onSelect}
        value={this.props.selected || 'auto'}
      >
        {
          (this.select || this.initialSelect).map(
            option => <MenuItem key={option[1]} value={option[1]} primaryText={option[0]} />
          )
        }
      </SelectField>
    );
  }
}
