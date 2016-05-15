import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import styles from '../styles';

export default class Settings extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    close: PropTypes.func.isRequired,
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

    this.state = { isLocal };
  }

  handleLocalChecked = (e, checked) => {
    this.setState({ isLocal: checked });
  };

  handleInputChange = (e, value) => {
    this.options[e.target.id] = value;
  };

  handleCheckboxChange = (e, checked) => {
    this.options[e.target.id] = checked;
  };

  save = () => {
    this.props.saveSettings(this.state.isLocal, this.options);
    this.props.close();
  };

  render() {
    const { isOpen, close } = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={close}
      />,
      <FlatButton
        label="Submit"
        primary keyboardFocused
        onTouchTap={this.save}
      />
    ];

    return (
      <Dialog
        title="Settings"
        titleStyle={styles.dialogTitle}
        bodyStyle={styles.dialogBody}
        actions={actions}
        open={isOpen}
        onRequestClose={close}
        autoScrollBodyContent
      >
        <Checkbox
          label="Use custom (local) server"
          checked={this.state.isLocal}
          onCheck={this.handleLocalChecked}
        />
        {this.state.isLocal && <div>
          <TextField
            id="hostname"
            floatingLabelText="Host name"
            defaultValue={this.options.hostname}
            onChange={this.handleInputChange}
          />
          <TextField
            id="port"
            floatingLabelText="Port"
            defaultValue={this.options.port}
            onChange={this.handleInputChange}
          /><br/>
          <Checkbox
            id="secure"
            label="Use secure connection"
            defaultChecked={this.options.secure}
            onCheck={this.handleCheckboxChange}
          />
        </div>}
      </Dialog>
    );
  }
}
