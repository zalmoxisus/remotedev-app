import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs } from 'remotedev-monitor-components';
import StateTree from 'redux-devtools-inspector/lib/tabs/StateTab';
import ActionTree from 'redux-devtools-inspector/lib/tabs/ActionTab';
import { selectMonitorTab } from '../../../actions';
import JSONTab from './JSONTab';

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
    const isAction = props.parentTab === 'Action';
    this.tabs = [
      {
        name: 'Tree',
        component: isAction ? ActionTree : StateTree,
        selector: () => this.props
      },
      {
        name: 'JSON',
        component: JSONTab,
        selector: () => ({ data: isAction ? this.props.action : this.props.nextState })
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
  selectMonitorTab: PropTypes.func.isRequired,
  action: PropTypes.object,
  nextState: PropTypes.object
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
