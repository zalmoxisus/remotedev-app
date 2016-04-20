import React, { Component, PropTypes } from 'react';
import SettingsIcon from 'react-icons/lib/md/settings';
import HelpIcon from 'react-icons/lib/fa/lightbulb-o';
import Button from './Button';
import styles from '../styles';
import Settings from './Settings';

export default class ButtonBar extends Component {
  static propTypes = {
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    saveSettings: PropTypes.func.isRequired,
    socketOptions: PropTypes.func.object
  };

  constructor() {
    super();
    this.openSettings = this.openSettings.bind(this);
  }

  openHelp() {
    window.open('https://github.com/zalmoxisus/remote-redux-devtools');
  }

  openSettings() {
    this.props.openModal(
      <Settings
        closeModal={this.props.closeModal}
        saveSettings={this.props.saveSettings}
        socketOptions={this.props.socketOptions}
      />
    );
  }

  render() {
    return (
      <div style={styles.buttonBar}>
        <Button Icon={SettingsIcon} onClick={this.openSettings}>Settings</Button>
        <Button Icon={HelpIcon} onClick={this.openHelp}>How to use</Button>
      </div>
    );
  }
}
