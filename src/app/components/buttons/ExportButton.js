import React, { Component, PropTypes } from 'react';
import { stringify } from 'jsan';
import DownloadIcon from 'react-icons/lib/md/file-download';
import Button from '../Button';

export default class ExportButton extends Component {
  static propTypes = {
    liftedState: PropTypes.object.isRequired
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
    const state = encodeURIComponent(stringify(this.props.liftedState));
    this.setState({ href: 'data:text/json;charset=utf-8,' + state });
  }

  cleanHref = () => {
    setTimeout(() => { this.setState({ href: undefined }); }, 0);
  };

  render() {
    return (
      <Button
        Icon={DownloadIcon}
        onMouseDown={this.handleExport}
        download="state.json" href={this.state.href}
        onClick={this.cleanHref}
      >Export</Button>
    );
  }
}
