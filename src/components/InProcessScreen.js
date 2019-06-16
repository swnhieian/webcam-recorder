import React from 'react'
import PropTypes from 'prop-types';

export default function InProcessScreen(props) {
  function updateSentence() {
    props.updateSentence("$next")
  }
  return (
    <div className="in_process_container">
      <div className='testing_content sentence_to_be_read'>{props.curr_sentence}</div>
      <button className="btn" onClick={updateSentence}>Next</button>
    </div>
  );
}

InProcessScreen.propTypes = {
  curr_sentence: PropTypes.string.isRequired,
  updateSentence: PropTypes.func.isRequired
};
