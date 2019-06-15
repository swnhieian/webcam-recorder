import React, { Component } from 'react'
import './NameField.scss'
import PropTypes from 'prop-types';

export default class NameField extends Component {

  handleChange = () => {
    let first_name = document.getElementById('fName_input').value;
    let last_name = document.getElementById('lName_input').value;
    this.props.updateName(first_name, last_name);

  }
  render() {
    return (
      <div>
        <form action=''>
          <div className='name_input'>
            <div className='left'>
              <label htmlFor='fName'>First Name: </label>
              <input
                type='text'
                name='fName'
                id='fName_input'
                placeholder=''
                value={this.props.first_name}
                onChange={this.handleChange}
              />
            </div>
            <div className='right'>
              <label htmlFor='lName'>Last Name: </label>
              <input
                type='text'
                name='lName'
                id='lName_input'
                value={this.props.last_name}
                onChange={this.handleChange}
                placeholder=''
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

NameField.propTypes = {
  updateName: PropTypes.func.isRequired,
  first_name: PropTypes.string.isRequired,
  last_name: PropTypes.string.isRequired
}