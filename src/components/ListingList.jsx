
// import React, { useState } from 'react';

// const ListingList = ({ listings, onEdit, onViewDetails, onDelete, onSave }) => {
//   const [showMenu, setShowMenu] = useState(null);

//   const toggleMenu = (index) => {
//     setShowMenu(showMenu === index ? null : index);
//   };

//   return (
//     <div className="results">
//       {listings.length > 0 ? (
//         listings.map((listing, index) => (
//           <div key={index} className="property-card">
//             <div className="property-card-header">
//               <div className="property-menu">
//                 <button className="menu-toggler" onClick={() => toggleMenu(index)}>
//                 ☰ 
//                 </button>
//                 {showMenu === index && (
//                   <div className="dropdown-menu">
//                     <button onClick={() => onViewDetails(listing)}>View Listings</button>
//                     <button onClick={() => onEdit(listing)}>Edit Listings</button>
//                     <button onClick={() => onDelete(listing._id)}>Delete Listings</button>
//                     <button onClick={() => onSave(listing)}>Save Listings</button>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <img
//               src={listing.images.length > 0 ? listing.images[0] : "/placeholder.jpg"}
//               alt={listing.title}
//               className="property-image"
//             />
//             <div className="property-info">
//               <h2>{listing.title}</h2>
//               <p>{listing.description}</p>
//               <p><strong>Bedrooms:</strong> {listing.bedrooms} | <strong>Bathrooms:</strong> {listing.bathrooms}</p>
//               <p><strong>City:</strong> {listing.location.address}</p>
//               <p><strong>Price:</strong> ${listing.price.toLocaleString()}</p>
//               <div className="property-actions">
//                 <button className="view-details-button" onClick={() => onEdit(listing)}>
//                   Edit
//                 </button>
//                 <button className="view-details-button" onClick={() => onViewDetails(listing)}>
//                   View Details
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="no-results">No properties found</p>
//       )}
//     </div>
//   );
// };

// export default ListingList;

import React, { useState } from 'react';
import { FaRupeeSign } from 'react-icons/fa';

const ListingList = ({ listings, onEdit, onViewDetails, onDelete, onSave }) => {
  const [showMenu, setShowMenu] = useState(null);

  const toggleMenu = (index) => {
    setShowMenu(showMenu === index ? null : index);
  };

  return (
    <div className="results">
      {listings.length > 0 ? (
        listings.map((listing, index) => (
          <div key={index} className="property-card">
            <div className="property-card-header">
              <div className="property-menu">
                <button className="menu-toggler" onClick={() => toggleMenu(index)}>
                ☰ 
                </button>
                {showMenu === index && (
                  <div className="dropdown-menu">
                    <button onClick={() => onEdit(listing)}>Edit Listings</button>
                    <button onClick={() => onDelete(listing._id)}>Delete Listings</button>
                    <button onClick={() => onSave(listing)}>{listing.saved ? 'Unsave' : 'Save'} Listing</button>
                  </div>
                )}
              </div>
            </div>
            <img
              src={listing.images.length > 0 ? listing.images[0] : "/placeholder.jpg"}
              alt={listing.title}
              className="property-image"
            />
            <div className="property-info">
              <h2>{listing.title}</h2>
              <p>{listing.description}</p>
              <p><strong>Bedrooms:</strong> {listing.bedrooms} | <strong>Bathrooms:</strong> {listing.bathrooms}</p>
              <p><strong>City:</strong> {listing.location.address}</p>
              <p><strong>Price:</strong> <FaRupeeSign/>{listing.price.toLocaleString()}</p>
              <div className="property-actions">
                <button className="view-details-button" onClick={() => onViewDetails(listing)}>
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="no-results">No properties found</p>
      )}
    </div>
  );
};

export default ListingList;