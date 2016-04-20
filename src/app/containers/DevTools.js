import React, { Component, PropTypes, createElement } from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import SliderMonitor from 'redux-slider-monitor';
import InspectorMonitor from 'redux-devtools-inspector';
import DiffMonitor from 'redux-devtools-diff-monitor';
import DispatchMonitor from 'redux-devtools-dispatch';
import ChartMonitor from 'redux-devtools-chart-monitor';

export const sideMonitors = [
  { key: 'LogMonitor', title: 'Log monitor' },
  { key: 'InspectorMonitor', title: 'Inspector' },
  { key: 'DiffMonitor', title: 'Diff' },
  { key: 'ChartMonitor', title: 'Chart' }
];

function getMonitor(type, props) {
  switch (type) {
    case 'SliderMonitor':
      return createElement(SliderMonitor);
    case 'InspectorMonitor':
      return createElement(InspectorMonitor);
    case 'DiffMonitor':
      return createElement(DiffMonitor);
    case 'DispatchMonitor':
      return createElement(DispatchMonitor, { dispatchFn: props.dispatchFn });
    case 'ChartMonitor':
      return createElement(ChartMonitor, {
        defaultIsVisible: true, invertTheme: true,
        tooltipOptions: {
          style: {
            'background-color': '#ffffff',
            'opacity': '0.9',
            'border-radius': '5px',
            'padding': '5px'
          }
        }
      });
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
