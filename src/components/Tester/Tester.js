import React from 'react';
import './Tester.scss';
import PropTypes from 'prop-types';
import InProcessScreen from './InProcessScreen.js';
import { Line } from 'rc-progress';

function Tester(props) {

  function comp_progressBar() {
    // const percent = 0;
    // console.log(this.state.curr_sentence_index);
    // if (this.state.curr_sentence_index) {
    const percent = (
      (props.curr_sentence_index / props.data.length) *
      100
    ).toFixed(2);
    return (
      <div id='progress_bar'>
        <pre>
          Progress: {props.curr_sentence_index} / {props.data.length - 1} ({percent}
          %)
        </pre>
        <Line
          percent={percent}
          strokeWidth='1.5'
          trailWidth='1.5'
          strokeColor='#2db7f5'
          trailColor='#D9D9D9'
        />
      </div>
    );
  }
  
  function content(props) {
    return (
      <InProcessScreen
        updateSentence={props.updateSentence}
        curr_sentence_index={props.curr_sentence_index}
        data_length={props.data_length}
        socket={props.socket}
        data={props.data}
        curr_sentence={props.curr_sentence}
        recordGreenLight={props.recordGreenLight}
        updateGreenLightStatus={props.updateGreenLightStatus}
        numFilesSaved={props.numFilesSaved}
        numCams={props.numCams}
      />
    );
  }

  return (
    <div className='testing_screen'>
      {comp_progressBar()}
      <div className='middle'>
        <div className='inner'>{content(props)}</div>
      </div>
      <pre
        hidden={props.recordGreenLight}
        className='warning_message'
      >
        Please Click Reset!
      </pre>
    </div>
  );
}

Tester.propTypes = {
  updateSentence: PropTypes.func.isRequired,
  curr_sentence_index: PropTypes.number.isRequired,
  curr_sentence: PropTypes.string.isRequired,
  data_length: PropTypes.number.isRequired,
  socket: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  recordGreenLight: PropTypes.bool.isRequired,
  updateGreenLightStatus: PropTypes.func.isRequired,
  numFilesSaved: PropTypes.number.isRequired,
  numCams: PropTypes.number.isRequired
};

export default Tester;
