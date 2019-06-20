import React, { Component } from 'react'
import './NameField.scss'
import qs from '../../utils/qs'

export default class NameField extends Component {

  saveName = (e) => {
    let name = document.getElementById("name").value;
    document.location.search = name + "&sentence_index=0";
  }


  render() {
    return (
      <div>
        <form action=''>
          <div className='name_input'>
            <input
              type='text'
              name='name'
              id='name'
              placeholder={qs['name']}
            />
            <button onClick={this.saveName}>Save Name</button>
          </div>
        </form>
      </div>
    );
  }
}
