import React, { Component, PropTypes } from 'react';
import SettingsIcon from 'react-icons/lib/md/settings';
import HelpIcon from 'react-icons/lib/fa/lightbulb-o';
import Button from './Button';
import DispatcherButton from './buttons/DispatcherButton';
import ImportButton from './buttons/ImportButton';
import ExportButton from './buttons/ExportButton';
import SliderButton from './buttons/SliderButton';
import LockButton from './buttons/LockButton';
import styles from '../styles';
import Settings from './Settings';

export default class ButtonBar extends Component {
  static propTypes = {
    liftedState: PropTypes.object.isRequired,
    dispatcherIsOpen: PropTypes.bool,
    sliderIsOpen: PropTypes.bool,
    noSettings: PropTypes.bool
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
      || nextState.settingsOpened !== this.state.settingsOpened
      || nextProps.liftedState.isLocked !== this.props.liftedState.isLocked;
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
        <LockButton locked={this.props.liftedState.isLocked} />
        <DispatcherButton dispatcherIsOpen={this.props.dispatcherIsOpen} />
        <SliderButton isOpen={this.props.sliderIsOpen}/>
        <ImportButton />
        <ExportButton liftedState={this.props.liftedState} />
        {!this.props.noSettings &&
          <Button Icon={SettingsIcon} onClick={this.openSettings}>Settings</Button>
        }
        <Button Icon={HelpIcon} onClick={this.openHelp}>How to use</Button>
        {!this.props.noSettings &&
          <Settings isOpen={this.state.settingsOpened} close={this.closeSettings} />
        }
      </div>
    );
  }
}
