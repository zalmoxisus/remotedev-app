import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LIFTED_ACTION, TOGGLE_SYNC, SELECT_MONITOR } from '../constants/actionTypes';
import {
  saveObjToStorage, getSettings, getFromStorage, saveToStorage
} from '../utils/localStorage';
import styles from '../styles';
import DevTools from '../containers/DevTools';
import Dispatcher from './monitors/Dispatcher';
import {
  createRemoteStore, updateStoreInstance, enableSync,
  startMonitoring
} from '../store/createRemoteStore';
import { addInstance, deleteInstance } from '../services/messaging';
import ButtonBar from '../components/ButtonBar';
import Instances from '../components/Instances';
import MonitorSelector from '../components/MonitorSelector';
import SyncToggle from '../components/SyncToggle';
import TestGenerator from '../components/TestGenerator';

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    selected: PropTypes.string,
    liftedState: PropTypes.object.isRequired,
    options: PropTypes.object,
    monitor: PropTypes.string,
    shouldSync: PropTypes.bool,
    selectMonitor: PropTypes.string,
    testTemplates: PropTypes.array,
    useCodemirror: PropTypes.bool,
    selectedTemplate: PropTypes.number,
    socketOptions: PropTypes.shape({
      hostname: PropTypes.string,
      port: PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      autoReconnect: PropTypes.bool,
      secure: PropTypes.bool
    }),
    noSettings: PropTypes.bool
  };

  constructor() {
    super();
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.toggleDispatcher = this.toggleDispatcher.bind(this);
    this.toggleSlider = this.toggleSlider.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.clearError = this.clearError.bind(this);
    this.handleError = this.handleError.bind(this);
    this.exportState = this.exportState.bind(this);
    this.importState = this.importState.bind(this);
  }

  componentWillMount() {
    const {
      socketOptions, selectMonitor, testTemplates, selectedTemplate, useCodemirror
    } = this.props;

    this.state = {
      monitor: getFromStorage('select-monitor') || selectMonitor || 'default',
      modalIsOpen: false,
      dispatcherIsOpen: false,
      sliderIsOpen: true,
      instances: {},
      instance: null,
      error: null,
      shouldSync: false
    };
    this.socketOptions = getSettings() || socketOptions;
    this.store = this.createStore();
    this.testComponent = (props) => (
      <TestGenerator
        name={this.state.instances[this.state.instance || this.store.liftedStore.getInstance()]}
        isRedux={this.store.isRedux()}
        testTemplates={testTemplates}
        selectedTemplate={selectedTemplate}
        useCodemirror={useCodemirror}
        {...props}
      />
    );
  }

  handleInstancesChanged = ({ id, instanceId }, name, toRemove) => {
    const instances = this.state.instances;
    if (toRemove) {
      deleteInstance(id, (instance) => {
        delete instances[instance];
        this.store.liftedStore.deleteInstance(instance);
        if (this.state.instance === instance) {
          updateStoreInstance(null);
          this.setState({ instance: null, shouldSync: false });
        }
      });
    } else {
      addInstance(id, instanceId);
      instances[instanceId] = name || instanceId;
      startMonitoring(instanceId);
    }
    this.setState({ instances });
  };

  handleSelectInstance = (event, index, instance) => {
    updateStoreInstance(instance);
    this.setState({ instance, shouldSync: false });
  };

  handleSelectMonitor = (event, index, value) => {
    this.props.dispatch({ type: SELECT_MONITOR, monitor: value });
  };

  handleSyncToggle = () => {
    this.props.dispatch({ type: TOGGLE_SYNC });
  };

  createStore() {
    return createRemoteStore(
      this.socketOptions,
      this.handleInstancesChanged,
      this.handleError,
      this.state.instance
    );
  }

  saveSettings(isLocal, options) {
    this.socketOptions = saveObjToStorage(
      !isLocal, ['hostname', 'port', 'secure'], options
    ) || undefined;
    this.store = this.createStore();
    this.closeModal();
  }

  toggleDispatcher() {
    this.setState({ dispatcherIsOpen: !this.state.dispatcherIsOpen });
  }

  handleError(error) {
    this.setState({ error });
  }

  clearError() {
    this.setState({ error: null });
  }

  toggleSlider() {
    this.setState({ sliderIsOpen: !this.state.sliderIsOpen });
  }

  openModal(content) {
    this.modalContent = content;
    this.setState({ modal: this.modal, modalIsOpen: true });
  }
  closeModal() {
    this.modalContent = null;
    this.setState({ modalIsOpen: false });
  }

  liftedStore() {
    return {
      getState: () => this.props.liftedState,
      dispatch: (action) => {
        this.props.dispatch({ type: LIFTED_ACTION, message: 'DISPATCH', action });
      },
      subscribe: () => {}
    };
  }

  exportState() {
    return this.props.liftedState;
  }

  importState(state) {
    this.props.dispatch({ type: LIFTED_ACTION, message: 'IMPORT', state });
  }

  render() {
    const liftedStore = this.liftedStore();
    const { monitor } = this.props;
    const key = (this.socketOptions ? this.socketOptions.hostname : '') + this.state.instance;
    return (
      <div style={styles.container}>
        <div style={styles.buttonBar}>
          <MonitorSelector selected={monitor} onSelect={this.handleSelectMonitor}/>
          <Instances selected={this.props.selected} />
          <SyncToggle
            on={this.props.shouldSync}
            onClick={this.handleSyncToggle}
            style={!this.props.selected ? { display: 'none' } : undefined}
          />
        </div>
        <DevTools
          monitor={monitor}
          liftedStore={liftedStore}
          testComponent={this.testComponent}
          key={`${monitor}-${key}`}
        />
        {this.state.sliderIsOpen && <div style={styles.sliderMonitor}>
          <DevTools monitor="SliderMonitor" liftedStore={liftedStore} key={`Slider-${key}`} />
        </div>}
        {this.state.dispatcherIsOpen && this.props.options &&
          <Dispatcher
            options={this.props.options}
            dispatch={this.props.dispatch}
            error={this.state.error}
            clearError={this.clearError}
            key={`Dispatcher-${key}`}
          />
        }
        <ButtonBar
          openModal={this.openModal} closeModal={this.closeModal}
          toggleDispatcher={this.toggleDispatcher}
          dispatcherIsOpen={this.state.dispatcherIsOpen}
          toggleSlider={this.toggleSlider}
          sliderIsOpen={this.state.sliderIsOpen}
          saveSettings={this.saveSettings}
          importState={this.importState} exportState={this.exportState}
          socketOptions={this.socketOptions}
          noSettings={this.props.noSettings}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const instances = state.instances;
  const selected = instances.selected;
  const id = selected || instances.current;
  return {
    selected,
    liftedState: instances.states[id],
    options: instances.options[id],
    monitor: state.monitor.selected,
    shouldSync: state.instances.sync
  };
}

export default connect(mapStateToProps)(App);
