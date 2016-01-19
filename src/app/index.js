import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import { saveToStorage, getSettings } from './utils/localStorage';
import styles from './styles';
import DevTools from './containers/DevTools';
import { createRemoteStore, updateStoreInstance } from './store/createRemoteStore';
import ButtonBar from './components/ButtonBar';
import Instances from './components/Instances';

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
    this.state = { modalIsOpen: false, instances: {}, instance: 'auto' };
    this.socketOptions = getSettings() || props.socketOptions;
    this.store = this.createStore();

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.handleSelectInstance = this.handleSelectInstance.bind(this);
  }

  handleInstancesChanged = (instance, name, toRemove) => {
    const instances = this.state.instances;
    if (toRemove) {
      delete instances[instance];
    }
    else instances[instance] = name || instance;
    this.setState({ instances });
  };

  handleSelectInstance = e => {
    const instance = e.target.value;
    updateStoreInstance(instance);
    this.setState({ instance });
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
        </div>
        <DevTools
          store={this.store}
          key={
            (this.socketOptions ? this.socketOptions.hostname : '') + this.state.instance
          }
        />
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
