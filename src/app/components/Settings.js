import React, { Component, PropTypes } from 'react';
import Window from 'react-desktop/lib/window/window.osx/window';
import TitleBar from 'react-desktop/lib/title-bar/title-bar.osx/title-bar';
import Box from 'react-desktop/lib/box/box.osx/box';
import View from 'react-desktop/lib/view/view';
import Label from 'react-desktop/lib/label/label.osx/label';
import TextInput from 'react-desktop/lib/text-input/text-input.osx/text-input';
import Checkbox from 'react-desktop/lib/checkbox/checkbox.osx/checkbox';
import Button from 'react-desktop/lib/button/button.osx/button';
import Switch from 'react-switcher';
import styles from '../styles';

export default class Settings extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    saveSettings: PropTypes.func.isRequired,
    socketOptions: PropTypes.object
  };

  constructor(props) {
    super(props);
    let isLocal;
    this.options = {};
    if (props.socketOptions) {
      isLocal = true;
      this.options.hostname = props.socketOptions.hostname;
      this.options.port = props.socketOptions.port;
      this.options.secure = props.socketOptions.secure;
    } else {
      isLocal = false;
      this.options.hostname = 'localhost';
      this.options.port = '8000';
      this.options.secure = false;
    }

    this.state = {
      // selectedTab: 'connection',
      isLocal
    };
  }

  /*
  changeTab(name) {
    this.setState({ selectedTab: name });
  }
  isTab(name) {
    return this.state.selectedTab === name;
  }
  */

  saveSettings = () => {
    this.props.saveSettings(this.state.isLocal, this.options);
  };

  handleInputChange = (e) => {
    this.options[e.target.id] = e.target.value;
  };

  handleCheckboxChange = (e) => {
    this.options[e.target.id] = !this.options[e.target.id];
  };

  render() {
    const { closeModal } = this.props;
    return (
      <Window style={styles.window}>
        <TitleBar title="Settings" controls={false} onClosePress={closeModal}/>
        <Box style={{ width: '100%' }}>
          <View style={styles.viewForm}>
            <Switch on={this.state.isLocal} onClick={() => this.setState({ isLocal: !this.state.isLocal })} labelStyle={styles.switchLabel}>Use local server</Switch>
          </View>
          <View style={styles.viewForm} hidden={!this.state.isLocal}>
            <Label style={styles.labelForm}>Host name:</Label>
            <TextInput
              id="hostname"
              defaultValue={this.options.hostname}
              onChange={this.handleInputChange}
            />
          </View>
          <View style={styles.viewForm} hidden={!this.state.isLocal}>
            <Label style={styles.labelForm}>Port:</Label>
            <TextInput
              id="port"
              defaultValue={this.options.port}
              onChange={this.handleInputChange}
            />
          </View>
          <View style={styles.viewForm} hidden={!this.state.isLocal}>
            <Checkbox
              id="secure"
              label="Use secure connection"
              onChange={this.handleCheckboxChange}
              defaultChecked={this.options.secure}
            />
          </View>
          <View
            padding="5px"
            horizontalAlignment="center"
            verticalAlignment="center"
          >
            <Button onClick={this.saveSettings} color="blue">Save</Button>
            <span style={styles.separator} />
            <Button onClick={closeModal}>Cancel</Button>
          </View>
        </Box>
      </Window>
    );
  }
}
