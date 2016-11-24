import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs } from 'remotedev-monitor-components';
import StateTree from 'redux-devtools-inspector/lib/tabs/StateTab';
import ActionTree from 'redux-devtools-inspector/lib/tabs/ActionTab';
import DiffTree from 'redux-devtools-inspector/lib/tabs/DiffTab';
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

  selector = () => {
    switch (this.props.parentTab) {
      case 'Action':
        return { data: this.props.action };
      case 'Diff':
        return { data: this.props.delta };
      default:
        return { data: this.props.nextState };
    }
  };

  updateTabs(props) {
    let component;
    switch (props.parentTab) {
      case 'Action':
        component = ActionTree;
        break;
      case 'Diff':
        component = DiffTree;
        break;
      default:
        component = StateTree;
    }

    this.tabs = [
      {
        name: 'Tree',
        component,
        selector: () => this.props
      },
      {
        name: 'JSON',
        component: JSONTab,
        selector: this.selector
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
  delta: PropTypes.object,
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
