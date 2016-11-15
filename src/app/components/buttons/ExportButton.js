import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { stringify } from 'jsan';
import DownloadIcon from 'react-icons/lib/md/file-download';
import { exportState } from '../../actions';
import Button from '../Button';

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
        Icon={DownloadIcon}
        onClick={this.props.exportState}
      >Export</Button>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    exportState: bindActionCreators(exportState, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(ExportButton);
