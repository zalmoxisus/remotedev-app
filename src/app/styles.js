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
    minHeight: '27px',
    maxHeight: '27px',
    fontSize: '13px',
    overflow: 'hidden'
  },
  button: {
    cursor: 'pointer',
    fontWeight: 'bold',
    borderRadius: 3,
    padding: '2px 8px',
    margin: 'auto 2px',
    flexGrow: 1,
    display: 'inline-block',
    fontSize: '12px',
    color: 'white',
    textDecoration: 'none',
    overflow: 'hidden',
    maxHeight: '24px',
    minWidth: '10px',
    lineHeight: '22px',
    WebkitFontSmoothing: 'antialiased'
  },
  buttonText: {
    verticalAlign: 'middle',
    fontSize: '10px',
    lineHeight: '20px',
    marginLeft: '6px',
    WebkitUserSelect: 'none'
  },
  flatButton: {
    minWidth: '32px'
  },
  buttonLabel: {
    fontSize: '14px',
    paddingLeft: '8px',
    paddingRight: '8px'
  },
  input: {
    fontSize: '12px'
  },
  hint: {
    fontSize: '10px'
  },
  select: {
    fontSize: '1em',
    width: '100%',
    height: '3em',
    margin: '0 0.2em'
  },
  selectLabel: {
    color: indigo50,
    lineHeight: '2.7em',
    paddingLeft: '7px',
    paddingRight: '7px'
  },
  selectIcon: {
    top: '0.1em',
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
