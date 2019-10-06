import React, { Component } from 'react'
import './NameField.scss'
import PropTypes from 'prop-types';

export default class NameField extends Component {
  saveName = () => {
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
    this.props.socket.emit('client: update recording progress', 0);
    this.props.socket.emit('client: save total time', [0,0,0]);
    this.props.socket.emit('client: save total start time', new Date())
    this.props.updateTesterContents();
    this.props.updateGreenLightStatus(true);
    
  }

  isNameEmpty = () => {
    try {
      return !document.getElementById("name").value.replace(/\s/g, '').length
    }
    catch (NotYetLoadedException) {
      //
    }
  }

  detectEnter = (e) => {
    if (!this.isNameEmpty()) {
      if (e.which === 13) {
        this.saveName(e);
      } 
    } else {
      document.getElementById('nameNotFilled').innerText='请输入名字'
    }
  }

  startBtn = (e) => {
    if (!this.isNameEmpty()) {
      if (!e.buttons) {
        this.saveName(document.getElementById("name").value);
      }
    } else {
      document.getElementById('nameNotFilled').innerText = '请输入名字'
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
            placeholder='输入名字（拼音）'
            onKeyPress={this.detectEnter}
            autoFocus
            required
          />
          <br/>
          <button className="btn btn-center" onClick={this.startBtn}>开始实验</button>
          {(this.isNameEmpty()) && <p className="warning_message" id="nameNotFilled"></p>}
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