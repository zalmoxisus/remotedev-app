// Based on https://github.com/YoruNoHikage/redux-devtools-dispatch

import React, { Component, PropTypes } from 'react';
import * as themes from 'redux-devtools-themes';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { dispatchRemotely } from '../../actions';

const styles = {
  button: {
    cursor: 'pointer',
    fontWeight: 'bold',
    borderRadius: '3px',
    padding: '3px',
    margin: '5px',
    fontSize: '0.8em',
    textDecoration: 'none',
    border: 'none',
  },
  content: {
    margin: '5px',
    padding: '5px',
    borderRadius: '3px',
    outline: 'none',
    flex: '1 1 80%',
    overflow: 'auto',
  },
  label: {
    margin: '5px',
    padding: '5px',
    flex: '1 1 20%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    direction: 'rtl',
    textAlign: 'left',
  }
};

class Dispatcher extends Component {
  static propTypes = {
    options: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    theme: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ])
  };

  static defaultProps = {
    theme: 'nicinabox'
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      selected: 'default',
      args: []
    };
  }

  selectActionCreator(e) {
    const selected = e.target.value;
    let args = [];
    if (selected !== 'default') {
      // Shrink the number args to the number of the new ones
      args = this.state.args.slice(
        0, this.props.options.actionCreators[selected].args.length
      );
    }
    this.setState({
      selected,
      args
    });
  }

  handleArg(e, argIndex) {
    let value = this.refs['arg' + argIndex].textContent.trim();
    if (value === '') value = undefined;
    const args = [
      ...this.state.args.slice(0, argIndex),
      value,
      ...this.state.args.slice(argIndex + 1),
    ];
    this.setState({ args });
  }

  launchAction() {
    if (this.state.selected !== 'default') {
      let rest = this.refs.restArgs.textContent.trim();
      if (rest === '') rest = undefined;
      const { selected, args } = this.state;
      this.props.dispatch({
        name: this.props.options.actionCreators[selected].name,
        selected, args, rest
      });
    } else {
      if (this.refs.action.textContent !== '') {
        this.props.dispatch(this.refs.action.textContent);
      }
    }
  }

  componentDidMount() {
    this.resetCustomAction();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.selected === 'default' &&
      prevState.selected !== 'default'
    ) {
      this.resetCustomAction();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.selected !== 'default' && !nextProps.options.actionCreators) {
      this.setState({
        selected: 'default',
        args: []
      });
    }
  }

  resetCustomAction() {
    this.refs.action.innerHTML = this.props.options.isRedux ? '{<br/>type: \'\'<br/>}' : 'this.';
  }

  getTheme() {
    let { theme } = this.props;
    if (typeof theme !== 'string') {
      return theme;
    }

    if (typeof themes[theme] !== 'undefined') {
      return themes[theme];
    }

    console.warn('DevTools theme ' + theme + ' not found, defaulting to nicinabox');
    return themes.nicinabox;
  }

  render() {
    const theme = this.getTheme();
    const contentEditableStyle = {
      ...styles.content, color: theme.base06, backgroundColor: theme.base00
    };
    const buttonStyle = {
      ...styles.button, color: theme.base06, backgroundColor: theme.base00
    };
    const actionCreators = this.props.options.actionCreators;

    let fields = <div contentEditable style={contentEditableStyle} ref="action"></div>;
    if (this.state.selected !== 'default' && actionCreators) {
      const fieldStyles = { ...styles.label, color: theme.base06 };
      fields = actionCreators[this.state.selected].args.map((param, i) => (
        <div key={i} style={{ display: 'flex' }}>
          <span style={fieldStyles}>{param}</span>
          <div
            contentEditable style={contentEditableStyle} ref={'arg' + i}
            onInput={(e) => this.handleArg(e, i)}
          />
        </div>
      ));
      fields.push(
        <div key="action" style={{ display: 'flex' }}>
          <span style={fieldStyles}>args...</span>
          <div contentEditable style={contentEditableStyle} ref="restArgs" />
        </div>
      );
    }

    let dispatchButtonStyle = buttonStyle;
    if (!actionCreators || actionCreators.length <= 0) {
      dispatchButtonStyle = {
        ...buttonStyle,
        position: 'absolute',
        bottom: '3px',
        right: '5px',
        background: theme.base02,
      };
    }

    const dispatchButton = (
      <button style={dispatchButtonStyle} onClick={this.launchAction.bind(this)}>Dispatch</button>
    );

    return (
      <div
        style={{
          background: theme.base02,
          fontFamily: 'monaco,Consolas,Lucida Console,monospace',
          position: 'relative'
        }}
      >
        {fields}
        {actionCreators && actionCreators.length > 0 ? <div style={{ display: 'flex' }}>
          <select
            onChange={this.selectActionCreator.bind(this)}
            style={{ flex: '1', margin: '5px 0 0 5px', height: '1.5em' }}
            defaultValue={this.state.selected || 'default'}
          >
            <option value="default">Custom action</option>
            {actionCreators.map(({ name, func, args }, i) => (
              <option key={i} value={i}>
                {name + '(' + args.join(', ') + ')'}
              </option>
            ))}
          </select>
          {dispatchButton}
        </div> : dispatchButton}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: bindActionCreators(dispatchRemotely, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(Dispatcher);
