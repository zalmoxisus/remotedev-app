import React from 'react';
import Window from 'react-desktop/lib/Window/Window.osx';
import TitleBar from 'react-desktop/lib/TitleBar/TitleBar.osx';
import Box from 'react-desktop/lib/Box/Box.osx';
import Form from 'react-desktop/lib/Form/Form.common';
import Label from 'react-desktop/lib/Label/Label.osx';
import TextField from 'react-desktop/lib/TextInput/TextField.osx';
import PushButton from 'react-desktop/lib/Button/PushButton.osx';
import Checkbox from 'react-desktop/lib/Checkbox/Checkbox.windows';
// import { Window, TitleBar, Box, Form, Label, TextField, PushButton } from 'react-desktop/lib/OSX';
import styles from '../styles';

export default ({ closeModal }) => (
  <Window style={styles.window}>
    <TitleBar title="Settings" controls={false} onClosePress={closeModal} />
    <Box className="box">
      <Form onSubmit={() => { alert('form submitted'); }}>
        <Form.Row>
          <Checkbox label="Use localhost"/>
        </Form.Row>

        <Form.Row>
          <Label>Host name:</Label>
          <TextField defaultValue="localhost"/>
        </Form.Row>

        <Form.Row>
          <Label>Port:</Label>
          <TextField defaultValue="8000"/>
        </Form.Row>

        <Form.Row>
          <PushButton onPress="submit" push color="blue">Button With Color</PushButton>
          <PushButton push onClick={closeModal}>Cancel</PushButton>
        </Form.Row>
      </Form>
    </Box>
  </Window>
);
