import React, { Component } from 'react'
import './TableFooter.scss'
import PageNum from './PageNum.js'
import next from '../../assets/svg/collapse-chevron.svg'
import prev from '../../assets/svg/expand-chevron.svg';

export default class TableFooter extends Component {
  render() {
    let nums = []
    for (let i = 1; i < 9; i++) {
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
            <div className='right_footer'>
              <img src={prev} alt='' className='small_btn' />
              {nums}
              <p>...</p>
              <PageNum num={20} />
              <img src={next} alt='' className='small_btn' />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
