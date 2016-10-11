import React, { Component, PropTypes } from 'react';
import { Flex, Box } from 'reflexbox';
import Select from 'rebass/dist/Select';
import Slider from 'rebass/dist/Slider';
import Button from 'rebass/dist/Button';
import PlayButton from 'react-icons/lib/md/play-arrow';
import PauseButton from 'react-icons/lib/md/pause';
import LeftButton from 'react-icons/lib/md/keyboard-arrow-left';
import RightButton from 'react-icons/lib/md/keyboard-arrow-right';

const speedOptions = [
  { children: 'Live', value: 100 },
  { children: '1x', value: 600 },
  { children: '2x', value: 1200 }
];

export default class SliderMonitor extends React.Component {
  static propTypes = {
    showActions: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    liftedState: PropTypes.shape({
      computedStates: PropTypes.array,
      stagedActionIds: PropTypes.array,
      actionsById: PropTypes.object,
      currentStateIndex: PropTypes.number
    }).isRequired
  };

  state = {
    isPlaying: false,
    speed: 600
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state ||
      nextProps.showActions !== this.props.showActions ||
      nextProps.liftedState.currentStateIndex !== this.props.liftedState.currentStateIndex &&
      (
        nextProps.showActions ||
        this.props.liftedState.currentStateIndex < 1 ||
        nextProps.liftedState.currentStateIndex < 1
      ) ||
      nextProps.liftedState.currentStateIndex !== nextProps.liftedState.computedStates.length - 1 ||
      this.props.liftedState.currentStateIndex !== this.props.liftedState.computedStates.length - 1;
  }

  jumpToState(index, fromPlaying) {
    if (!fromPlaying && this.state.isPlaying) this.dismissPlay();
    this.props.dispatch({
      type: 'JUMP_TO_STATE',
      index
    });
  }

  handleSlider = (e) => {
    const limit = this.props.liftedState.computedStates.length - 1;
    if (limit < 1) return;
    const prevValue = this.props.liftedState.currentStateIndex;
    let value = (e.target.value / 100) * limit;
    if (prevValue < value) value = Math.ceil(value);
    else value = Math.floor(value);
    this.jumpToState(value);
  };

  handlePrev = () => {
    this.jumpToState(this.props.liftedState.currentStateIndex - 1);
  };

  handleNext = () => {
    this.jumpToState(this.props.liftedState.currentStateIndex + 1);
  };

  handlePlay = () => {
    if (this.state.isPlaying) {
      this.dismissPlay();
      return;
    }

    const { speed } = this.state;
    const lastIndex = this.props.liftedState.computedStates.length - 1;
    let index = this.props.liftedState.currentStateIndex;
    if (index === lastIndex) index = -1;
    this.timer = setInterval(() => {
      index++;
      if (index <= lastIndex) this.jumpToState(index, true);
      if (index >= lastIndex) this.dismissPlay();
    }, speed);
    this.setState({ isPlaying: true });
  };

  dismissPlay() {
    clearInterval(this.timer);
    this.setState({ isPlaying: false });
  }

  handleSpeedChange = (e) => {
    this.setState({ speed: e.target.value });
    if (this.state.isPlaying) this.dismissPlay();
  };

  render() {
    const { currentStateIndex, computedStates } = this.props.liftedState;
    const showActions = this.props.showActions && currentStateIndex !== -1;
    const value = computedStates.length < 2 ? 100 :
      (currentStateIndex / (computedStates.length - 1)) * 100;
    const isEnd = value === 100;
    const isBegin = value === 0 || currentStateIndex <= 0;
    let label = '';

    if (showActions) {
      const { actionsById, stagedActionIds } = this.props.liftedState;
      label = actionsById[stagedActionIds[currentStateIndex]].action.type;
    }

    return (
      <Flex style={{ padding: '20px 5px' }} align="center">
        <Box>
          <Button backgroundColor="transparent" p={0} onClick={this.handlePlay}>
            {this.state.isPlaying ?
              <PauseButton size={38}/> :
              <PlayButton size={38}/>
            }
          </Button>
        </Box>
        <Box flexAuto px={1} style={{ overflow: 'hidden' }}>
          <Slider
            label={label}
            value={value}
            onChange={this.handleSlider}
            name="slider-monitor"
            fill color="rgb(120, 144, 156)"
            style={{
              overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
              paddingBottom: showActions ? '13px' : '0'
            }}
          />
        </Box>
        <Box>
          <Button
            backgroundColor="transparent" p={0} style={isBegin && { display: 'none' }}
            onClick={this.handlePrev}
          >
            <LeftButton size={36} />
          </Button>
        </Box>
        <Box>
          <Button
            backgroundColor="transparent" p={0} style={isEnd && { display: 'none' }}
            onClick={this.handleNext}
          >
            <RightButton size={36} />
          </Button>
        </Box>
        <Box>
          <Select
            label="" name="select_speed"
            options={speedOptions}
            value={this.state.speed}
            onChange={this.handleSpeedChange}
            style={{ marginBottom: '0' }}
          />
        </Box>
      </Flex>
    );
  }
}
