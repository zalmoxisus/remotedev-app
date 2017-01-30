import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container } from 'remotedev-ui';
import SliderMonitor from 'remotedev-slider/lib/Slider';
import { liftedDispatch as liftedDispatchAction, getReport } from '../actions';
import { getActiveInstance } from '../reducers/instances';
import styles from '../styles';
import DevTools from '../containers/DevTools';
import Dispatcher from './monitors/Dispatcher';
import TopButtons from '../components/TopButtons';
import BottomButtons from '../components/BottomButtons';
import Notification from '../components/Notification';

class App extends Component {
  render() {
    const {
      monitor, dispatcherIsOpen, sliderIsOpen, options, liftedState, liftedDispatch
    } = this.props;
    return (
      <Container themeData={{ theme: 'default', scheme: 'default', light: true }} style={styles.container}>
        <TopButtons
          dispatch={liftedDispatch}
          liftedState={liftedState}
          lib={options.lib}
        />
        <DevTools
          monitor={monitor}
          liftedState={liftedState}
          monitorState={this.props.monitorState}
          dispatch={liftedDispatch}
          lib={options.lib}
        />
        <Notification />
        {sliderIsOpen && options.connectionId &&
          <SliderMonitor
            monitor="SliderMonitor"
            liftedState={liftedState}
            dispatch={liftedDispatch}
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
        <BottomButtons
          dispatcherIsOpen={dispatcherIsOpen}
          sliderIsOpen={sliderIsOpen}
        />
      </Container>
    );
  }
}

App.propTypes = {
  liftedDispatch: PropTypes.func.isRequired,
  getReport: PropTypes.func.isRequired,
  liftedState: PropTypes.object.isRequired,
  monitorState: PropTypes.object,
  options: PropTypes.object.isRequired,
  monitor: PropTypes.string,
  dispatcherIsOpen: PropTypes.bool,
  sliderIsOpen: PropTypes.bool,
  reports: PropTypes.array.isRequired
};

function mapStateToProps(state) {
  const instances = state.instances;
  const id = getActiveInstance(instances);
  return {
    liftedState: instances.states[id],
    monitorState: state.monitor.monitorState,
    options: instances.options[id],
    monitor: state.monitor.selected,
    dispatcherIsOpen: state.monitor.dispatcherIsOpen,
    sliderIsOpen: state.monitor.sliderIsOpen,
    reports: state.reports.data
  };
}

function mapDispatchToProps(dispatch) {
  return {
    liftedDispatch: bindActionCreators(liftedDispatchAction, dispatch),
    getReport: bindActionCreators(getReport, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
