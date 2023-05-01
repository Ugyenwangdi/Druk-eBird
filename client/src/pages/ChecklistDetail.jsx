import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Card from "@material-ui/core/Card";
import "../styles/checklistDetail.css";
import { logo, profile } from "../images";


function ChecklistDetail() {
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
        <div className='page-container'>
            <div>
                <h2>Checklist Details</h2>
            </div>

            <div className="checklist-detail-container">
                <p className="checklist-detail-container-text">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />{" "}
                    Gyalpozhing-Mongar highway
                </p>
            </div>

            <div className='container-table'>
                <table className="checklist-detail">
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
                            <td data-label="Photo" ><img src={logo} alt="Bird Photo" className='bird-img' /></td>
                            <td data-label="Action" >
                                <a href="/reject-request"><button className="reject-btn" onClick={() => handleReject()}>Reject</button></a>
                                <a href="/add-species"><button className="approve-btn" onClick={() => handleApprove()}>Approve</button></a>

                            </td>
                        </tr>                      
                    </tbody>

                </table>
            </div>
            <div className="card-container">
                <Card className="card-detail">
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
                                <div className="detail-container">
                                    <span className="font-bold">Observer: </span>
                                    <img src={profile} className="detail-profile" />
                                    <div className="detail-text">
                                        <p className="name">Wangchuk</p>
                                        <p className="description">Nature photographer</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </article>
                </Card>
            </div>


        </div>
    );
}
export default ChecklistDetail;
