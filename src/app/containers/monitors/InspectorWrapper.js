import React, { Component, PropTypes } from 'react';
import InspectorMonitor from 'redux-devtools-inspector';
import TestGenerator from '../../components/TestGenerator';

class InspectorWrapper extends Component {
  static update = InspectorMonitor.update;

  render() {
    const { lib, ...rest } = this.props;
    let tabs;
    if (lib === 'redux') {
      tabs = defaultTabs => [...defaultTabs, { name: 'Test', component: TestGenerator }];
    }
    return (
      <InspectorMonitor
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

