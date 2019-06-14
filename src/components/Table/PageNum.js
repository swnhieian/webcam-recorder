import React, { Component } from 'react'
import PropTypes from 'prop-types';

export default class PageNum extends Component {
  render() {
    return (
      <div
        className={
          this.props.selected ? 'page_num' : 'can_click_num page_num'
        }
      >
        {this.props.num}
      </div>
    );
  }
}

PageNum.propTypes = {
  num: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired
};