import React, { Component, PropTypes, createElement } from 'react';
import LogMonitor from 'redux-devtools-log-monitor';
import InspectorMonitor from 'redux-devtools-inspector';
import ChartMonitorWrapper from '../containers/monitors/ChartMonitorWrapper';

export const monitors = [
  { key: 'LogMonitor', title: 'Log monitor' },
  { key: 'InspectorMonitor', title: 'Inspector' },
  { key: 'ChartMonitor', title: 'Chart' }
];

export default function getMonitor({ monitor, testComponent }) {
  switch (monitor) {
    case 'LogMonitor':
      return <LogMonitor preserveScrollTop={false} markStateDiff />;
    case 'ChartMonitor':
      return <ChartMonitorWrapper />;
    default:
      let tabs;
      if (testComponent) {
        tabs = defaultTabs => [...defaultTabs, { name: 'Test', component: testComponent }];
      }
      return createElement(InspectorMonitor, {
        shouldPersistState: false, invertTheme: false, theme: 'nicinabox', tabs
      });
  }
}
