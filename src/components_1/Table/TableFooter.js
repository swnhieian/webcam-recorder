import React, { Component } from 'react'
import './TableFooter.scss'
import PageNum from './PageNum.js'
import next from '../../assets/svg/collapse-chevron.svg'
import prev from '../../assets/svg/expand-chevron.svg';
import PropTypes from 'prop-types';
import PageInput from './PageInput.js'
import beg from '../../assets/svg/beg.svg'
import end from '../../assets/svg/end.svg';

export default class TableFooter extends Component {
  updatePage=(page_num) => {
    this.props.updatePage(page_num);
  }

  render() {
    let curr_page = this.props.curr_page;
    let max_per_page = this.props.max_per_page;
    let mid_point = Math.floor(max_per_page / 2)
    let max_page = Number(((this.props.total_data + 1) / this.props.max_per_page + 1).toFixed(0));
    let page_nums = Array.from(new Array(max_per_page), (x, i) => { 
      let min = 0;
      if (curr_page <= mid_point) {
        min = i;
      } else if (curr_page >= max_page - mid_point) {
        min = i + max_page - max_per_page;
      } else {
        min = i + curr_page - mid_point - 1;
      }
      return min;
    });
    let nums_list = page_nums.map((i) => {
      i = i + 1;
      return <PageNum num={i} selected={curr_page === i} key={i} updatePage={this.props.updatePage}/>
    });

    return (
      <div>
        <div className='table_header_footer'>
          <div className='table_footer'>
            <div className='left_footer'>
              <PageInput
                updatePage={this.props.updatePage}
                curr_page={this.props.curr_page}
              />
            </div>
            <div className='right_footer'>
              <img
                src={beg}
                alt=''
                className='small_btn'
                onClick={() => this.props.updatePage(1)}
              />
              <img
                src={prev}
                alt=''
                className='small_btn'
                onClick={() => this.props.updatePage(curr_page - 1)}
              />
              {nums_list}
              <img
                src={next}
                alt=''
                className='small_btn'
                onClick={() => this.props.updatePage(curr_page + 1)}
              />
              <img
                src={end}
                alt=''
                className='small_btn'
                onClick={() => this.props.updatePage(max_page)}
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
  total_data: PropTypes.number.isRequired,
  max_per_page: PropTypes.number.isRequired
};