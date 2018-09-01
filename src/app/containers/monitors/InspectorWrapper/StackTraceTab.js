import React, { Component, PropTypes } from 'react';
import Stacktrace from "stacktrace-js";
import ErrorStackParser from "error-stack-parser";


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
                    this.setState({stackFrames, currentError : deserializedError});
                })
        }
        else {
            this.setState({stackFrames : []})
        }
    }

    onStackFrameClicked = (i) => {
        const stackFrame = this.state.stackFrames[i];

        if(stackFrame) {
            const parsedFramesNoSourcemaps = ErrorStackParser.parse(this.state.currentError)
            //console.log("Parsed stack frames: ", parsedFramesNoSourcemaps);

            if(chrome && chrome.devtools.panels.openResource) {
                const frameWithoutSourcemap = parsedFramesNoSourcemaps[i];
                const {fileName, lineNumber} = frameWithoutSourcemap;
                //console.log("Parsed stack frame: ", stackFrame);
                //console.log("Original stack frame: ", frameWithoutSourcemap);

                const adjustedLineNumber = Math.max(lineNumber - 1, 0);


                chrome.devtools.panels.openResource(fileName, adjustedLineNumber, (...callbackArgs) => {
                    //console.log("openResource callback args: ", callbackArgs);
                    //console.log("Testing");
                });
            }
        }
    }


    render() {
        const {stackFrames} = this.state;
        //console.log("Stack frames: ", stackFrames);
        //console.log("Props: ", this.props);

        let renderedFrames;

        if(stackFrames.length > 0) {
            renderedFrames = stackFrames.map( (stackFrame, i) => {
                return (
                    <div key={i}>
                        <a href="#" onClick={() => this.onStackFrameClicked(i)}>
                            {stackFrame.toString()}
                        </a>
                    </div>
                );
            })
        }
        else {
            renderedFrames = "No stack trace available";
        }

        return (
            <div>
                <h2>Stack Trace</h2>
                {renderedFrames}
            </div>
        )
    }
}