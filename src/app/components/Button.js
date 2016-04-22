// Based on https://github.com/gaearon/redux-devtools-log-monitor/blob/master/src/LogMonitorButton.js

import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import * as themes from 'redux-devtools-themes';
import brighten from 'redux-devtools-log-monitor/lib/brighten';
import styles from '../styles';

export default class Button extends React.Component {
  static propTypes = {
    enabled: PropTypes.bool,
    href: PropTypes.string,
    download: PropTypes.string,
    onClick: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseUp: PropTypes.func,
    Icon: PropTypes.func.isRequired,
    children: PropTypes.node,
    theme: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string
    ]).isRequired
  };

  static defaultProps = {
    theme: themes.nicinabox,
    enabled: true
  };

  constructor(props) {
    super(props);

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);

    this.state = {
      hovered: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  onClick() {
    if (!this.props.enabled) {
      return;
    }
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  handleMouseEnter() {
    this.setState({ hovered: true });
  }

  handleMouseLeave() {
    this.setState({ hovered: false });
  }

  render() {
    const { theme, enabled, href, download, Icon, children, onMouseDown, onMouseUp } = this.props;
    let style = {
      ...styles.button,
      backgroundColor: theme.base02
    };
    if (enabled && this.state.hovered) {
      style = {
        ...style,
        backgroundColor: brighten(theme.base02, 0.2)
      };
    }
    if (!enabled) {
      style = {
        ...style,
        opacity: 0.2,
        cursor: 'text',
        backgroundColor: 'transparent'
      };
    }
    return (
      <a onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={this.onClick}
        href={href}
        download={download}
        style={style}
      >
        <Icon />
        <span style={styles.buttonText}>{children}</span>
      </a>
    );
  }
}

