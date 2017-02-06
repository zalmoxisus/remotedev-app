import React, { Component, PropTypes } from 'react';
import LogMonitor from 'redux-devtools-log-monitor';
import ChartMonitorWrapper from '../containers/monitors/ChartMonitorWrapper';
import InspectorWrapper from '../containers/monitors/InspectorWrapper';

export const monitors = [
  { value: 'InspectorMonitor', name: 'Inspector' },
  { value: 'LogMonitor', name: 'Log monitor' },
  { value: 'ChartMonitor', name: 'Chart' }
];

export default function getMonitor({ monitor, options }) {
  switch (monitor) {
    case 'LogMonitor':
      return <LogMonitor preserveScrollTop={false} hideMainButtons markStateDiff />;
    case 'ChartMonitor':
      return <ChartMonitorWrapper />;
    default:
      return <InspectorWrapper options={options} />;
  }
}
