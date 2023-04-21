import React from 'react';
import "../styles/AddSpecies.css";

function AddSpecies() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  }

  return (
    <div>
      <h2>Add Species</h2>
      <form onSubmit={handleSubmit}>
        <div class="speciescontainer">
          <div class="column1"><b>1. General Info</b></div>
          <div class="column2">
            <div>English Name</div>
            <input type="text" placeholder='Enter English Name'/>
            <div>Order</div>
            <input type="text" placeholder='Enter Order'/>
            <div>Genus</div>
            <input type="text" placeholder='Enter Genus'/>
            <div>Authority</div>
            <input type="text" placeholder='Enter Authority'/>
            <div>Dzongkha Name</div>
            <input type="text" placeholder='Enter Dzongkha Name'/>
            <div>Shar Name</div>
            <input type="text" placeholder='Enter Shar Name'/>
            <div>IUCN Status</div>
            <input type="text" placeholder='Enter IUCN Status'/>
            <div>Migratory/Non-migratory</div>
            <input type="text" placeholder='Enter Migratory/Non-migratory'/>
            <div>Species Description</div>
            <input class="description" type="text" placeholder='Enter Species Description'/>
          </div>
          <div class="column3">
            <div>Scientific Name</div>
            <input type="text" placeholder='Enter Scientific Name'/>
            <div>Family Name</div>
            <input type="text" placeholder='Enter Family Name'/>
            <div>Species</div>
            <input type="text" placeholder='Enter Species'/>
            <div>Group</div>
            <input type="text" placeholder='Enter Group'/>
            <div>Lho Name</div>
            <input type="text" placeholder='Enter Lho Name'/>
            <div>Kheng Name</div>
            <input type="text" placeholder='Enter Kheng Name'/>
            <div>Legislation</div>
            <input type="text" placeholder='Enter Legislation'/>
            <div>Waterbird/Landbird/Seabird</div>
            <input type="text" placeholder='Enter Waterbird/Landbird/Seabird'/>
            <div>No. of Observation</div>
              <div class="number-input">
                  <input class="observation-input" min="0" name="observations" value="0" type="number" />
              </div>
          </div>
        </div>
        <div class="speciescontainer">
            <div class="column1">2. Media</div>
            <div class="column2">
                <div>Image</div>
                <input type="file" accept="image/*" />
            </div>
            <div class="column3">
            </div>
        </div>
        <dix class="speciescontainer">
            <div className="button-container-addspecies">
                <button className="cancle-button">Cancle</button>
                <button className="addnew-button">Add Species</button>
            </div>
        </dix>
      </form>
    </div>
  );
}

export default AddSpecies;