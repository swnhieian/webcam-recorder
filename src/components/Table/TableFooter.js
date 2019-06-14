import React, { Component } from 'react'
import './TableFooter.scss'
import PageNum from './PageNum.js'
import next from '../../assets/svg/collapse-chevron.svg'
import prev from '../../assets/svg/expand-chevron.svg';
import PropTypes from 'prop-types';
import PageInput from './PageInput.js'
export default class TableFooter extends Component {

  
  updatePage=(page_num) => {
    this.props.updatePage(page_num);

  }

  render() {
    let curr_page = this.props.curr_page;
    let nums = [...Array(8).keys()];
    let nums_list = nums.map((i) => {
      i = i + 1;
      return <PageNum num={i} selected={curr_page === i} key={i} updatePage={this.props.updatePage}/>
    });

    return (
      <div>
        <div className='table_header_footer'>
          <div className='table_footer'>
            <div className='left_footer'>
              <PageInput updatePage={this.props.updatePage} curr_page={this.props.curr_page}/>
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
              <PageNum
                num={Number(((this.props.total_data + 1) / this.props.max_per_page + 1).toFixed(0))}
                selected={curr_page === 20}
                updatePage={this.props.updatePage}
              />
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
  total_data: PropTypes.number.isRequired,
  max_per_page: PropTypes.number.isRequired
};