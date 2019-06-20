import React, { Component } from 'react'
import './NameField.scss'
import PropTypes from 'prop-types';

export default class NameField extends Component {

  saveName = (e) => {
    let name = document.getElementById("name").value;
    document.location.search = name + "&sentence_index=0";
  }

  qs = (function (a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
      var p = a[i].split('=', 2);
      if (p.length == 1)
        b[p[0]] = "";
      else
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
  })(window.location.search.substr(1).split('&'));

  render() {
    return (
      <div>
        <form action=''>
          <div className='name_input'>
            <input
              type='text'
              name='name'
              id='name'
              placeholder={this.qs['name']}
            />
            <button onClick={this.saveName}>Save Name</button>
          </div>
        </form>
      </div>
    );
  }
}
