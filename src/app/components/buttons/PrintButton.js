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

    const initHeight = d3svg.style.height;
    const initWidth = d3svg.style.width;
    const box = d3svg.getBBox();
    d3svg.style.height = box.height;
    d3svg.style.width = box.width;
    window.print();
    d3svg.style.height = initHeight;
    d3svg.style.width = initWidth;
  }

  render() {
    return (
      <Button Icon={PrintIcon} onClick={this.handlePrint}>Print</Button>
    );
  }
}
