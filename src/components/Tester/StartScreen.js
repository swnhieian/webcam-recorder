import React from 'react';
import PropTypes from 'prop-types';

export default function StartScreen(props) {

  function handleClick() {
    props.updateSentence(props.first_sentence);
  }

  return (
    <div className='test_container'>
      <button
        id='btn_start_test'
        className='btn'
        onClick={handleClick}
      >
        Start Testing
      </button>      
    </div>
  );
}

StartScreen.propTypes = {
  updateSentence: PropTypes.func.isRequired,
  first_sentence: PropTypes.string.isRequired,
};
