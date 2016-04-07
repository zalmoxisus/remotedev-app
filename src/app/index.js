import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import { saveToStorage, getSettings, getSelectMonitor, saveSelectMonitor } from './utils/localStorage';
import styles from './styles';
import DevTools, { sideMonitors } from './containers/DevTools';
import { createRemoteStore, updateStoreInstance, enableSync } from './store/createRemoteStore';
import ButtonBar from './components/ButtonBar';
import Instances from './components/Instances';
import SyncToggle from './components/SyncToggle';

export default class App extends Component {
  static propTypes = {
    selectMonitor: PropTypes.string,
    socketOptions: PropTypes.shape({
      hostname: PropTypes.string,
      port: PropTypes.number,
      autoReconnect: PropTypes.bool
    }),
    noButtonBar: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      monitor: getSelectMonitor() || props.selectMonitor || 'default',
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
      if (this.state.instance === instance) {
        updateStoreInstance('auto');
        this.setState({ instance: 'auto', shouldSync: false, instances });
        return;
      }
    }
    else instances[instance] = name || instance;
    this.setState({ instances });
  };

  handleSelectInstance = e => {
    const instance = e.target.value;
    updateStoreInstance(instance);
    this.setState({ instance, shouldSync: false });
  };

  handleSelectMonitor = e => {
    this.setState({ monitor: saveSelectMonitor(e.target.value) });
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
    const { monitor } = this.state;
    const key = (this.socketOptions ? this.socketOptions.hostname : '') + this.state.instance;
    return (
      <div style={styles.container}>
        <div style={styles.buttonBar}>
          <select
            style={{ ...styles.instances, ...styles.monitors }}
            onChange={this.handleSelectMonitor}
          >
            {
              sideMonitors.map((item, i) =>
                <option key={i}
                  value={item.key}
                  selected={item.key === this.state.monitor}
                >{item.title}</option>
              )
            }
          </select>
          <Instances instances={this.state.instances} onSelect={this.handleSelectInstance}/>
          <SyncToggle
            on={this.state.shouldSync}
            onClick={this.handleSyncToggle}
            style={this.state.instance === 'auto' ? { display: 'none' } : null}
          />
        </div>
        <DevTools monitor={monitor} store={this.store} key={`${monitor}-${key}`} />
        <div style={styles.sliderMonitor}>
          <DevTools monitor="SliderMonitor" store={this.store} key={`Slider-${key}`} />
        </div>
        {this.props.noButtonBar ? null :
          <ButtonBar
            openModal={this.openModal} closeModal={this.closeModal}
            saveSettings={this.saveSettings}
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
