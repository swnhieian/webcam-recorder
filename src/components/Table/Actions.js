import React, { Component } from 'react'
import Play from '../../assets/svg/play.svg';
import './Actions.scss'

export default class Actions extends Component {
  render() {
    return (
      <div>
        <div className='actions'>
          <div id='play'>
            <img src={Play} alt='' className='btn' />
          </div>
          <div id='retry' className='btn'>
            Retry
          </div>
          <div id='delete' className='btn'>
            Delete
          </div>
        </div>
      </div>
    );
  }
}
