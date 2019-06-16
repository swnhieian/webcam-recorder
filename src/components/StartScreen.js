import React from 'react';
import PropTypes from 'prop-types';

export default function StartScreen(props) {
  function handleClick() {
    props.updateSentence(props.first_sentence);
    setStartStateOnServer();
  }

  function setStartStateOnServer() {
    fetch('http://192.168.0.102:5000/start_testing')
      .then((res) => {
        console.log(res);
      });
  }

  function nameFilled() {
    return props.first_name.length === 0 || props.last_name.length === 0;
  }

  return (
    <div className='test_container'>
      <button
        id='btn_start_test'
        className='btn'
        onClick={handleClick}
        disabled={nameFilled()}
      >
        Start Testing
      </button>
      <p hidden={!nameFilled()} className='warning_message'>
        Please enter first name and last name before starting.
      </p>
    </div>
  );
}

StartScreen.propTypes = {
  updateSentence: PropTypes.func.isRequired,
  first_sentence: PropTypes.string.isRequired,
  first_name: PropTypes.string.isRequired,
  last_name: PropTypes.string.isRequired
};
