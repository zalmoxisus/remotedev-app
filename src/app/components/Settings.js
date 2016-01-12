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
import Switch from './Switch';
import styles from '../styles';

export default class Settings extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      selectedTab: 'connection',
      isLocal: false,
      hostname: localStorage.getItem('s:hostname') || 'localhost',
      port: localStorage.getItem('s:port') || '8000'
    };
  }

  changeTab(name) {
    this.setState({ selectedTab: name });
  }
  isTab(name) {
    return this.state.selectedTab === name;
  }

  handleSubmit() {
    if (this.state.isLocal) {
      localStorage.setItem('s:hostname', this.state.hostname);
      localStorage.setItem('s:port', this.state.port);
    } else {
      localStorage.removeItem('s:hostname');
      localStorage.removeItem('s:port');
    }
    console.log(this.state.isLocal, this.state.hostname, this.state.port);
    this.props.closeModal();
  }

  render() {
    const closeModal = this.props.closeModal;
    return (
      <Window style={styles.window}>
        <TitleBar title="Settings" controls={false} onClosePress={closeModal}/>
        <Box className="box"><SegmentedControl>
          <SegmentedControl.Item title="Connection"
            selected={this.isTab('connection')}
            onPress={() => { this.changeTab('connection'); }}
          >
            <Form onSubmit={this.handleSubmit}>
              <Form.Row>
                <Switch on={this.state.isLocal}
                  onClick={() => this.setState({ isLocal: !this.state.isLocal })}
                >Use local server</Switch>
              </Form.Row>

              <Form.Row>
                <Label>Host name:</Label>
                <TextField defaultValue={this.state.hostname}
                  onChange={e => {this.state.hostname = e.target.value;}}
                />
              </Form.Row>

              <Form.Row>
                <Label>Port:</Label>
                <TextField defaultValue={this.state.port}
                  onChange={e => {this.state.port = e.target.value;}}
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
