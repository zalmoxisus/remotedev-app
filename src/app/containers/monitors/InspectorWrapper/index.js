import React, { Component, PropTypes } from 'react';
import InspectorMonitor from 'remotedev-inspector-monitor';
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
    const { options, ...rest } = this.props;
    console.log(options);
    let tabs;
    if (options.lib === 'redux' && (!options.features || options.features.test !== false)) {
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
  options: PropTypes.object.isRequired
};

export default InspectorWrapper;
