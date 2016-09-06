import React, { Component, PropTypes } from 'react';
import {
  saveObjToStorage, getSettings, getFromStorage, saveToStorage
} from '../utils/localStorage';
import styles from '../styles';
import DevTools from '../containers/DevTools';
import Dispatcher from './monitors/Dispatcher';
import {
  createRemoteStore, updateStoreInstance, enableSync,
  startMonitoring, importState, exportState
} from '../store/createRemoteStore';
import { addInstance, deleteInstance } from '../services/messaging';
import ButtonBar from '../components/ButtonBar';
import Instances from '../components/Instances';
import MonitorSelector from '../components/MonitorSelector';
import SyncToggle from '../components/SyncToggle';
import TestGenerator from '../components/TestGenerator';

export default class App extends Component {
  static propTypes = {
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
    this.setState({ monitor: saveToStorage('select-monitor', value) });
  };

  handleSyncToggle = () => {
    const shouldSync = !this.state.shouldSync;
    enableSync(shouldSync);
    this.setState({ shouldSync });
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

  render() {
    const { monitor } = this.state;
    const key = (this.socketOptions ? this.socketOptions.hostname : '') + this.state.instance;
    return (
      <div style={styles.container}>
        <div style={styles.buttonBar}>
          <MonitorSelector selected={this.state.monitor} onSelect={this.handleSelectMonitor}/>
          <Instances
            instances={this.state.instances} onSelect={this.handleSelectInstance}
            selected={this.state.instance}
          />
          <SyncToggle
            on={this.state.shouldSync}
            onClick={this.handleSyncToggle}
            style={!this.state.instance ? { display: 'none' } : undefined}
          />
        </div>
        <DevTools
          monitor={monitor}
          store={this.store}
          testComponent={this.testComponent}
          key={`${monitor}-${key}`}
        />
        {this.state.sliderIsOpen && <div style={styles.sliderMonitor}>
          <DevTools monitor="SliderMonitor" store={this.store} key={`Slider-${key}`} />
        </div>}
        {this.state.dispatcherIsOpen && this.store.liftedStore.getInstance() &&
          <Dispatcher
            store={this.store}
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
          importState={importState} exportState={exportState}
          socketOptions={this.socketOptions}
          noSettings={this.props.noSettings}
        />
      </div>
    );
  }
}
