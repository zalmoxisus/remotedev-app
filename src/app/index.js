import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import { saveToStorage, getSettings } from './utils/localStorage';
import styles from './styles';
import DevTools from './containers/DevTools';
import createRemoteStore from './store/createRemoteStore';
import ButtonBar from './components/ButtonBar';

export default class extends Component {
  static propTypes = {
    socketOptions: PropTypes.shape({
      hostname: PropTypes.string,
      port: PropTypes.number,
      autoReconnect: PropTypes.bool
    })
  };

  constructor(props) {
    super(props);
    this.socketOptions = getSettings() || props.socketOptions;
    this.store = createRemoteStore(this.socketOptions);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.state = { modalIsOpen: false };
  }

  saveSettings(isLocal, options) {
    this.socketOptions = saveToStorage(
      !isLocal, ['hostname', 'port'], options
    ) || undefined;
    this.store = createRemoteStore(this.socketOptions);
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
        <DevTools
          store={this.store}
          key={this.socketOptions ? this.socketOptions.hostname : null}
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
