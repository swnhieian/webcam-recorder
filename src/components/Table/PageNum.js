import React, { Component } from 'react'
import PropTypes from 'prop-types';

export default class PageNum extends Component {
  render() {
    return (
      <div className="page_num">
        {this.props.num}
      </div>
    )
  }
}

PageNum.propTypes = {
  num: PropTypes.string.isRequired
}