import React, { Component, PropTypes } from 'react';
import { Button, Toolbar, Divider, Spacer } from 'remotedev-ui';
import SettingsIcon from 'react-icons/lib/go/gear';
import SaveIcon from 'react-icons/lib/md/save';
import ExportButton from './buttons/ExportButton';
import ImportButton from './buttons/ImportButton';
import PrintButton from './buttons/PrintButton';
import DispatcherButton from './buttons/DispatcherButton';
import SliderButton from './buttons/SliderButton';
import Settings from './Settings';
import MonitorSelector from './MonitorSelector';

export default class ButtonBar extends Component {
  static propTypes = {
    dispatcherIsOpen: PropTypes.bool,
    sliderIsOpen: PropTypes.bool
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
      <Toolbar>
        <Button
          title="Save a report"
          tooltipPosition="top-right"
          onClick={this.openHelp}
        >
          <SaveIcon />
        </Button>
        <ExportButton />
        <ImportButton />
        <PrintButton />
        <Divider />
        <Spacer />
        <MonitorSelector />
        <Spacer />
        <Divider />
        <SliderButton isOpen={this.props.sliderIsOpen}/>
        <DispatcherButton dispatcherIsOpen={this.props.dispatcherIsOpen} />
        <Button
          title="Settings"
          tooltipPosition="top-left"
          onClick={this.openSettings}
        >
          <SettingsIcon />
        </Button>
        <Settings isOpen={this.state.settingsOpened} close={this.closeSettings} />
      </Toolbar>
    );
  }
}
