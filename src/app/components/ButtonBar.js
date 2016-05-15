import React, { Component, PropTypes } from 'react';
import SettingsIcon from 'react-icons/lib/md/settings';
import HelpIcon from 'react-icons/lib/fa/lightbulb-o';
import Button from './Button';
import DispatcherButton from './buttons/DispatcherButton';
import ImportButton from './buttons/ImportButton';
import ExportButton from './buttons/ExportButton';
import SliderButton from './buttons/SliderButton';
import styles from '../styles';
import Settings from './Settings';

export default class ButtonBar extends Component {
  static propTypes = {
    openModal: PropTypes.func.isRequired,
    toggleDispatcher: PropTypes.func.isRequired,
    toggleSlider: PropTypes.func.isRequired,
    dispatcherIsOpen: PropTypes.bool,
    sliderIsOpen: PropTypes.bool,
    closeModal: PropTypes.func.isRequired,
    saveSettings: PropTypes.func.isRequired,
    importState: PropTypes.func.isRequired,
    exportState: PropTypes.func.isRequired,
    socketOptions: PropTypes.object
  };

  constructor() {
    super();
    this.state = { settingsOpened: false };

    this.openSettings = this.openSettings.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.dispatcherIsOpen !== this.props.dispatcherIsOpen
      || nextProps.sliderIsOpen !== this.props.sliderIsOpen
      || nextState.settingsOpened !== this.state.settingsOpened;
  }

  openHelp() {
    window.open('https://github.com/zalmoxisus/remote-redux-devtools');
  }

  openSettings() {
    this.setState({ settingsOpened: true });
  }

  closeSettings() {
    this.setState({ settingsOpened: false });
  }

  render() {
    return (
      <div style={styles.buttonBar}>
        <DispatcherButton
          dispatcherIsOpen={this.props.dispatcherIsOpen} onClick={this.props.toggleDispatcher}
        />
        <SliderButton isOpen={this.props.sliderIsOpen} onClick={this.props.toggleSlider} />
        <ImportButton importState={this.props.importState} />
        <ExportButton exportState={this.props.exportState} />
        <Button Icon={SettingsIcon} onClick={this.openSettings}>Settings</Button>
        <Button Icon={HelpIcon} onClick={this.openHelp}>How to use</Button>
        <Settings
          isOpen={this.state.settingsOpened}
          close={this.closeSettings}
          saveSettings={this.props.saveSettings}
          socketOptions={this.props.socketOptions}
        />
      </div>
    );
  }
}
