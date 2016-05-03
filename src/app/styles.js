const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column nowrap'
  },
  modal: {
    content: { padding: 0, bottom: 'auto' },
    overlay: { zIndex: 1 }
  },
  window: {
    width: 'auto', height: 'auto'
  },
  logMonitor: {
    flexGrow: '1',
    position: 'relative'
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
    minHeight: '2em'
  },
  button: {
    cursor: 'pointer',
    fontWeight: 'bold',
    borderRadius: 3,
    padding: '0.25em 0.6em',
    margin: '0.3em',
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
  switchLabel: {
    paddingTop: '5px',
    paddingLeft: '60px',
    paddingRight: '10px'
  },
  viewForm: {
    padding: '5px',
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelForm: {
    padding: '0 5px',
    width: '80px',
    justifyContent: 'flex-end'
  },
  separator: {
    padding: '3px'
  },
  instances: {
    border: '1px solid #8A96A2',
    fontSize: '14px',
    fontFamily: 'monaco, Consolas, Lucida Console, monospace',
    backgroundColor: 'rgb(79, 90, 101)',
    color: '#fff',
    width: '100%',
    height: '27px',
    marginTop: '3px'
  },
  monitors: {
    width: '150px',
    marginRight: '3px'
  },
  syncToggle: {
    marginLeft: '10px',
    marginTop: '3px'
  }
};

export default styles;
