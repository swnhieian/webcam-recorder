import React, { Component } from 'react'
import './TableFooter.scss'
import PageNum from './PageNum.js'

export default class TableFooter extends Component {
  render() {
    let nums = []
    for (let i = 1; i < 15; i++) {
      nums.push(<PageNum num={i}/>);
    }
    return (
      <div>
        <div className='table_header_footer'>
          <div className='table_footer'>
            <div className='left_footer'>
              <form action=''>
                <label htmlFor='page'>Page:</label>
                <input type='text' />
              </form>
            </div>
            <div className='right_footer'>{nums}</div>
          </div>
        </div>
      </div>
    );
  }
}
