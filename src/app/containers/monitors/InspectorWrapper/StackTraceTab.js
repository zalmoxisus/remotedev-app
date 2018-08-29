import React, { Component, PropTypes } from 'react';
import Stacktrace from "stacktrace-js";


// Inlined function from https://github.com/shokai/deserialize-error
function deserializeError (obj) {
    if (!isSerializedError(obj)) return obj
    return Object.assign(new Error(), {stack: undefined}, obj)
}

export function isSerializedError (obj) {
    return obj &&
        typeof obj === 'object' &&
        typeof obj.name === 'string' &&
        (typeof obj.message === 'string' || typeof obj.stack === 'string')
}



export default class StackTraceTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stackFrames : []
        };
    }
    componentDidMount() {
        //console.log("StackTraceTab mounted");
        this.checkForStackTrace();
    }

    componentDidUpdate(prevProps) {
        const {action, actions} = prevProps;

        if(action !== this.props.action || actions !== this.props.actions) {
            this.checkForStackTrace();
        }
    }

    checkForStackTrace() {
        const {action, actions : liftedActionsById} = this.props;

        if(!action) {
            return;
        }

        const liftedActions = Object.values(liftedActionsById);
        const liftedAction = liftedActions.find(liftedAction => liftedAction.action === action);


        if(liftedAction && liftedAction.stack) {
            const deserializedError = deserializeError(liftedAction.stack);

            Stacktrace.fromError(deserializedError)
                .then(stackFrames => {
                    //console.log("Stack frames: ", stackFrames);
                    this.setState({stackFrames});
                })
        }
        else {
            this.setState({stackFrames : []})
        }
    }


    render() {
        //const contents = JSON.stringify(this.props);

        //console.log("Stack trace props: ", this.props);

        const {stackFrames} = this.state;

        const renderedFrames = stackFrames.map( (stackFrame, i) => {
            return <div key={i}>{stackFrame.toString()}</div>;
        })

        return (
            <div>
                Stack trace:
                {renderedFrames}
            </div>
        )
    }
}