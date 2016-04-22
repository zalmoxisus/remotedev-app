import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import styles from '../styles';

export default class Instances extends Component {
  static propTypes = {
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
