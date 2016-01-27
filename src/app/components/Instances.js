import React, { Component, PropTypes } from 'react';
import SettingsIcon from 'react-icons/lib/md/settings';
import Button from './Button';
import styles from '../styles';
import Settings from './Settings';

export default class Instances extends Component {
  static propTypes = {
    instances: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.initialSelect = [['Autoselect instances', 'auto']];
  }

  render() {
    this.select = [...this.initialSelect];
    Object.keys(this.props.instances).forEach(key => {
      this.select.push([this.props.instances[key], key]);
    });

    return (
      <select style={styles.instances} onChange={this.props.onSelect}>
        {
          (this.select || this.initialSelect).map(
            option => <option key={option[1]} value={option[1]}>{option[0]}</option>
          )
        }
      </select>
    );
  }
}
