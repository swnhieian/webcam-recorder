import React, { Component } from 'react'
import './NameField.scss'
import qs from '../../utils/qs'

export default class NameField extends Component {

  saveName = (e) => {
    let name = document.getElementById("name").value;
    document.location.search = "name=" + name + "&sentence_index=0";
    this.props.socket.emit('client: start testing', {
      name,
      sentence_index: 0
    })
  }


  render() {
    return (
      <div>
        <div className='name_input'>
          <input
            type='text'
            name='name'
            id='name'
            placeholder={qs['name']}
          />
          <button onClick={this.saveName}>Save Name</button>
        </div>
      </div>
    );
  }
}
