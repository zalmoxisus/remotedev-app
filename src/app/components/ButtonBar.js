import React, { Component, PropTypes } from 'react';
import SettingsIcon from 'react-icons/lib/md/settings';
import HelpIcon from 'react-icons/lib/fa/lightbulb-o';
import Button from './Button';
import DispatcherButton from './buttons/DispatcherButton';
import ImportButton from './buttons/ImportButton';
import ExportButton from './buttons/ExportButton';
import styles from '../styles';
import Settings from './Settings';

export default class ButtonBar extends Component {
  static propTypes = {
    openModal: PropTypes.func.isRequired,
    toggleDispatcher: PropTypes.func.isRequired,
    dispatcherIsOpen: PropTypes.bool,
    closeModal: PropTypes.func.isRequired,
    saveSettings: PropTypes.func.isRequired,
    importState: PropTypes.func.isRequired,
    exportState: PropTypes.func.isRequired,
    socketOptions: PropTypes.object
  };

  constructor() {
    super();
    this.openSettings = this.openSettings.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.dispatcherIsOpen !== this.props.dispatcherIsOpen;
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
        <DispatcherButton
          dispatcherIsOpen={this.props.dispatcherIsOpen} onClick={this.props.toggleDispatcher}
        />
        <ImportButton importState={this.props.importState} />
        <ExportButton exportState={this.props.exportState} />
        <Button Icon={SettingsIcon} onClick={this.openSettings}>Settings</Button>
        <Button Icon={HelpIcon} onClick={this.openHelp}>How to use</Button>
      </div>
    );
  }
}
