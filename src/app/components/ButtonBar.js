import React, { Component, PropTypes } from 'react';
import SettingsIcon from 'react-icons/lib/md/settings';
import HelpIcon from 'react-icons/lib/fa/lightbulb-o';
import Button from './Button';
import DispatcherButton from './buttons/DispatcherButton';
import ImportButton from './buttons/ImportButton';
import ExportButton from './buttons/ExportButton';
import SliderButton from './buttons/SliderButton';
import LockButton from './buttons/LockButton';
import RecordButton from './buttons/RecordButton';
import PrintButton from './buttons/PrintButton';
import styles from '../styles';
import Settings from './Settings';

export default class ButtonBar extends Component {
  static propTypes = {
    liftedState: PropTypes.object.isRequired,
    dispatcherIsOpen: PropTypes.bool,
    sliderIsOpen: PropTypes.bool,
    noSettings: PropTypes.bool,
    lib: PropTypes.string
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
      || nextProps.lib !== this.props.lib
      || nextProps.liftedState.isLocked !== this.props.liftedState.isLocked
      || nextProps.liftedState.isPaused !== this.props.liftedState.isPaused;
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
    const {
      lib,
      dispatcherIsOpen,
      sliderIsOpen,
      noSettings,
      liftedState
    } = this.props;

    const isRedux = lib === 'redux';
    return (
      <div style={styles.buttonBar}>
        {isRedux &&
          <RecordButton paused={liftedState.isPaused} />
        }
        {isRedux &&
          <LockButton locked={liftedState.isLocked} />
        }
        <DispatcherButton dispatcherIsOpen={dispatcherIsOpen} />
        <SliderButton isOpen={sliderIsOpen}/>
        <ImportButton />
        <ExportButton />
        <PrintButton />
        {!noSettings &&
          <Button Icon={SettingsIcon} onClick={this.openSettings}>Settings</Button>
        }
        <Button Icon={HelpIcon} onClick={this.openHelp}>How to use</Button>
        {!noSettings &&
          <Settings isOpen={this.state.settingsOpened} close={this.closeSettings} />
        }
      </div>
    );
  }
}
