import React, { Component, PropTypes } from 'react';
import SettingsIcon from 'react-icons/lib/md/settings';
import Button from './Button';
import styles from '../styles';
import Settings from './Settings';

export default class Instances extends Component {
  static propTypes = {
    instances: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.initialSelect = [['Autoselect instances', 'auto']];
  }

  componentWillReceiveProps(nextProps) {
    this.select = [...this.initialSelect];
    Object.keys(nextProps.instances).forEach(key => {
      this.select.push([nextProps.instances[key], key]);
    });
  }

  render() {
    return (
      <select style={styles.instances}>
        {
          (this.select || this.initialSelect).map(
            option => <option key={option[1]} value={option[1]}>{option[0]}</option>
          )
        }
      </select>
    );
  }
};
