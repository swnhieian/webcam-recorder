import React, { Component } from 'react'
import './TableHeader.scss'

export default class TableHeader extends Component {
  render() {
    return (
      <div>
        <div className='table_header'>
          <div className='col table_item'>Sentence</div>
          <div className='col table_item'>Length</div>
          <div className='col table_item'>Actions</div>
        </div>
      </div>
    );
  }
}
