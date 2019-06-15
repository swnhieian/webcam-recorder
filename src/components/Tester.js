import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './Tester.scss'
import PropTypes from 'prop-types';

function Tester(props) {
  function handleClick() {
    props.updateSentence(props.first_sentence);
    // console.log(props.first_sentence);
  }

  return (
    <div>
      <div className="start_screen">
        <div className="middle">
          <div className="inner">
            <button id="btn_start_test" onClick={ handleClick }>Start Testing</button>
          </div>
        </div>
      </div>
      <div className="testing_screen"></div>
    </div>
  )
}

Tester.propTypes = {
  updateSentence: PropTypes.func.isRequired,
  first_sentence: PropTypes.string.isRequired
};

export default Tester
