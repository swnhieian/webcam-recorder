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
        <form onSubmit={this.handleSubmit}>
          <label htmlFor='page'>Page:</label>
          <input
            type='text'
            value={this.props.curr_page}
            onChange={this.handleChange}
            className = 'debug_text_input'
          />
        </form>
      </div>
    );
  }
}

PageInput.propTypes = {
  updatePage: PropTypes.func.isRequired,
  curr_page: PropTypes.number.isRequired
}