import React, { Component, PropTypes, createElement } from 'react';
import { connect } from 'react-redux';
import LogMonitor from 'redux-devtools-log-monitor';
import SliderMonitor from 'redux-slider-monitor';
import InspectorMonitor from 'redux-devtools-inspector';
import ChartMonitor from 'redux-devtools-chart-monitor';

export const sideMonitors = [
  { key: 'LogMonitor', title: 'Log monitor' },
  { key: 'InspectorMonitor', title: 'Inspector' },
  { key: 'ChartMonitor', title: 'Chart' }
];

function getMonitor(type, props) {
  switch (type) {
    case 'LogMonitor':
      return createElement(LogMonitor, { preserveScrollTop: false });
    case 'SliderMonitor':
      return createElement(SliderMonitor);
    case 'DispatchMonitor':
      return createElement('div'); // deprecated
    case 'ChartMonitor':
      return createElement(ChartMonitor, {
        defaultIsVisible: true, invertTheme: true,
        tooltipOptions: {
          style: {
            'background-color': '#ffffff',
            'color': '#000000',
            'opacity': '0.9',
            'border-radius': '5px',
            'padding': '5px'
          }
        }
      });
    default:
      return createElement(InspectorMonitor, {
        shouldPersistState: false, isLightTheme: false, theme: 'nicinabox',
        tabs: defaultTabs => [...defaultTabs, { name: 'Test', component: props.testComponent }]
      });
  }
}

export default class extends Component {
  static propTypes = {
    liftedState: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    monitor: PropTypes.string
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.monitor !== this.props.monitor ||
      nextProps.liftedState !== this.props.liftedState;
  }

  liftedStore = {
    getState: () => this.props.liftedState,
    dispatch: this.props.dispatch,
    subscribe: () => {}
  };

  render() {
    const { monitor, liftedState, ...rest } = this.props;
    const monitorElement = getMonitor(monitor, rest);
    const monitorProps = monitorElement.props;
    const Monitor = monitorElement.type;
    const ConnectedMonitor = connect(state => state)(Monitor);
    return <ConnectedMonitor {...rest} {...monitorProps} store={this.liftedStore} />;
  }
}
