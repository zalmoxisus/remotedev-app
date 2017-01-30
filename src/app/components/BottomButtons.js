import React, { Component, PropTypes } from 'react';
import { Button, Toolbar, Divider, Spacer } from 'remotedev-ui';
import SaveIcon from 'react-icons/lib/md/save';
import ExportButton from './buttons/ExportButton';
import ImportButton from './buttons/ImportButton';
import PrintButton from './buttons/PrintButton';
import DispatcherButton from './buttons/DispatcherButton';
import SliderButton from './buttons/SliderButton';
import MonitorSelector from './MonitorSelector';

export default class ButtonBar extends Component {
  static propTypes = {
    dispatcherIsOpen: PropTypes.bool,
    sliderIsOpen: PropTypes.bool
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.dispatcherIsOpen !== this.props.dispatcherIsOpen
      || nextProps.sliderIsOpen !== this.props.sliderIsOpen;
  }

  openHelp() {
    window.open('https://github.com/zalmoxisus/remote-redux-devtools');
  }

  render() {
    return (
      <Toolbar borderPosition="top">
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
      </Toolbar>
    );
  }
}
