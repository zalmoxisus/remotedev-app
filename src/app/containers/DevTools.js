import React, { Component, PropTypes, createElement } from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import SliderMonitor from 'redux-slider-monitor';
import InspectorMonitor from 'redux-devtools-inspector';
import DispatchMonitor from 'redux-devtools-dispatch';

export const sideMonitors = [
  { key: 'LogMonitor', title: 'Log monitor' },
  { key: 'InspectorMonitor', title: 'Inspector' }
];

function getMonitor(type, props) {
  switch (type) {
    case 'SliderMonitor':
      return createElement(SliderMonitor);
    case 'InspectorMonitor':
      return createElement(InspectorMonitor);
    case 'DispatchMonitor':
      return createElement(DispatchMonitor, { dispatchFn: props.dispatchFn });
    default:
      return createElement(LogMonitor, { preserveScrollTop: false });
  }
}

export default class extends Component {
  static propTypes = {
    monitor: PropTypes.string
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.monitor !== this.props.monitor;
  }

  render() {
    const { monitor, ...rest } = this.props;
    const DevTools = createDevTools(getMonitor(monitor, rest));
    return <DevTools {...rest} />;
  }
}
