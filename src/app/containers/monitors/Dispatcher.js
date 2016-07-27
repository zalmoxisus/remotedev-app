// Based on https://github.com/YoruNoHikage/redux-devtools-dispatch

import React, { Component, PropTypes } from 'react';
import getParams from 'get-params';
import * as themes from 'redux-devtools-themes';

const styles = {
  button: {
    cursor: 'pointer',
    fontWeight: 'bold',
    borderRadius: '3px',
    padding: '3px',
    margin: '5px 3px',
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
  },
};

export default class Dispatcher extends Component {
  static propTypes = {
    initEmpty: PropTypes.bool,
    actionCreators: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
    store: PropTypes.object.isRequired,
    theme: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
  };

  static defaultProps = {
    theme: 'nicinabox',
    initEmpty: false,
    actionCreators: {},
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedActionCreator: 'default',
      args: [],
      error: null,
    };
  }

  selectActionCreator(e) {
    const selectedActionCreator = e.target.value;
    let args = [];
    if (selectedActionCreator !== 'default') {
      // Shrink the number args to the number of the new ones
      args = this.state.args.slice(0, this.getActionCreators()[selectedActionCreator].args.length);
    }
    this.setState({
      selectedActionCreator,
      args,
    });
  }

  handleArg(e, argIndex) {
    const args = [
      ...this.state.args.slice(0, argIndex),
      this.refs['arg' + argIndex].textContent,
      ...this.state.args.slice(argIndex + 1),
    ];
    this.setState({ args });
  }

  launchAction() {
    /* eslint-disable no-new-func */
    try {
      let actionCreator = () => ({});
      let argsToInject = [];
      if (this.state.selectedActionCreator !== 'default') {
        actionCreator = this.getSelectedActionCreator().func;

        const interpretArg = (arg) => (new Function('return ' + arg))();
        argsToInject = this.state.args.map(interpretArg);
        const rest = interpretArg(this.refs.restArgs.textContent);
        if (rest) {
          if (Array.isArray(rest)) argsToInject = argsToInject.concat(...rest);
          else throw new Error('rest must be an array');
        }
      } else {
        actionCreator = new Function('return ' + this.refs.action.textContent);
      }

      this.props.store.dispatch(actionCreator(...argsToInject));

      this.setState({ error: null });
    } catch (e) {
      this.setState({ error: e.message });
    }
    /* eslint-enable */
  }

  componentDidMount() {
    this.resetCustomAction();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedActionCreator === 'default' && prevState.selectedActionCreator !== 'default') {
      this.resetCustomAction();
    }
  }

  resetCustomAction() {
    this.refs.action.innerHTML = this.props.initEmpty ? '<br/>' : '{<br/>type: ""<br/>}';
  }

  getSelectedActionCreator() {
    return this.getActionCreators()[this.state.selectedActionCreator];
  }

  getActionCreators() {
    const { actionCreators } = this.props;

    if (Array.isArray(actionCreators)) {
      return actionCreators;
    }

    const flatTree = function (object, namespace = '') {
      let functions = [];
      for (let propertyName in object) {
        const prop = object[propertyName];
        if (object.hasOwnProperty(propertyName)) {
          if (typeof prop === 'function') {
            functions.push({
              name: namespace + (propertyName || prop.name || 'anonymous'),
              func: prop,
              args: getParams(prop),
            });
          } else if (typeof prop === 'object') {
            functions = functions.concat(flatTree(prop, namespace + propertyName + '.'));
          }
        }
      }
      return functions;
    };

    return flatTree(actionCreators);
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
    const actionCreators = this.getActionCreators();

    let fields = <div contentEditable style={contentEditableStyle} ref="action"></div>;
    if (this.state.selectedActionCreator !== 'default') {
      const fieldStyles = { ...styles.label, color: theme.base06 };
      fields = this.getSelectedActionCreator().args.map((param, i) => (
        <div key={i} style={{ display: 'flex' }}>
          <span style={fieldStyles}>{param}</span>
          <div contentEditable style={contentEditableStyle} ref={'arg' + i} onInput={(e) => this.handleArg(e, i)} />
        </div>
      ));
      fields.push(
        <div key="action" style={{ display: 'flex' }}>
          <span style={fieldStyles}>rest...</span>
          <div contentEditable style={contentEditableStyle} ref="restArgs" />
        </div>
      );
    }

    let error = '';
    if (this.state.error) {
      error = (
        <div style={{ color: theme.base06, background: '#FC2424', padding: '5px', display: 'flex' }}>
          <div style={{ flex: '1', alignItems: 'center' }}>
            <p style={{ margin: '0px' }}>{this.state.error}</p>
          </div>
          <div style={{ alignItems: 'center' }}>
            <button
              onClick={() => this.setState({ error: null })}
              style={{ ...buttonStyle, margin: '0', background: '#DC2424' }}
            >&times;</button>
          </div>
        </div>
      );
    }

    let dispatchButtonStyle = buttonStyle;
    if (actionCreators.length <= 0) {
      dispatchButtonStyle = {
        ...buttonStyle,
        position: 'absolute',
        bottom: '3px',
        right: '5px',
        background: theme.base02,
      };
    }

    const dispatchButton = <button style={dispatchButtonStyle} onClick={this.launchAction.bind(this)}>Dispatch</button>;

    return (
      <div
        style={{
          background: theme.base02,
          fontFamily: 'monaco,Consolas,Lucida Console,monospace',
          position: 'relative'
        }}
      >
        {error}
        {fields}
        {actionCreators.length > 0 ? <div style={{ display: 'flex' }}>
          <select
            onChange={this.selectActionCreator.bind(this)}
            style={{ flex: '1', fontFamily: 'inherit' }}
            defaultValue={this.state.selectedActionCreator || 'default'}
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
