import React from 'react';
import SettingsIcon from 'react-icons/lib/md/settings';
import Button from './Button';
import styles from '../styles';

export default () => (
  <div style={styles.buttonBar}>
    <Button Icon={SettingsIcon}>Settings</Button>
  </div>
);
