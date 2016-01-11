import React from 'react';
import * as themes from 'redux-devtools-themes';
import LogMonitorButton from 'redux-devtools-log-monitor/lib/LogMonitorButton';
import SettingsIcon from 'react-icons/lib/md/settings';
import styles from '../styles';

const buttonProps = {
  theme: themes.nicinabox,
  enabled: true
};

export default () => (
  <div style={styles.buttonBar}>
    <LogMonitorButton {...buttonProps}>
      <SettingsIcon style={styles.icon}/> Settings
    </LogMonitorButton>
  </div>
);
