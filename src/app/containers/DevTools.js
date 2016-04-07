import React, { Component, PropTypes, createElement } from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import SliderMonitor from 'redux-slider-monitor';
import InspectorMonitor from 'redux-devtools-inspector';

export const sideMonitors = [
  { key: 'LogMonitor', title: 'Log monitor' },
  { key: 'InspectorMonitor', title: 'Inspector' }
];

function getMonitor(type) {
  switch (type) {
    case 'SliderMonitor': return createElement(SliderMonitor);
    case 'InspectorMonitor': return createElement(InspectorMonitor);
    default: return createElement(LogMonitor, { preserveScrollTop: false });
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
    const DevTools = createDevTools(getMonitor(monitor));
    return <DevTools {...rest} />;
  }
}
