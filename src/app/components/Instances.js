import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import shallowCompare from 'react/lib/shallowCompare';
import { selectInstance } from '../actions';
import styles from '../styles';

class Instances extends Component {
  static propTypes = {
    selected: PropTypes.string,
    instances: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return shallowCompare(this, nextProps);
  }

  render() {
    this.select = [['Autoselect instances', null]];
    Object.keys(this.props.instances).forEach(key => {
      this.select.push([this.props.instances[key].name, key]);
    });

    return (
      <SelectField
        style={styles.select}
        labelStyle={styles.selectLabel}
        iconStyle={styles.selectIcon}
        onChange={this.props.onSelect}
        value={this.props.selected}
      >
        {
          this.select.map(
            option => <MenuItem key={option[1]} value={option[1]} primaryText={option[0]} />
          )
        }
      </SelectField>
    );
  }
}

function mapStateToProps(state) {
  return {
    instances: state.instances.options
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSelect: bindActionCreators(selectInstance, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Instances);
