import React, { Component, PropTypes } from 'react';
import { parse } from 'jsan';
import UploadIcon from 'react-icons/lib/md/file-upload';
import Button from './Button';

export default class ImportButton extends Component {
  static propTypes = {
    importState: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.handleImport = this.handleImport.bind(this);
    this.handleImportFile = this.handleImportFile.bind(this);
    this.mapRef = this.mapRef.bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  mapRef(node) {
    this.fileInput = node;
  }

  handleImport() {
    this.fileInput.click();
  }

  handleImportFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const state = reader.result;
        parse(state); // Check if it is in JSON format
        this.props.importState(state);
      } catch (error) {
        // FIXME: add error notification
        /* eslint-disable no-alert */
        alert('Invalid file');
        /* eslint-enable */
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  render() {
    return (
      <Button Icon={UploadIcon} onClick={this.handleImport}>
        Import
        <input
          type="file" ref={this.mapRef} style={{ display: 'none' }}
          onChange={this.handleImportFile}
        />
      </Button>
    );
  }
}
