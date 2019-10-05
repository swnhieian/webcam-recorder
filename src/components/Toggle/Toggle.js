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
      // document.getElementsByClassName('switch-wrapper')[0].addEventListener('mouseover', () => {
      //   document.getElementsByClassName('inset-toggle')[0].classList.add('switch-hover');
      //   console.log('hovered over')
      // });
      // document.getElementsByClassName('switch-wrapper')[0].addEventListener('mouseout', () => {
      //   document.getElementsByClassName('inset-toggle')[0].classList.remove('switch-hover');
      //   console.log('hovered out')
      // })
    } catch (NotYetLoadedException) {
      //
    }
  }, [])
  return (
    <div className="switch-wrapper">
      <div className="switch">
      <div className="invisible_pushdown"></div>
        <input type="checkbox" name="toggle" id={props.id}  checked={props.checked} onChange={props.updateDebugMode}/>
        <label htmlFor="toggle" className="inset-toggle"><i>🕷</i></label>
      </div>  
    </div>
  )
}

Toggle.propTypes = {
  id: PropTypes.string.isRequired,
  onChangeFunc: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  updateDebugMode: PropTypes.func.isRequired
}