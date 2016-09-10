import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import { saveSocketSettings } from '../actions';
import styles from '../styles';

class Settings extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    close: PropTypes.func.isRequired,
    saveSettings: PropTypes.func.isRequired,
    socketOptions: PropTypes.object.isRequired,
    isCustom: PropTypes.bool
  };

  constructor(props) {
    super(props);
    const isCustom = props.isCustom;
    this.options = {};
    if (isCustom) {
      this.options.hostname = props.socketOptions.hostname;
      this.options.port = props.socketOptions.port;
      this.options.secure = props.socketOptions.secure;
    } else {
      this.options.hostname = 'localhost';
      this.options.port = '8000';
      this.options.secure = false;
    }

    this.state = { isCustom };
  }

  handleLocalChecked = (e, checked) => {
    this.setState({ isCustom: checked });
  };

  handleInputChange = (e, value) => {
    this.options[e.target.id] = value;
  };

  handleCheckboxChange = (e, checked) => {
    this.options[e.target.id] = checked;
  };

  save = () => {
    this.props.saveSettings(this.state.isCustom, this.options);
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
          checked={this.state.isCustom}
          onCheck={this.handleLocalChecked}
        />
        {this.state.isCustom && <div>
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

function mapStateToProps(state) {
  return {
    socketOptions: state.socket.options,
    isCustom: state.socket.isCustom
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveSettings: bindActionCreators(saveSocketSettings, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
