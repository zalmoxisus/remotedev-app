import React, { Component, PropTypes } from 'react';
import InspectorMonitor from 'redux-devtools-inspector';
import { DATA_TYPE_KEY } from '../../../constants/dataTypes';
import SubTabs from './SubTabs';
import TestTab from './TestTab';

const DEFAULT_TABS = [{
  name: 'Action',
  component: SubTabs
}, {
  name: 'State',
  component: SubTabs
}, {
  name: 'Diff',
  component: SubTabs
}];

class InspectorWrapper extends Component {
  static update = InspectorMonitor.update;

  render() {
    const { lib, ...rest } = this.props;
    let tabs;
    if (lib === 'redux') {
      tabs = () => [...DEFAULT_TABS, { name: 'Test', component: TestTab }];
    } else {
      tabs = () => DEFAULT_TABS;
    }

    return (
      <InspectorMonitor
        dataTypeKey={DATA_TYPE_KEY}
        shouldPersistState={false}
        invertTheme={false}
        theme="nicinabox"
        tabs={tabs}
        {...rest}
      />
    );
  }
}

InspectorWrapper.propTypes = {
  lib: PropTypes.string
};

export default InspectorWrapper;
