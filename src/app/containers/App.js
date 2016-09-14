import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { liftedDispatch } from '../actions';
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
  static propTypes = {
    liftedDispatch: PropTypes.func.isRequired,
    selected: PropTypes.string,
    liftedState: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    monitor: PropTypes.string,
    dispatcherIsOpen: PropTypes.bool,
    sliderIsOpen: PropTypes.bool,
    shouldSync: PropTypes.bool,
    noSettings: PropTypes.bool
  };

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
        {sliderIsOpen && <div style={styles.sliderMonitor}>
          <DevTools
            monitor="SliderMonitor"
            liftedState={liftedState}
            dispatch={this.props.liftedDispatch}
          />
        </div>}
        {dispatcherIsOpen && options.connectionId &&
          <Dispatcher options={options} />
        }
        <ButtonBar
          liftedState={liftedState}
          dispatcherIsOpen={dispatcherIsOpen}
          sliderIsOpen={sliderIsOpen}
          noSettings={this.props.noSettings}
        />
      </div>
    );
  }
}

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
    shouldSync: state.instances.sync
  };
}

function mapDispatchToProps(dispatch) {
  return { liftedDispatch: bindActionCreators(liftedDispatch, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
