import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import { saveToStorage, getSettings } from './utils/localStorage';
import styles from './styles';
import DevTools from './containers/DevTools';
import SliderMonitor from './containers/SliderMonitor';
import { createRemoteStore, updateStoreInstance, enableSync } from './store/createRemoteStore';
import ButtonBar from './components/ButtonBar';
import Instances from './components/Instances';
import SyncToggle from './components/SyncToggle';

export default class App extends Component {
  static propTypes = {
    socketOptions: PropTypes.shape({
      hostname: PropTypes.string,
      port: PropTypes.number,
      autoReconnect: PropTypes.bool
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      instances: {},
      instance: 'auto',
      shouldSync: false
    };
    this.socketOptions = getSettings() || props.socketOptions;
    this.store = this.createStore();

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
  }

  handleInstancesChanged = (instance, name, toRemove) => {
    const instances = this.state.instances;
    if (toRemove) {
      delete instances[instance];
      this.store.liftedStore.deleteInstance(instance);
    }
    else instances[instance] = name || instance;
    this.setState({ instances });
  };

  handleSelectInstance = e => {
    const instance = e.target.value;
    updateStoreInstance(instance);
    this.setState({ instance, shouldSync: false });
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
      !isLocal, ['hostname', 'port'], options
    ) || undefined;
    this.store = this.createStore();
    this.closeModal();
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
    return (
      <div style={styles.container}>
        <div style={styles.buttonBar}>
          <Instances instances={this.state.instances} onSelect={this.handleSelectInstance}/>
          <SyncToggle
            on={this.state.shouldSync}
            onClick={this.handleSyncToggle}
            style={this.state.instance === 'auto' ? { display: 'none' } : null}
          />
        </div>
        <DevTools
          store={this.store}
          key={
            (this.socketOptions ? this.socketOptions.hostname : '') + this.state.instance
          }
        />
        <div style={styles.sliderMonitor}><SliderMonitor
          store={this.store}
          key={
            'slider' + (this.socketOptions ? this.socketOptions.hostname : '') + this.state.instance
          }
        /></div>
        <ButtonBar
          openModal={this.openModal} closeModal={this.closeModal}
          saveSettings={this.saveSettings}
          socketOptions={this.socketOptions}
        />
        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}
          style={styles.modal}
        >{this.modalContent}</Modal>
      </div>
    );
  }
}
