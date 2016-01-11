import React, { Component, PropTypes } from 'react';
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

  componentWillMount() {
    this.store = createRemoteStore(this.props.socketOptions);
  }

  render() {
    return (
      <div style={styles.container}>
        <DevTools store={this.store} />
        <ButtonBar/>
      </div>
    );
  }
}
