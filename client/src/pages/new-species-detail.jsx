import React from "react";
import "../styles/newspeciesdetail.css";
import { logo, profile } from "../images";

import { Link } from "react-router-dom";


function NewSpeciesDetail() {
    const handleApprove = () => {
        // Add logic to handle approve action
        console.log('Approved');
    }

    // Define handleReject function
    const handleReject = () => {
        // Add logic to handle reject action
        console.log('Rejected');
    }
    return (
        <div className='newspeciesdetail-page-container'>
            <h2 className="newspeciesdetails-header">
                <div>
                    <Link to="/new-species">
                        <span className="material-icons back-arrow">arrow_back_ios</span>
                    </Link>
                    Checklist Details
                </div>
            </h2>

            <div className="newspeciesdetail-container">
                
                <span class="material-symbols-outlined" style={{ marginTop:".5rem" }}>
                    distance
                </span>
                <p className="newspeciesdetail-container-text">
                    Gyalpozhing Mongar Highway
                </p>
                
            </div>

            <div className='newspeciesdetail-container-table'>
                <table className="newspeciesdetail">
                    <thead >
                        <tr>
                            <th>Sl.no</th>
                            <th>Bird</th>
                            <th>Description</th>
                            <th>Count total</th>
                            <th>Photo</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-label="Sl.no" >1</td>
                            <td data-label="Bird" >Spotted Dov</td>
                            <td data-label="Description" >Sonam</td>
                            <td data-label="Count total" >2</td>
                            <td data-label="Photo" ><img src={logo} alt="Bird Photo" className='bird-img' /></td>
                            <td data-label="Action" >
                                <button className="reject-btn" onClick={() => handleReject()}>Reject</button>
                                <a href="/add-species"><button className="approve-btn" onClick={() => handleApprove()}>Approve</button></a>

                            </td>
                        </tr>
                        <tr>
                            <td data-label="Sl.no" >1</td>
                            <td data-label="Bird" >Spotted Dov</td>
                            <td data-label="Description" >Sonam</td>
                            <td data-label="Count total" >2</td>
                            <td data-label="Photo" ><img src={logo} alt="Bird Photo" className='newspecies-bird-img' /></td>
                            <td data-label="Action" >
                                <a href="/reject-request"><button className="newspecies-reject-btn" onClick={() => handleReject()}>Reject</button></a>
                                <a href="/add-species"><button className="newspecies-approve-btn" onClick={() => handleApprove()}>Approve</button></a>

                            </td>
                        </tr>                      
                    </tbody>

                </table>
            </div>
            <div className="newspeciesdetail-card-container" >
                <card className="newspeciesdetail-card-detail">
                    <article className="mt-10 mb-14 flex items-end justify-end">
                        <ul>
                            <li className="p-1 ">
                                <span className="font-bold">Species reported:</span> {3}
                            </li>
                            <li className="p-1 bg-gray-100">
                                <span className="font-bold">Duration</span> {"2hrs"}
                            </li>
                            <li className="p-1 ">
                                <span className="font-bold">Kilometer</span> {"3km"}
                            </li>
                            <li className="p-1 ">
                                <span className="font-bold">Altitude</span> {"1400m"}
                            </li>
                            <li className="p-1">
                                <div className="newspeciesdetail-detail-container">
                                    <span className="font-bold">Observer: </span>
                                    <img src={profile} className="newspeciesdetail-detail-profile" />
                                    <div className="newspeciesdetail-detail-text">
                                        <p className="newspeciesdetail-name">Wangchuk</p>
                                        <p className="newspeciesdetail-description">Nature photographer</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </article>
                </card>
            </div>


        </div>
    );
}
export default NewSpeciesDetail;
