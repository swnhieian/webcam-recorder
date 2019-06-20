import React from 'react';
import './Tester.scss';
import PropTypes from 'prop-types';
import StartScreen from './StartScreen.js';
import InProcessScreen from './InProcessScreen.js';

function Tester(props) {
  function content(props) {
    if (props.curr_sentence) {
      return (
        <InProcessScreen
          curr_sentence={props.curr_sentence}
          updateSentence={props.updateSentence}
          curr_sentence_index={props.curr_sentence_index}
          data_length={props.data_length}
          socket={props.socket}
        />
      );
    } else {
      return (
        <StartScreen
          updateSentence={props.updateSentence}
          first_sentence={props.first_sentence}
        />
      );
    }
  }

  return (
    <div>
      <div className='testing_screen'>
        <div className='middle'>
          <div className='inner'>{content(props)}</div>
        </div>
      </div>
    </div>
  );
}

Tester.propTypes = {
  updateSentence: PropTypes.func.isRequired,
  curr_sentence_index: PropTypes.number.isRequired,
  data_length: PropTypes.number.isRequired,
  first_sentence: PropTypes.string.isRequired,
  curr_sentence: PropTypes.string.isRequired,
  socket: PropTypes.object.isRequired
};

export default Tester;