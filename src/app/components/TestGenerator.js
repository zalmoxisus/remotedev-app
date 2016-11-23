import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Button from './Button';
import AddButton from 'react-icons/lib/md/add';
import EditButton from 'react-icons/lib/md/edit';
import TestGenerator from 'redux-devtools-test-generator';
import jestTemplate from 'redux-devtools-test-generator/lib/redux/jest/template';
import mochaTemplate from 'redux-devtools-test-generator/lib/redux/mocha/template';
import tapeTemplate from 'redux-devtools-test-generator/lib/redux/tape/template';
import avaTemplate from 'redux-devtools-test-generator/lib/redux/ava/template';
/*
import mochaVTemplate from 'redux-devtools-test-generator/lib/vanilla/mocha/template';
import tapeVTemplate from 'redux-devtools-test-generator/lib/vanilla/tape/template';
import avaVTemplate from 'redux-devtools-test-generator/lib/vanilla/ava/template';
*/
import { TEST_ADD, TEST_EDIT, TEST_REMOVE, TEST_SELECT } from '../constants/actionTypes';
import { getActiveInstance } from '../reducers/instances';
import TestForm from './TestForm';
import styles from '../styles';

class TestGen extends Component {
  constructor(props) {
    super(props);
    this.state = { dialogStatus: 0 };
  }

  onSelect = (event, index, value) => {
    this.props.dispatch({ type: TEST_SELECT, selected: value });
  };

  getDefaultTemplates() {
    /*
    if (this.props.options.lib === 'redux') {
      return [mochaTemplate, tapeTemplate, avaTemplate];
    }
    return [mochaVTemplate, tapeVTemplate, avaVTemplate];
    */
    return [jestTemplate, mochaTemplate, tapeTemplate, avaTemplate];
  }

  editTemplate = () => {
    this.setState({ dialogStatus: 1 });
  };

  addTemplate = () => {
    this.setState({ dialogStatus: 2 });
  };

  dispatch = (action) => {
    let templates;
    if (!this.props.templates) templates = this.getDefaultTemplates();
    this.props.dispatch({ ...action, templates });
  };

  handleSave = (template) => {
    if (this.state.dialogStatus === 1) {
      this.dispatch({ type: TEST_EDIT, template });
    } else {
      this.dispatch({ type: TEST_ADD, template });
    }
    this.handleCloseDialog();
  };

  handleRemove = () => {
    // Todo: add snackbar with undo
    this.dispatch({ type: TEST_REMOVE });
    this.handleCloseDialog();
  };

  handleCloseDialog = () => {
    this.setState({ dialogStatus: 0 });
  };

  render() {
    const { dialogStatus } = this.state;
    const { selected } = this.props;
    const templates = this.props.templates || this.getDefaultTemplates();
    const template = templates[selected];
    const { assertion, dispatcher, wrap } = template;

    return (
      <TestGenerator
        isVanilla={this.props.options.lib !== 'redux'}
        name={this.props.options.name}
        assertion={assertion} dispatcher={dispatcher} wrap={wrap}
        theme="night" useCodemirror
        header={
          <div style={{ height: '2.5em', minHeight: '2.5em', display: 'flex' }}>
            <SelectField
              style={styles.select}
              labelStyle={styles.selectLabel}
              iconStyle={styles.selectIcon}
              onChange={this.onSelect}
              value={selected}
            >
              {templates.map((item, i) =>
                <MenuItem key={i} value={i} primaryText={item.name} />
              )}
            </SelectField>
            <Button Icon={EditButton} onClick={this.editTemplate} />
            <Button Icon={AddButton} onClick={this.addTemplate} />
            <TestForm { ...{
              template, dialogStatus,
              onSave: this.handleSave,
              onRemove: this.handleRemove,
              onClose: this.handleCloseDialog
            } }
            />
          </div>
        }
        {...this.props}
      />
    );
  }
}

TestGen.propTypes = {
  templates: PropTypes.array,
  selected: PropTypes.number,
  options: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const instances = state.instances;
  return {
    templates: state.test.templates,
    selected: state.test.selected,
    options: instances.options[getActiveInstance(instances)]
  };
}

export default connect(mapStateToProps)(TestGen);
