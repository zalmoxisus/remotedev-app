import React from 'react';
import SettingsIcon from 'react-icons/lib/md/settings';
import Button from './Button';
import styles from '../styles';
import Settings from './Settings';

export default ({ openModal, closeModal, saveSettings, socketOptions }) => (
  <div style={styles.buttonBar}>
    <Button
      Icon={SettingsIcon}
      onClick={() => openModal(
        <Settings closeModal={closeModal}
          saveSettings={saveSettings} socketOptions={socketOptions}
        />
      )}
    >Settings</Button>
  </div>
);
