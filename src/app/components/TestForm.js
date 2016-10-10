import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import styles from '../styles';

export default class TestForm extends Component {
  constructor(props) {
    super(props);
    if (props.dialogStatus === 1) this.template = { ...this.props.template };
    else this.template = {};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dialogStatus === 1) this.template = { ...nextProps.template };
  }

  handleInputChange = (e, value) => {
    this.template[e.target.id] = value;
  };

  save = () => {
    this.props.onSave(this.template);
  };

  render() {
    const { onClose, onRemove, dialogStatus } = this.props;
    let template = {};
    if (dialogStatus === 1) template = this.props.template;
    const { name, assertion, dispatcher, wrap } = template;
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={onClose}
        labelStyle={styles.buttonLabel}
        style={styles.flatButton}
      />,
      <FlatButton
        label={dialogStatus === 1 ? 'Save' : 'Add'}
        primary keyboardFocused
        onTouchTap={this.save}
        labelStyle={styles.buttonLabel}
        style={styles.flatButton}
      />
    ];
    if (dialogStatus === 1) {
      actions.splice(1, 0,
        <FlatButton
          label="Remove"
          primary
          onTouchTap={onRemove}
          labelStyle={styles.buttonLabel}
          style={styles.flatButton}
        />
      );
    }

    return (
      <Dialog
        title={dialogStatus === 1 ? 'Edit template' : 'Add new template'}
        actions={actions}
        modal={false}
        open={!!dialogStatus}
        onRequestClose={onClose}
        titleStyle={styles.dialogTitle}
        autoScrollBodyContent
      >
        <TextField
          id="name"
          floatingLabelText="Template name"
          defaultValue={name}
          fullWidth
          inputStyle={styles.input}
          onChange={this.handleInputChange}
        />
        <TextField
          id="dispatcher"
          rows={2}
          rowsMax={2}
          floatingLabelText="Dispatcher template"
          hintText="({ action, prevState }) => (`<template>`)"
          hintStyle={styles.hint}
          inputStyle={styles.input}
          defaultValue={dispatcher}
          multiLine fullWidth
          onChange={this.handleInputChange}
        />
        <TextField
          id="assertion"
          rows={2}
          rowsMax={2}
          floatingLabelText="Assertion template"
          hintText="({ curState }) => (`<template>`)"
          hintStyle={styles.hint}
          inputStyle={styles.input}
          defaultValue={assertion}
          multiLine fullWidth
          onChange={this.handleInputChange}
        />
        <TextField
          id="wrap"
          rows={5}
          rowsMax={5}
          floatingLabelText="Wrapping template"
          hintText="({ name, initialState, assertions }) => (`<template>`)"
          hintStyle={styles.hint}
          inputStyle={styles.input}
          defaultValue={wrap}
          multiLine fullWidth
          onChange={this.handleInputChange}
        />
      </Dialog>
    );
  }
}

TestForm.propTypes = {
  dialogStatus: PropTypes.number,
  template: PropTypes.object,
  onSave: PropTypes.func,
  onRemove: PropTypes.func,
  onClose: PropTypes.func
};
