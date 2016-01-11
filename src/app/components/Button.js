import React from 'react';
import * as themes from 'redux-devtools-themes';
import LogMonitorButton from 'redux-devtools-log-monitor/lib/LogMonitorButton';
import styles from '../styles';

const buttonProps = {
  theme: themes.nicinabox,
  enabled: true
};

export default ({ Icon, children, ...rest }) => (
  <LogMonitorButton {...buttonProps} {...rest}>
    <Icon/><span style={styles.buttonText}>{children}</span>
  </LogMonitorButton>
);
