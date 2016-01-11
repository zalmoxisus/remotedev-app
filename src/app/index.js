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
    this.store = createRemoteStore(props.socketOptions);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = { modalIsOpen: false };
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
        <DevTools store={this.store} />
        <ButtonBar openModal={this.openModal} closeModal={this.closeModal} />
        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}>
          {this.modalContent}
        </Modal>
      </div>
    );
  }
}
