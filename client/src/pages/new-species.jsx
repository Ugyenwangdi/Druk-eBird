import { useState } from 'react';
import { Link } from 'react-router-dom';

import "../styles/newspecies.css";

function NewSpecies() {

  return (
    <div className='new-species-page-container'>
      <div className="newspecies-button-container">
        <button className="newspecies-export-button">Export Data</button>
      </div>
      <h2>Total Checklist <span className="newspecies-count">(700)</span></h2>
      <div className='newspecies-page-container'>
        <div className="newspecies-filter-container">
          <select className="newspecies-filter-dropdown">
            <option value="">Birder</option>
            <option value="1">option 1</option>
            <option value="2">option 2</option>
            <option value="3">option 3</option>

          </select>
          <select className="newspecies-filter-dropdown">
            <option value="">Birding site</option>
            <option value="1">option 1</option>
            <option value="2">option 2</option>
            <option value="3">option 3</option>
          </select>
          <select className="newspecies-filter-dropdown">
            <option value="">Date/Time</option>
            <option value="1">option 1</option>
            <option value="2">option 2</option>
            <option value="3">option 3</option>
          </select>
          <select className="newspecies-filter-dropdown">
            <option value="">District</option>
            <option value="1">option 1</option>
            <option value="2">option 2</option>
            <option value="3">option 3</option>
          </select>
          <select className="newspecies-filter-dropdown">
            <option value="">Gewog</option>
            <option value="1">option 1</option>
            <option value="2">option 2</option>
            <option value="3">option 3</option>
          </select>
          <select className="newspecies-filter-dropdown">
            <option value="">Chiwog</option>
            <option value="1">option 1</option>
            <option value="2">option 2</option>
            <option value="3">option 3</option>
          </select>
        </div>
      </div>

      <div>
        <Link to="/new-species-detail" className='newspecies-link'>
          <div>
            <table className='newspecies-table'>
              <thead className='main-head'>
                <tr>
                  <th >Sl.no</th>
                  <th>Birder</th>
                  <th>Birding site</th>
                  <th>Data/Time</th>
                  <th>District</th>
                  <th>Gewog</th>
                  <th>Chiwog</th>
                </tr>
              </thead>
              <tbody>
                
                <td data-label='Birder' className="data">#Birder</td>
                <td data-label='Birding site' className="data">Gyalpozhing,Mongar</td>
                <td data-label='Date/Time' className="data">10.08.2022</td>
                <td data-label='District' className="data">Mongar</td>
                <td data-label='Gewog' className="data">Gyalppozhing</td>
                <td data-label='Chiwog' className="data">Gyalpozhing</td>
              </tbody>
            </table>
          </div>
        </Link>
      </div>

      <div>
        <Link to="/new-species-detail" className='newspecies-link'>
          <div>
            <table className='newspecies-table'>
              <tbody>
                <td data-label='Birder' className="data">#Birder</td>
                <td data-label='Birding site' className="data">Gyalpozhing,Mongar</td>
                <td data-label='Date/Time' className="data">10.08.2022</td>
                <td data-label='District' className="data">Mongar</td>
                <td data-label='Gewog' className="data">Gyalppozhing</td>
                <td data-label='Chiwog' className="data">Gyalpozhing</td>
              </tbody>
            </table>
          </div>
        </Link>
      </div>
      <div>
        <Link to="/new-species-detail" className='newspecies-link'>
          <div>
            <table className='newspecies-table'>
              <tbody>
                <td data-label='Birder' className="data">#Birder</td>
                <td data-label='Birding site' className="data">Gyalpozhing,Mongar</td>
                <td data-label='Date/Time' className="data">10.08.2022</td>
                <td data-label='District' className="data">Mongar</td>
                <td data-label='Gewog' className="data">Gyalppozhing</td>
                <td data-label='Chiwog' className="data">Gyalpozhing</td>
              </tbody>
            </table>
          </div>
        </Link>
      </div>

    </div>

  );

}

export default NewSpecies;