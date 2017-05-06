import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SliderMonitor from 'remotedev-slider/lib/Slider';
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

class App extends Component {
  render() {
    const {
      monitor,
      monitorState,
      dispatcherIsOpen,
      sliderIsOpen,
      options,
      liftedState,
      selected,
      shouldSync,
      reports,
      noSettings
    } = this.props;

    return (
      <div style={styles.container}>
        <div style={styles.buttonBar}>
          <MonitorSelector selected={monitor}/>
          <Instances selected={selected} />
          <SyncToggle
            on={shouldSync}
            style={!selected ? { display: 'none' } : undefined}
          />
        </div>
        <DevTools
          monitor={monitor}
          liftedState={liftedState}
          monitorState={monitorState}
          dispatch={this.props.liftedDispatch}
          lib={options.lib}
        />
        <Notification />
        {sliderIsOpen && options.connectionId &&
          <SliderMonitor
            monitor="SliderMonitor"
            liftedState={liftedState}
            dispatch={liftedDispatch}
            getReport={this.props.getReport}
            reports={reports}
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
          noSettings={noSettings}
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
  monitorState: PropTypes.object,
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
    monitorState: state.monitor.monitorState,
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
