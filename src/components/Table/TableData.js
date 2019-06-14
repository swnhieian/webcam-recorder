import React, { Component } from 'react'
import Table_Row from './TableRow.js';

export default class TableData extends Component {
  render() {
    return (
      <div>
        <Table_Row
          sentence='this is a example sentence that is very long'
          time='34:29'
        />
        <Table_Row
          sentence='this is a example sentence that is very long'
          time='34:29'
        />
        <Table_Row
          sentence='this is a example sentence that is very long'
          time='34:29'
        />
        <Table_Row
          sentence='this is a example sentence that is very long'
          time='34:29'
        />
        <Table_Row
          sentence='this is a example sentence that is very long'
          time='34:29'
        />
      </div>
    );
  }
}
