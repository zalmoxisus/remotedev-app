import React, { Component, PropTypes } from 'react';
import { Editor } from 'remotedev-monitor-components';
import stringify from 'javascript-stringify';

export default class InspectorWrapper extends Component {
  constructor(props) {
    super(props);
    this.stringifyData(props);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.data !== this.value;
  }

  componentWillUpdate(nextProps) {
    this.stringifyData(nextProps);
  }

  stringifyData(props) {
    this.value = stringify(props.data, null, 2);
  }

  render() {
    return (
      <Editor theme="night" value={this.value} />
    );
  }
}
