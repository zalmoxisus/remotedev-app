import React from 'react';
import SettingsIcon from 'react-icons/lib/md/settings';
import HelpIcon from 'react-icons/lib/fa/lightbulb-o';
import Button from './Button';
import styles from '../styles';
import Settings from './Settings';

export default ({ openModal, closeModal, saveSettings, socketOptions }) => (
  <div style={styles.buttonBar}>
    <Button
      Icon={HelpIcon}
      onClick={() => { window.open('https://github.com/zalmoxisus/remote-redux-devtools'); }}
    >How to use</Button>
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
