import 'codemirror/mode/javascript/javascript';
import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Button from './Button';
import AddButton from 'react-icons/lib/md/add';
import EditButton from 'react-icons/lib/md/edit';
import TestGenerator from 'redux-devtools-test-generator';
import mochaTemplate from 'redux-devtools-test-generator/lib/redux/mocha/template';
import tapeTemplate from 'redux-devtools-test-generator/lib/redux/tape/template';
import avaTemplate from 'redux-devtools-test-generator/lib/redux/ava/template';
import mochaVTemplate from 'redux-devtools-test-generator/lib/vanilla/mocha/template';
import tapeVTemplate from 'redux-devtools-test-generator/lib/vanilla/tape/template';
import avaVTemplate from 'redux-devtools-test-generator/lib/vanilla/ava/template';
import TestForm from './TestForm';
import { getFromStorage, saveToStorage } from '../utils/localStorage';
import styles from '../styles';

let testTemplates;
let selected;
let isDefaultTemplate;

export default class TestGen extends Component {
  constructor(props) {
    super(props);
    if (!testTemplates) {
      testTemplates = props.testTemplates || getFromStorage('test-templates');
      selected = props.selectedTemplate || getFromStorage('test-templates-sel') || 0;
      if (typeof testTemplates === 'string') {
        testTemplates = JSON.parse(testTemplates);
      }
      if (!testTemplates || testTemplates.length === 0) {
        testTemplates = this.getDefaultTemplates();
        isDefaultTemplate = true;
      }
      if (typeof selected === 'string') {
        selected = Number(selected);
      }
    } else if (isDefaultTemplate) {
      testTemplates = this.getDefaultTemplates();
    }

    this.state = { testTemplates, selected, dialogStatus: 0 };
  }

  componentWillUpdate(nextProps) {
    if (isDefaultTemplate && this.props.isRedux !== nextProps.isRedux) {
      testTemplates = this.getDefaultTemplates(nextProps.isRedux);
      this.setState({ testTemplates });
    }
  }

  onSelect = (event, index, value) => {
    selected = saveToStorage('test-templates-sel', value);
    this.setState({ selected });
  };

  getDefaultTemplates(isRedux = this.props.isRedux) {
    if (isRedux) return [mochaTemplate, tapeTemplate, avaTemplate];
    return [mochaVTemplate, tapeVTemplate, avaVTemplate];
  }

  editTemplate = () => {
    this.setState({ dialogStatus: 1 });
  };

  addTemplate = () => {
    this.setState({ dialogStatus: 2 });
  };

  handleSave = (template) => {
    testTemplates = [...this.state.testTemplates];
    selected = this.state.selected;

    if (this.state.dialogStatus === 1) {
      testTemplates[this.state.selected] = template;
    } else {
      testTemplates.push(template);
      selected = testTemplates.length - 1;
      saveToStorage('test-templates-sel', selected);
    }

    saveToStorage('test-templates', testTemplates);
    this.setState({ testTemplates, selected, dialogStatus: 0 });
    isDefaultTemplate = false;
  };

  handleRemove = () => {
    // Todo: add snackbar with undo
    selected = 0;
    testTemplates = [...this.state.testTemplates];
    testTemplates.splice(this.state.selected, 1);
    if (testTemplates.length === 0) testTemplates = this.getDefaultTemplates();
    saveToStorage('test-templates-sel', selected);
    saveToStorage('test-templates', testTemplates);
    this.setState({ testTemplates, selected, dialogStatus: 0 });
    isDefaultTemplate = false;
  };

  handleCloseDialog = () => {
    this.setState({ dialogStatus: 0 });
  };

  render() {
    const { dialogStatus, selected, testTemplates } = this.state; // eslint-disable-line
    const template = testTemplates[selected];
    const { assertion, wrap } = template;

    return (
      <TestGenerator
        isVanilla={!this.props.isRedux}
        assertion={assertion} wrap={wrap}
        theme="night" useCodemirror={this.props.useCodemirror}
        header={
          <div style={{ height: '2.5em', minHeight: '2.5em', display: 'flex' }}>
            <SelectField
              style={styles.select}
              labelStyle={styles.selectLabel}
              iconStyle={styles.selectIcon}
              onChange={this.onSelect}
              value={selected}
            >
              {testTemplates.map((item, i) =>
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
  isRedux: PropTypes.bool,
  testTemplates: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
  selectedTemplate: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  useCodemirror: PropTypes.bool
};
