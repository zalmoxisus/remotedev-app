import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import { saveToStorage, getSettings } from './utils/localStorage';
import styles from './styles';
import DevTools from './containers/DevTools';
import SliderMonitor from './containers/SliderMonitor';
import Inspector from './containers/Inspector';
import { createRemoteStore, updateStoreInstance, enableSync } from './store/createRemoteStore';
import ButtonBar from './components/ButtonBar';
import Instances from './components/Instances';
import SyncToggle from './components/SyncToggle';

const monitors = [
  { key: 'default', title: 'Default' },
  { key: 'inspector', title: 'Inspector' }
];

export default class App extends Component {
  static propTypes = {
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
      monitor: 'default',
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
    this.setState({ monitor: e.target.value });
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

  renderSlider(key) {
    return (
      <div style={styles.sliderMonitor} key={`slider${key}wrap`}>
        <SliderMonitor store={this.store} key={`slider${key}`} />
      </div>
    );
  }

  renderDevTools() {
    const key = (this.socketOptions ? this.socketOptions.hostname : '') + this.state.instance;
    switch (this.state.monitor) {
      case 'inspector':
        return [
          <Inspector store={this.store} key={`inspector${key}`} />,
          this.renderSlider(key)
        ];
      default:
        return [
          <DevTools store={this.store} key={key} />,
          this.renderSlider(key)
        ];
    }
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.buttonBar}>
          <select
            style={{ ...styles.instances, ...styles.monitors }}
            onChange={this.handleSelectMonitor}
          >
            {
              monitors.map((item, i) =>
                <option key={i} value={item.key}>{item.title}</option>
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
        {this.renderDevTools()}
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
