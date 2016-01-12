import React, { Component, PropTypes } from 'react';

const styles = {
  main: {
    border: '1px solid #ccc',
    width: '50px',
    height: '26px',
    borderRadius: '13px',
    cursor: 'pointer',
    display: 'inline-block',
    float: 'left'
  },
  toggle: {
    border: '1px solid #999',
    boxShadow: '1px 1px 1px #ccc',
    width: '25px',
    height: '24px',
    left: '0',
    borderRadius: '12px',
    background: 'white',
    position: 'relative',
    transition: 'left .2s ease-in-out'
  },
  on: {
    background: 'green'
  },
  toggleOn: {
    left: '23px'
  },
  label: {
    paddingTop: '5px',
    paddingLeft: '65px',
    paddingRight: '30px'
  }
};

export default class Switch extends Component {
  static propTypes = {
    on: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.any
  };

  render() {
    return (
      <div>
        <div style={this.props.on ? { ...styles.main, ...styles.on } : styles.main}
          onClick={this.props.onClick}
        >
          <div style={this.props.on ? { ...styles.toggle, ...styles.toggleOn } : styles.toggle }></div>
        </div>
        <div style={styles.label}>{this.props.children}</div>
      </div>
    );
  }
}
