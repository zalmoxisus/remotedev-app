import React, { Component, PropTypes, createElement } from 'react';
import LogMonitor from 'redux-devtools-log-monitor';
import InspectorMonitor from 'redux-devtools-inspector';
import ChartMonitor from 'redux-devtools-chart-monitor';

export const monitors = [
  { key: 'LogMonitor', title: 'Log monitor' },
  { key: 'InspectorMonitor', title: 'Inspector' },
  { key: 'ChartMonitor', title: 'Chart' }
];

export default function getMonitor({ monitor, testComponent }) {
  switch (monitor) {
    case 'LogMonitor':
      return <LogMonitor preserveScrollTop={false} markStateDiff />;
    case 'SliderMonitor':
      return <div></div>; // deprecated
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
      let tabs;
      if (testComponent) {
        tabs = defaultTabs => [...defaultTabs, { name: 'Test', component: testComponent }];
      }
      return createElement(InspectorMonitor, {
        shouldPersistState: false, invertTheme: false, theme: 'nicinabox', tabs
      });
  }
}
