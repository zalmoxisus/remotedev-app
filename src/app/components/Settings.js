import React, { Component, PropTypes } from 'react';
import Window from 'react-desktop/lib/Window/Window.osx';
import TitleBar from 'react-desktop/lib/TitleBar/TitleBar.osx';
import Box from 'react-desktop/lib/Box/Box.osx';
import SegmentedControl from 'react-desktop/lib/SegmentedControl/SegmentedControl.osx';
import Form from 'react-desktop/lib/Form/Form.common';
import Label from 'react-desktop/lib/Label/Label.osx';
import TextField from 'react-desktop/lib/TextInput/TextField.osx';
import PushButton from 'react-desktop/lib/Button/PushButton.osx';
// import { Window, TitleBar, Box, Form, Label, TextField, PushButton, SegmentedControl } from 'react-desktop/lib/OSX';
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
    } else {
      isLocal = false;
      this.options.hostname = 'localhost';
      this.options.port = '8000';
    }

    this.state = {
      selectedTab: 'connection',
      isLocal
    };
  }

  changeTab(name) {
    this.setState({ selectedTab: name });
  }
  isTab(name) {
    return this.state.selectedTab === name;
  }

  render() {
    const { saveSettings, closeModal } = this.props;
    return (
      <Window style={styles.window}>
        <TitleBar title="Settings" controls={false} onClosePress={closeModal}/>
        <Box className="box"><SegmentedControl>
          <SegmentedControl.Item title="Connection"
            selected={this.isTab('connection')}
            onPress={() => { this.changeTab('connection'); }}
          >
            <Form onSubmit={() => { saveSettings(this.state.isLocal, this.options); } }>
              <Form.Row>
                <Switch on={this.state.isLocal} onClick={() => this.setState({ isLocal: !this.state.isLocal })} labelStyle={styles.switchLabel}>Use local server</Switch>
              </Form.Row>

              <Form.Row visible={this.state.isLocal}>
                <Label>Host name:</Label>
                <TextField defaultValue={this.options.hostname}
                  onChange={e => {this.options.hostname = e.target.value;}}
                />
              </Form.Row>

              <Form.Row visible={this.state.isLocal}>
                <Label>Port:</Label>
                <TextField defaultValue={this.options.port}
                  onChange={e => {this.options.port = e.target.value;}}
                />
              </Form.Row>

              <Form.Row>
                <PushButton onPress="submit" push color="blue">Save</PushButton>
                <PushButton push onClick={closeModal}>Cancel</PushButton>
              </Form.Row>
            </Form>
          </SegmentedControl.Item>
        </SegmentedControl></Box>
      </Window>
    );
  }
}
