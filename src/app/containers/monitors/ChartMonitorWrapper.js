import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ChartMonitor from 'redux-devtools-chart-monitor';
import { selectMonitorWithState } from '../../actions';

export const tooltipOptions = {
  style: {
    'background-color': '#ffffff',
    'color': '#000000',
    'opacity': '0.9',
    'border-radius': '5px',
    'padding': '5px'
  }
};

export function getPath(obj, inspectedStatePath) {
  const parent = obj.parent;
  if (!parent) return;
  getPath(parent, inspectedStatePath);
  let name = obj.name;
  const item = name.match(/.+\[(\d+)]/);
  if (item) name = item[1];
  inspectedStatePath.push(name);
}

class ChartMonitorWrapper extends Component {
  static update = ChartMonitor.update;

  onClickText = (data) => {
    const inspectedStatePath = [];
    getPath(data, inspectedStatePath);
    this.props.selectMonitorWithState('InspectorMonitor', {
      inspectedStatePath,
      tabName: 'State',
      selectedActionId: null,
      startActionId: null,
      inspectedActionPath: []
    });
  };

  render() {
    return (
      <ChartMonitor
        defaultIsVisible invertTheme
        tooltipOptions={tooltipOptions}
        onClickText={this.onClickText}
        {...this.props}
      />
    );
  }
}

ChartMonitorWrapper.propTypes = {
  selectMonitorWithState: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    selectMonitorWithState: bindActionCreators(selectMonitorWithState, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(ChartMonitorWrapper);
