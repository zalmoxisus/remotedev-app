import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { tree } from 'd3-state-visualizer';
import { tooltipOptions, getPath } from '../ChartMonitorWrapper';
import { updateMonitorState } from '../../../actions';

const style = {
  width: '100%',
  height: '100%'
};

const defaultOptions = {
  heightBetweenNodesCoeff: 1,
  widthBetweenNodesCoeff: 1.3,
  tooltipOptions: {
    ...tooltipOptions,
    offset: { left: 30, top: 10 },
    indentationSize: 2
  },
  style: {
    width: '100%',
    height: '100%',
    node: {
      colors: {
        'default': '#A1C659',
        collapsed: '#A1C659',
        parent: '#D381C3'
      },
      radius: 7
    },
    text: {
      colors: {
        'default': '#6FB3D2',
        hover: '#FFFFFF'
      }
    }
  }
};

class ChartTab extends Component {
  componentDidMount() {
    this.renderChart = tree(
      this.node,
      { ...defaultOptions, onClickText: this.onClickText }
    );
    this.renderChart(this.props.data);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.renderChart(nextProps.data);
    }
  }

  getRef = node => {
    this.node = node;
  };

  onClickText = (data) => {
    const inspectedStatePath = [];
    getPath(data, inspectedStatePath);
    this.props.updateMonitorState({
      inspectedStatePath,
      subTabName: 'Raw'
    });
  };

  render() {
    return <div style={style} ref={this.getRef} />;
  }
}

ChartTab.propTypes = {
  data: PropTypes.object,
  updateMonitorState: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    updateMonitorState: bindActionCreators(updateMonitorState, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(ChartTab);
