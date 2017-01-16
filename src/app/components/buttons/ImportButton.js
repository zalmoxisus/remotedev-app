import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'remotedev-ui';
import UploadIcon from 'react-icons/lib/go/cloud-upload';
import { importState, showNotification } from '../../actions';

class ImportButton extends Component {
  static propTypes = {
    importState: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired
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
      this.props.importState(reader.result);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  render() {
    return (
      <Button
        toolbar
        title="Import"
        onClick={this.handleImport}
      >
        <UploadIcon />
        <input
          type="file" ref={this.mapRef} style={{ display: 'none' }}
          onChange={this.handleImportFile}
        />
      </Button>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    importState: bindActionCreators(importState, dispatch),
    showNotification: bindActionCreators(showNotification, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(ImportButton);
