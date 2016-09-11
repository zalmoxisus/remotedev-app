import React, { Component, PropTypes, createElement } from 'react';
import getMonitor from './getMonitor';

export default class extends Component {
  static propTypes = {
    liftedState: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    monitor: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.monitorElement = getMonitor(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.monitor !== this.props.monitor) {
      this.monitorElement = getMonitor(nextProps);
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.monitor !== this.props.monitor ||
      nextProps.liftedState !== this.props.liftedState;
  }

  render() {
    const { liftedState, dispatch } = this.props;
    const monitorProps = this.monitorElement.props;
    const Monitor = this.monitorElement.type;
    return <Monitor dispatch={dispatch} {...liftedState} {...monitorProps} />;
  }
}
