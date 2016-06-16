import { indigo50 } from 'material-ui/styles/colors';

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column nowrap'
  },
  sliderMonitor: {
    minWidth: '300px',
    zIndex: '0',
    borderTop: '1px solid #4F5A65'
  },
  buttonBar: {
    padding: '5px',
    textAlign: 'center',
    display: 'flex',
    flexFlow: 'row nowrap',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderColor: '#4F5A65',
    flexDirection: 'row',
    backgroundColor: '#353B46',
    fontFamily: 'monaco, Consolas, Lucida Console, monospace',
    minWidth: '300px',
    minHeight: '1.9em',
    maxHeight: '1.9em',
    overflow: 'hidden'
  },
  button: {
    cursor: 'pointer',
    fontWeight: 'bold',
    borderRadius: 3,
    padding: '0.25em 0.6em',
    margin: '0 0.3em',
    flexGrow: 1,
    display: 'inline-block',
    fontSize: '0.8em',
    color: 'white',
    textDecoration: 'none',
    overflow: 'hidden',
    maxHeight: '1.5em',
    minWidth: '1em',
    lineHeight: '1.42em'
  },
  buttonText: {
    verticalAlign: 'middle',
    marginLeft: '0.4em',
    WebkitUserSelect: 'none'
  },
  select: {
    fontSize: '1em',
    width: '100%',
    height: '3em',
    margin: '0 0.2em'
  },
  selectLabel: {
    color: indigo50,
    lineHeight: '3em',
    top: '-0.5em'
  },
  selectIcon: {
    top: '0em',
    height: '2em',
    width: '2em'
  },
  syncToggle: {
    marginLeft: '6px'
  },
  dialogTitle: {
    lineHeight: '10px'
  },
  dialogBody: {
    padding: '24px'
  }
};

export default styles;
