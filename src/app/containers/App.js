import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SliderMonitor from 'remotedev-slider';
import { liftedDispatch, getReport } from '../actions';
import { getActiveInstance } from '../reducers/instances';
import styles from '../styles';
import DevTools from '../containers/DevTools';
import Dispatcher from './monitors/Dispatcher';
import ButtonBar from '../components/ButtonBar';
import Notification from '../components/Notification';
import Instances from '../components/Instances';
import MonitorSelector from '../components/MonitorSelector';
import SyncToggle from '../components/SyncToggle';
import TestGenerator from '../components/TestGenerator';

class App extends Component {
  render() {
    const { monitor, dispatcherIsOpen, sliderIsOpen, options, liftedState } = this.props;
    return (
      <div style={styles.container}>
        <div style={styles.buttonBar}>
          <MonitorSelector selected={monitor}/>
          <Instances selected={this.props.selected} />
          <SyncToggle
            on={this.props.shouldSync}
            style={!this.props.selected ? { display: 'none' } : undefined}
          />
        </div>
        <DevTools
          monitor={monitor}
          liftedState={liftedState}
          dispatch={this.props.liftedDispatch}
          testComponent={options.lib === 'redux' && TestGenerator}
        />
        <Notification />
        {sliderIsOpen && options.connectionId &&
          <SliderMonitor
            monitor="SliderMonitor"
            liftedState={liftedState}
            dispatch={this.props.liftedDispatch}
            getReport={this.props.getReport}
            reports={this.props.reports}
            showActions={monitor === 'ChartMonitor'}
            style={{ padding: '15px 5px' }}
            fillColor="rgb(120, 144, 156)"
          />
        }
        {dispatcherIsOpen && options.connectionId &&
          <Dispatcher options={options} />
        }
        <ButtonBar
          liftedState={liftedState}
          dispatcherIsOpen={dispatcherIsOpen}
          sliderIsOpen={sliderIsOpen}
          lib={options.lib}
          noSettings={this.props.noSettings}
        />
      </div>
    );
  }
}

App.propTypes = {
  liftedDispatch: PropTypes.func.isRequired,
  getReport: PropTypes.func.isRequired,
  selected: PropTypes.string,
  liftedState: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  monitor: PropTypes.string,
  dispatcherIsOpen: PropTypes.bool,
  sliderIsOpen: PropTypes.bool,
  reports: PropTypes.array.isRequired,
  shouldSync: PropTypes.bool,
  noSettings: PropTypes.bool
};

function mapStateToProps(state) {
  const instances = state.instances;
  const id = getActiveInstance(instances);
  return {
    selected: instances.selected,
    liftedState: instances.states[id],
    options: instances.options[id],
    monitor: state.monitor.selected,
    dispatcherIsOpen: state.monitor.dispatcherIsOpen,
    sliderIsOpen: state.monitor.sliderIsOpen,
    reports: state.reports.data,
    shouldSync: state.instances.sync
  };
}

function mapDispatchToProps(dispatch) {
  return {
    liftedDispatch: bindActionCreators(liftedDispatch, dispatch),
    getReport: bindActionCreators(getReport, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
