import React, { Component } from 'react'
import Play from '../../assets/svg/play.svg';
import './Actions.scss'

export default class Actions extends Component {
  render() {
    return (
      <div>
        <div className='actions'>
          <div id='play'>
            <img src={Play} alt='' className='action_btn' />
          </div>
          <div id='retry' className='action_btn'>
            Retry
          </div>
          <div id='delete' className='action_btn'>
            Delete
          </div>
        </div>
      </div>
    );
  }
}
