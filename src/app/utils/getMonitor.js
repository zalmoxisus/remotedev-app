import React, { Component, PropTypes } from 'react';
import LogMonitor from 'redux-devtools-log-monitor';
import ChartMonitorWrapper from '../containers/monitors/ChartMonitorWrapper';
import InspectorWrapper from '../containers/monitors/InspectorWrapper';

export const monitors = [
  { key: 'LogMonitor', title: 'Log monitor' },
  { key: 'InspectorMonitor', title: 'Inspector' },
  { key: 'ChartMonitor', title: 'Chart' }
];

export default function getMonitor({ monitor, lib }) {
  switch (monitor) {
    case 'LogMonitor':
      return <LogMonitor preserveScrollTop={false} markStateDiff />;
    case 'ChartMonitor':
      return <ChartMonitorWrapper />;
    default:
      return <InspectorWrapper lib={lib} />;
  }
}
