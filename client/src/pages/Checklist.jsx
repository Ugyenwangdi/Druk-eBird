import { useState } from 'react';
import { Link } from 'react-router-dom';

import "../styles/checklist.css";

function Checklist() {

  // const[record,setRecord] = useState([])

  //  const getData = () =>
  //  {
  //      fetch('https://jsonplaceholder.typicode.com/users')
  //      .then(resposne=> resposne.json())
  //      .then(res=>setRecord(res))
  //  }

  //  useEffect(() => {
  //     getData();
  //  },)
  return (
    <div>
      <div className="button-container">
        <button className="export-button">Export Data</button>
      </div>
      <h2>Total Checklist <span className="checklist-count">(700)</span></h2>
      <div className='checklist-page-container'>
        <div className="checklist-filter-container">
          <select className="checklist-filter-dropdown">
            <option value="">Birder</option>
            <option value="1">option 1</option>
            <option value="2">option 2</option>
            <option value="3">option 3</option>

          </select>
          <select className="checklist-filter-dropdown">
            <option value="">Birding site</option>
            <option value="1">option 1</option>
            <option value="2">option 2</option>
            <option value="3">option 3</option>
          </select>
          <select className="checklist-filter-dropdown">
            <option value="">Date/Time</option>
            <option value="1">option 1</option>
            <option value="2">option 2</option>
            <option value="3">option 3</option>
          </select>
          <select className="checklist-filter-dropdown">
            <option value="">District</option>
            <option value="1">option 1</option>
            <option value="2">option 2</option>
            <option value="3">option 3</option>
          </select>
          <select className="checklist-filter-dropdown">
            <option value="">Gewog</option>
            <option value="1">option 1</option>
            <option value="2">option 2</option>
            <option value="3">option 3</option>
          </select>
          <select className="checklist-filter-dropdown">
            <option value="">Chiwog</option>
            <option value="1">option 1</option>
            <option value="2">option 2</option>
            <option value="3">option 3</option>
          </select>
        </div>
      </div>

      <div>
        <Link to="/checklist-detail" className='checklist-link'>
          <div>
            <table className='checklist-table'>
              <tbody>
                {/* uses this code while fetching data {record.slice(0, 5).map((output)=>
                            <tr>
                                <td>{output.id}</td>
                                <td>{output.name}</td>
                                <td>{output.email}</td>
                                <td>{output.username}</td>
                                <td>{output.website}</td>
                                <td></td>
                            </tr>                     */}
                <td className="custom-data">#Birder</td>
                <td className="custom-data">Gyalpozhing,Mongar</td>
                <td className="custom-data">10.08.2022</td>
                <td className="custom-data">Mongar</td>
                <td className="custom-data">Gyalppozhing</td>
                <td className="custom-data">Gyalpozhing</td>
              </tbody>
            </table>
          </div>
        </Link>
      </div>
      
      <div>
        <Link to="/checklist-detail" className='checklist-link'>
          <div>
            <table className='checklist-table'>
              <tbody>
                <td className="custom-data">#Birder</td>
                <td className="custom-data">Gyalpozhing,Mongar</td>
                <td className="custom-data">10.08.2022</td>
                <td className="custom-data">Mongar</td>
                <td className="custom-data">Gyalppozhing</td>
                <td className="custom-data">Gyalpozhing</td>
              </tbody>
            </table>
          </div>
        </Link>
      </div>
      <div>
        <Link to="/checklist-detail" className='checklist-link'>
          <div>
            <table className='checklist-table'>
              <tbody>
                <td className="custom-data">#Birder</td>
                <td className="custom-data">Gyalpozhing,Mongar</td>
                <td className="custom-data">10.08.2022</td>
                <td className="custom-data">Mongar</td>
                <td className="custom-data">Gyalppozhing</td>
                <td className="custom-data">Gyalpozhing</td>
              </tbody>
            </table>
          </div>
        </Link>
      </div>

    </div>

  );

}

export default Checklist;