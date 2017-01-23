import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container } from 'remotedev-ui';
import SliderMonitor from 'remotedev-slider/lib/Slider';
import { liftedDispatch, getReport } from '../actions';
import { getActiveInstance } from '../reducers/instances';
import styles from '../styles';
import DevTools from '../containers/DevTools';
import Dispatcher from './monitors/Dispatcher';
import TopButtons from '../components/TopButtons';
import BottomButtons from '../components/BottomButtons';
import Notification from '../components/Notification';

class App extends Component {
  render() {
    const { monitor, dispatcherIsOpen, sliderIsOpen, options, liftedState } = this.props;
    return (
      <Container themeData={{ theme: 'default', scheme: 'default', light: true }} style={styles.container}>
        <TopButtons
          liftedState={liftedState}
          lib={options.lib}
        />
        <DevTools
          monitor={monitor}
          liftedState={liftedState}
          monitorState={this.props.monitorState}
          dispatch={this.props.liftedDispatch}
          lib={options.lib}
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
        <BottomButtons
          dispatcherIsOpen={dispatcherIsOpen}
          sliderIsOpen={sliderIsOpen}
          noSettings={this.props.noSettings}
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
  reports: PropTypes.array.isRequired,
  noSettings: PropTypes.bool
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
    liftedDispatch: bindActionCreators(liftedDispatch, dispatch),
    getReport: bindActionCreators(getReport, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
