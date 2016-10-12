import React, { Component, PropTypes } from 'react';
import PrintIcon from 'react-icons/lib/md/print';
import Button from '../Button';

export default class PrintButton extends Component {
  shouldComponentUpdate() {
    return false;
  }

  handlePrint() {
    const d3svg = document.getElementById('d3svg');
    if (!d3svg) {
      window.print();
      return;
    }

    const g = d3svg.firstChild;
    const currTransform = g.getAttribute('transform');
    g.setAttribute('transform', 'translate(57, 10) scale(1)');
    window.print();
    g.setAttribute('transform', currTransform);
  }

  render() {
    return (
      <Button Icon={PrintIcon} onClick={this.handlePrint}>Print</Button>
    );
  }
}
