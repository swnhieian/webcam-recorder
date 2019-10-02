import React from 'react'
import './toggle.scss'
import PropTypes from 'prop-types';

export default function Toggle(props) {
  return (
    <div className="switch">
      <input type="checkbox" name="toggle" id={props.id}/>
      <label htmlFor="toggle"><i></i></label>
      <span></span> 
    </div>
  )
}

Toggle.propTypes = {
  id: PropTypes.string.isRequired
}