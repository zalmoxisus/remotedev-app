import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs } from 'remotedev-monitor-components';
import StateTree from 'redux-devtools-inspector/lib/tabs/StateTab';
import ActionTree from 'redux-devtools-inspector/lib/tabs/ActionTab';
import { selectMonitorTab } from '../../../actions';

class SubTabs extends Component {
  constructor(props) {
    super(props);
    this.updateTabs(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.parentTab !== this.props.parentTab) {
      this.updateTabs(nextProps);
    }
  }

  updateTabs(props) {
    this.tabs = [
      {
        name: 'Tree',
        component: props.parentTab === 'Action' ? ActionTree : StateTree,
        selector: () => props
      },
      {
        name: 'JSON',
        component: StateTree,
        selector: () => props
      }
    ];
  }

  render() {
    return (
      <Tabs
        tabs={this.tabs}
        selected={this.props.selected}
        onClick={this.props.selectMonitorTab}
      />
    );
  }
}

SubTabs.propTypes = {
  selected: PropTypes.string,
  parentTab: PropTypes.string,
  selectMonitorTab: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    parentTab: state.monitor.monitorState.tabName,
    selected: state.monitor.monitorState.subTabName
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectMonitorTab: bindActionCreators(selectMonitorTab, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SubTabs);
