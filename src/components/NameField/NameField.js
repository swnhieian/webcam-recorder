import React, { Component } from 'react'
import './NameField.scss'
import PropTypes from 'prop-types';

export default class NameField extends Component {

  saveName = (e) => {
    let name = document.getElementById("name").value;
    // document.location.search = "name=" + name + "&sentence_index=0";
    let url_state = '?name=' + name + '&sentence_index=0'
    window.history.pushState(
      null,
      null,
      url_state
    );
    
    this.props.socket.emit('client: start testing', {
      name,
      sentence_index: 0
    })
    this.props.socket.emit('client: dummy vid, do not save');
    this.props.socket.emit('client: update recording progress', {});
    this.props.updateTesterContents();
    this.props.updateGreenLightStatus(true);
    
  }

  detectEnter = (e) => {
    if (e.which === 13) {
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

NameField.propTypes = {
  socket: PropTypes.object.isRequired,
  updateTesterContents: PropTypes.func.isRequired,
  updateGreenLightStatus: PropTypes.func.isRequired,
};