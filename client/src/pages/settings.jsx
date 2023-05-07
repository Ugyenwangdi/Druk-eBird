import { useState } from "react";
import "../styles/settings.css";
import {logo} from "../images";

function Settings() {
    const [previewImage, setPreviewImage] = useState(logo);

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.addEventListener('load', () => {
          setPreviewImage(reader.result);
        });
    
        reader.readAsDataURL(file);
      };
    return (
        <div class="setting-box">
            <div class="form-container">
                <form>
                    <div class="form-group">
                        <label for="name">Name:</label>
                        <input type="text" id="name" name="name" class="form-input" placeholder="Name"></input>
                    </div>

                    <div class="form-group">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" class="form-input" placeholder="Email"></input>
                    </div>
                    <div class="profile-pic">
                        <img src={previewImage} id="photo"></img>
                        <input type="file" id="file" onChange={handleFileInputChange}></input>
                        <label for="file" id="uploadBtn">Choose Photo</label>
                    </div>
                    <div class="submit">
                        <button type="submit" class="form-button">Save Changes</button>
                    </div>
                </form>
            </div><br></br><br></br><br></br><br></br>
            <div class='parent'>
                <div class='box-1'><br></br>
                    <p style={{fontSize: '16px'}}>Password</p> <br></br>
                    <p style={{fontSize: '15px'}}>You can reset or change your password <br></br> by clicking here </p> <br></br>
                    <button type="submit" class="btn">Change</button>
                </div>
                <div class='box-2'><br></br>
                    <p style={{fontSize: '16px'}}>Deactivate account</p><br></br>
                    <p style={{fontSize: '15px'}}>Once you deactivate your account, there is no
                    going back please be certain</p> <br></br>
                    <button type="submit" class="deactivate-btn">Deactivate</button>
                </div>
            </div> <br></br><br></br>
            <div class="admin-button">
                <button type="submit" class="addAdmin-btn">Add Admin</button>
            </div>
            <br></br>
            {/* admin table */}
            <h3 style={{fontSize: '16px', textAlign: 'center'}}>Admins</h3> <br></br>
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td data-label="Name">Karma</td>
                        <td data-label="Email">12190056.gcit@rub.edu.bt</td>
                        <td data-label="Action"> <button class="deleteBtn">Delete</button></td>
                    </tr>
                </tbody>
            </table><br></br>
        </div>
    );
}
export default Settings;