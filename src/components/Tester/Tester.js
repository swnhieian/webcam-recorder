import React from 'react';
import './Tester.scss';
import PropTypes from 'prop-types';
import InProcessScreen from './InProcessScreen.js';
import { useEffect } from 'react';

function Tester(props) {
  
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
      <div className='middle'>
        <div className='inner'>{content(props)}</div>
      </div>
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
  updateGreenLightStatus: PropTypes.func.isRequired
};

export default Tester;
