import React, { Component } from 'react'
import './TableFooter.scss'
import PageNum from './PageNum.js'
import next from '../../assets/svg/collapse-chevron.svg'
import prev from '../../assets/svg/expand-chevron.svg';
import PropTypes from 'prop-types';

export default class TableFooter extends Component {

  handleChange = (event) => {
    this.props.updatePage(Number(event.target.value));
  }
  
  render() {
    let curr_page = this.props.curr_page;
    let nums = [...Array(8).keys()];
    let nums_list = nums.map((i) => {
      i = i + 1;
      return <PageNum num={i} selected={curr_page === i} key={i}/>
    });

    return (
      <div>
        <div className='table_header_footer'>
          <div className='table_footer'>
            <div className='left_footer'>
              <form action='' >
                <label htmlFor='page'>Page:</label>
                <input type='text' value={this.props.curr_page} onChange={this.handleChange} />
              </form>
            </div>
            <div className='right_footer'>
              <img
                src={prev}
                alt=''
                className='small_btn'
                onClick={() => this.props.updatePage(curr_page - 1)}
              />
              {nums_list}
              <p>...</p>
              <PageNum num={20} selected={curr_page === 20} />
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
  curr_page: PropTypes.number.isRequired,
};