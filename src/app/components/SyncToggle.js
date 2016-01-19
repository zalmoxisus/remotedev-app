import React from 'react';
import PinIcon from 'react-icons/lib/ti/pin';
import GoIcon from 'react-icons/lib/go/sync';
import Switch from 'react-switcher';
import styles from '../styles';

export default ({ on, onClick, style }) => (
  <div style={style ? style : styles.syncToggle}>
    <Switch
      on={on}
      onClick={onClick}
      offIcon={<PinIcon/>}
      onIcon={<GoIcon/>}
    />
  </div>
);
