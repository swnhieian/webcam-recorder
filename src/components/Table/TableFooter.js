import React, { Component } from 'react'
import './TableFooter.scss'
import PageNum from './PageNum.js'
import next from '../../assets/svg/collapse-chevron.svg'
import prev from '../../assets/svg/expand-chevron.svg';
import PropTypes from 'prop-types';

export default class TableFooter extends Component {
  render() {
    let curr_page = this.props.curr_page;
    let nums = []
    for (let i = 1; i < 9; i++) {
      let selected = false;
      if (i === 1) {
        selected = true;
      }
      nums.push(<PageNum num={i} selected={selected} key={i}/>);
    }

    return (
      <div>
        <div className='table_header_footer'>
          <div className='table_footer'>
            <div className='left_footer'>
              <form action=''>
                <label htmlFor='page'>Page:</label>
                <input type='text' value={curr_page} />
              </form>
            </div>
            <div className='right_footer'>
              <img
                src={prev}
                alt=''
                className='small_btn'
                onClick={() => this.props.updatePage(curr_page - 1)}
              />
              {nums}
              <p>...</p>
              <PageNum num={20} selected={false} />
              <img
                src={next}
                alt=''
                className='small_btn'
                onClick={() => this.props.updatePage(curr_page + 1)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TableFooter.propTypes = {
  updatePage: PropTypes.func.isRequired,
  curr_page: PropTypes.number.isRequired
};