import React from 'react';
import styles from './styles';
import DevTools from './containers/DevTools';
import createRemoteStore from './store/createRemoteStore';
import ButtonBar from './components/ButtonBar';

export default ({ socketOptions }) => (
  <div style={styles.container}>
    <DevTools store={createRemoteStore(socketOptions)} />
    <ButtonBar/>
  </div>
);
