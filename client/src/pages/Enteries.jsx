import React, { useState } from 'react';
import "../styles/enteries.css";
import { logo } from "../images";


function Enteries() {
    
    return (
        <div>
            <div className="button-container">
                <button className="export-button">Export Data</button>
            </div>
            <h2>Total Enteries <span className="enteries-count">(700)</span></h2>
            <div className='enteries-page-container'>
                <div className="enteries-filter-container">
                    <input type="text" className="enteries-search-bar" placeholder="Search" />
                    <select className="enteries-filter-dropdown">
                        <option value="">Birder</option>
                        <option value="1">option 1</option>
                        <option value="2">option 2</option>
                        <option value="3">option 3</option>
                    </select>
                    <select className="enteries-filter-dropdown">
                        <option value="">Date</option>
                        <option value="1">option 1</option>
                        <option value="2">option 2</option>
                        <option value="3">option 3</option>
                    </select>
                    <select className="enteries-filter-dropdown">
                        <option value="">District</option>
                        <option value="1">option 1</option>
                        <option value="2">option 2</option>
                        <option value="3">option 3</option>
                    </select>
                    <select className="enteries-filter-dropdown">
                        <option value="">Birding site</option>
                        <option value="1">option 1</option>
                        <option value="2">option 2</option>
                        <option value="3">option 3</option>
                    </select>


                </div>
                <div className='enteries-table'>
                    <div>
                        <table className="custom-table">
                            <thead >
                                <tr>
                                    <th>Sl.no</th>
                                    <th>English Name</th>
                                    <th>Birder</th>
                                    <th>Birding Site</th>
                                    <th>Data/Time</th>
                                    <th>Photo</th>
                                    <th>Numbers observed</th>
                                </tr>
                            </thead>
                            

                            <tbody>
                                <tr>
                                    <td className='custom-td'>1</td>
                                    <td className='custom-td'>Spotted Dov</td>
                                    <td className='custom-td'>Sonam</td>
                                    <td className='custom-td'>Gyalpozhing,Mongar highway</td>
                                    <td className='custom-td'>10.12.2022</td>
                                    <td className='custom-td'><img src={logo} alt="Bird Photo" className='bird-img' /></td>
                                    <td className='custom-td'>2 male</td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td className='custom-td'>1</td>
                                    <td className='custom-td'>Spotted Dov</td>
                                    <td className='custom-td'>Sonam</td>
                                    <td className='custom-td'>Gyalpozhing,Mongar highway</td>
                                    <td className='custom-td'>10.12.2022</td>
                                    <td className='custom-td'><img src={logo} alt="Bird Photo" className='bird-img' /></td>
                                    <td className='custom-td'>2 male</td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td className='custom-td'>1</td>
                                    <td className='custom-td'>Spotted Dov</td>
                                    <td className='custom-td'>Sonam</td>
                                    <td className='custom-td'>Gyalpozhing,Mongar highway</td>
                                    <td className='custom-td'>10.12.2022</td>
                                    <td className='custom-td'><img src={logo} alt="Bird Photo" className='bird-img' /></td>
                                    <td className='custom-td'>2 male</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default Enteries;