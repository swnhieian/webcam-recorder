import React, { Component } from 'react'
import PropTypes from 'prop-types';

export default class PageInput extends Component {
  handleChange = (event) => {
    this.props.updatePage(Number(event.target.value));
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }
  render() {
    return (
      <div>
        <div className='left_footer'>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor='page'>Page:</label>
            <input
              type='text'
              value={this.props.curr_page}
              onChange={this.handleChange}
            />
          </form>
        </div>
      </div>
    );
  }
}

PageInput.propTypes = {
  updatePage: PropTypes.func.isRequired,
  curr_page: PropTypes.number.isRequired
}