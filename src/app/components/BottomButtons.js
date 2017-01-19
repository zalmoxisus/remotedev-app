import React, { Component, PropTypes } from 'react';
import SettingsIcon from 'react-icons/lib/go/gear';
import HelpIcon from 'react-icons/lib/go/question';
import { Button, Toolbar, Divider, Spacer } from 'remotedev-ui';
import DispatcherButton from './buttons/DispatcherButton';
import ImportButton from './buttons/ImportButton';
import ExportButton from './buttons/ExportButton';
import SliderButton from './buttons/SliderButton';
import LockButton from './buttons/LockButton';
import RecordButton from './buttons/RecordButton';
import PrintButton from './buttons/PrintButton';
import Settings from './Settings';
import MonitorSelector from './MonitorSelector';

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
    const isRedux = this.props.lib === 'redux';
    return (
      <Toolbar>
        {isRedux &&
          <RecordButton paused={this.props.liftedState.isPaused} />
        }
        {isRedux &&
          <LockButton locked={this.props.liftedState.isLocked} />
        }
        <ImportButton />
        <ExportButton />
        <PrintButton />
        <Button title="How to use" toolbar onClick={this.openHelp}><HelpIcon /></Button>
        <Divider />
        <Spacer />
        <DispatcherButton dispatcherIsOpen={this.props.dispatcherIsOpen} />
        <SliderButton isOpen={this.props.sliderIsOpen}/>
        <MonitorSelector />
        {!this.props.noSettings &&
          <Button title="Settings" toolbar onClick={this.openSettings}><SettingsIcon /></Button>
        }
        {!this.props.noSettings &&
          <Settings isOpen={this.state.settingsOpened} close={this.closeSettings} />
        }
      </Toolbar>
    );
  }
}
