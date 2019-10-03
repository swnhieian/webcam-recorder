/**
 * **Based on: http://www.cssscript.com/demo/pure-css-css3-smooth-toggle-switch/**
 */

import React, { useEffect }from 'react'
import './toggle.scss'
import PropTypes from 'prop-types';

/**
 * 
 * @param {*} props 
 */
export default function Toggle(props) {
  useEffect(() => {
    const toggle = document.getElementById(props.id);
    try {
      toggle.addEventListener('change', () => {
        props.onChangeFunc(toggle.checked);
      });
    } catch (NotYetLoadedException) {
      //
    }
  }, [])
  return (
    <div className="switch">
      <input type="checkbox" name="toggle" id={props.id}/>
      <label htmlFor="toggle"><i></i></label>
    </div>  
  )
}

Toggle.propTypes = {
  id: PropTypes.string.isRequired,
  onChangeFunc: PropTypes.func.isRequired
}