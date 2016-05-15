import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import {
  saveToStorage, getSettings, getSelectMonitor, saveSelectMonitor
} from '../utils/localStorage';
import styles from '../styles';
import DevTools from '../containers/DevTools';
import {
  createRemoteStore, updateStoreInstance, enableSync,
  startMonitoring, importState, exportState
} from '../store/createRemoteStore';
import ButtonBar from '../components/ButtonBar';
import Instances from '../components/Instances';
import MonitorSelector from '../components/MonitorSelector';
import SyncToggle from '../components/SyncToggle';

export default class App extends Component {
  static propTypes = {
    selectMonitor: PropTypes.string,
    socketOptions: PropTypes.shape({
      hostname: PropTypes.string,
      port: PropTypes.number,
      autoReconnect: PropTypes.bool,
      secure: PropTypes.bool
    }),
    noButtonBar: PropTypes.bool
  };

  constructor() {
    super();
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.toggleDispatcher = this.toggleDispatcher.bind(this);
    this.toggleSlider = this.toggleSlider.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
  }

  componentWillMount() {
    this.state = {
      monitor: getSelectMonitor() || this.props.selectMonitor || 'default',
      modalIsOpen: false,
      dispatcherIsOpen: false,
      sliderIsOpen: true,
      instances: {},
      instance: 'auto',
      shouldSync: false
    };
    this.socketOptions = getSettings() || this.props.socketOptions;
    this.store = this.createStore();
  }

  handleInstancesChanged = (instance, name, toRemove) => {
    const instances = this.state.instances;
    if (toRemove) {
      delete instances[instance];
      this.store.liftedStore.deleteInstance(instance);
      if (this.state.instance === instance) {
        updateStoreInstance('auto');
        this.setState({ instance: 'auto', shouldSync: false, instances });
        return;
      }
    } else {
      instances[instance] = name || instance;
      startMonitoring(instance);
    }
    this.setState({ instances });
  };

  handleSelectInstance = (event, index, instance) => {
    updateStoreInstance(instance);
    this.setState({ instance, shouldSync: false });
  };

  handleSelectMonitor = (event, index, value) => {
    this.setState({ monitor: saveSelectMonitor(value) });
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
      this.state.instance
    );
  }

  saveSettings(isLocal, options) {
    this.socketOptions = saveToStorage(
      !isLocal, ['hostname', 'port', 'secure'], options
    ) || undefined;
    this.store = this.createStore();
    this.closeModal();
  }

  toggleDispatcher() {
    this.setState({ dispatcherIsOpen: !this.state.dispatcherIsOpen });
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
            style={this.state.instance === 'auto' ? { display: 'none' } : null}
          />
        </div>
        <DevTools monitor={monitor} store={this.store} key={`${monitor}-${key}`} />
        {this.state.sliderIsOpen && <div style={styles.sliderMonitor}>
          <DevTools monitor="SliderMonitor" store={this.store} key={`Slider-${key}`} />
        </div>}
        {this.state.dispatcherIsOpen &&
          <DevTools monitor="DispatchMonitor"
            store={this.store} dispatchFn={this.store.dispatch}
            key={`Dispatch-${key}`}
          />
        }
        {!this.props.noButtonBar &&
          <ButtonBar
            openModal={this.openModal} closeModal={this.closeModal}
            toggleDispatcher={this.toggleDispatcher}
            dispatcherIsOpen={this.state.dispatcherIsOpen}
            toggleSlider={this.toggleSlider}
            sliderIsOpen={this.state.sliderIsOpen}
            saveSettings={this.saveSettings}
            importState={importState} exportState={exportState}
            socketOptions={this.socketOptions}
          />
        }
        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}
          style={styles.modal}
        >{this.modalContent}</Modal>
      </div>
    );
  }
}
