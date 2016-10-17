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
    const state = stringify(this.props.liftedState);
    const blob = new Blob([state], { type: 'octet/stream' });
    const href = window.URL.createObjectURL(blob);
    this.setState({ href });
  }

  cleanHref = () => {
    const { href } = this.state;
    setTimeout(() => {
      window.URL.revokeObjectURL(href);
      this.setState({ href: undefined });
    }, 10000);
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
