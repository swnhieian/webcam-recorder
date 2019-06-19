import React, { Component } from 'react'
import './NameField.scss'
import PropTypes from 'prop-types';

export default class NameField extends Component {

  handleChange = () => {
    console.log('')
  }

  render() {
    return (
      <div>
        <form action=''>
          <div className='name_input'>
            <div className='left'>
              <input
                type='text'
                name='name'
                id='name'
                placeholder='Full Name'
                onChange={this.handleChange}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
