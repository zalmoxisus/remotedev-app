import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'remotedev-ui';
import { stringify } from 'jsan';
import DownloadIcon from 'react-icons/lib/go/cloud-download';
import { exportState } from '../../actions';

class ExportButton extends Component {
  static propTypes = {
    exportState: PropTypes.func.isRequired
  };

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Button
        toolbar
        title="Export"
        onClick={this.props.exportState}
      >
        <DownloadIcon />
      </Button>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    exportState: bindActionCreators(exportState, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(ExportButton);
