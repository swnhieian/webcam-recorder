import React, { Component } from 'react'
import './NameField.scss'

export default class InputField extends Component {
  render() {
    return (
      <div>
        <form action=''>
          <div className="name_input">
            <div className="left">
              <label htmlFor='fName'>First Name: </label>
              <input
                type='text'
                name='fName'
                id='fName_input'
                placeholder=''
              />
            </div>
            <div className="right">
              <label htmlFor='lName'>Last Name: </label>
              <input
                type='text'
                name='lName'
                id='lName_input'
                placeholder=''
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
