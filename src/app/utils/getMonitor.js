import React, { Component, PropTypes } from 'react';
import LogMonitor from 'redux-devtools-log-monitor';
import ChartMonitorWrapper from '../containers/monitors/ChartMonitorWrapper';
import InspectorWrapper from '../containers/monitors/InspectorWrapper';

export const monitors = [
  { value: 'InspectorMonitor', label: 'Inspector' },
  { value: 'LogMonitor', label: 'Log monitor' },
  { value: 'ChartMonitor', label: 'Chart' }
];

export default function getMonitor({ monitor, lib }) {
  switch (monitor) {
    case 'LogMonitor':
      return <LogMonitor preserveScrollTop={false} hideMainButtons markStateDiff />;
    case 'ChartMonitor':
      return <ChartMonitorWrapper />;
    default:
      return <InspectorWrapper lib={lib} />;
  }
}
