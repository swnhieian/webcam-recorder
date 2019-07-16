import React, { Component } from 'react'
import './NameField.scss'

export default class NameField extends Component {

  saveName = (e) => {
    let name = document.getElementById("name").value;
    document.location.search = "name=" + name + "&sentence_index=0";
    this.props.socket.emit('client: start testing', {
      name,
      sentence_index: 0
    })
  }

  detectEnter = (e) => {
    if (e.which == 13) {
      this.saveName(e);
    }
  }


  render() {
    return (
      <div>
        <div className='name_input'>
          <input
            type='text'
            name='name'
            id='name'
            placeholder='Enter Name'
            onKeyPress={this.detectEnter}
          />
          <br/>
          <button className="btn btn-center" onClick={this.saveName}>Save Name</button>
        </div>
      </div>
    );
  }
}
