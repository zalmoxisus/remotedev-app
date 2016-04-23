import React, { Component, PropTypes } from 'react';
import { stringify } from 'jsan';
import DownloadIcon from 'react-icons/lib/md/file-download';
import Button from '../Button';

export default class ExportButton extends Component {
  static propTypes = {
    exportState: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {};
    this.handleExport = this.handleExport.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.href !== this.state.href;
  }

  handleExport() {
    let state = this.props.exportState();
    if (!state) return;
    state = encodeURIComponent(stringify(state));
    this.setState({ href: 'data:text/json;charset=utf-8,' + state });
  }

  render() {
    return (
      <Button
        Icon={DownloadIcon}
        onMouseDown={this.handleExport}
        download="state.json" href={this.state.href}
      >Export</Button>
    );
  }
}
