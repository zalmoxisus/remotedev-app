import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
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
    this.socketOptions = this.getSettings() || props.socketOptions;
    this.store = createRemoteStore(this.socketOptions);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.state = { modalIsOpen: false };
  }

  getSettings() {
    const hostname = localStorage.getItem('s:hostname');
    const port = localStorage.getItem('s:port');
    if (hostname && port) return { hostname, port: Number(port) };
    return null;
  }
  saveSettings(isLocal, options) {
    if (isLocal) {
      const { hostname, port } = options;
      localStorage.setItem('s:hostname', hostname);
      localStorage.setItem('s:port', port);
      this.socketOptions = { hostname, port };
    } else {
      localStorage.removeItem('s:hostname');
      localStorage.removeItem('s:port');
      this.socketOptions = this.props.socketOptions;
    }
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
