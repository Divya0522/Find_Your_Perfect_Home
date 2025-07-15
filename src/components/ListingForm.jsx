
import React, { useState, useContext, useEffect } from "react";
import { FaHome, FaRupeeSign, FaMapMarkerAlt, FaCity, FaBed, FaBath, FaImage, FaTimes } from "react-icons/fa";
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const ListingForm = ({ onSubmit, initialData, onClose }) => {
  const { user } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    price: initialData?.price || "",
    address: initialData?.location?.address || "",
    description: initialData?.description || "",
    city: initialData?.city || "",
    sqfeet: initialData?.sqfeet || "",
    bedrooms: initialData?.bedrooms || "",
    bathrooms: initialData?.bathrooms || "",
    latitude: initialData?.location?.latitude || "",
    longitude: initialData?.location?.longitude || "",
    type: initialData?.property_type || "Rent",
    images: initialData?.images || [],
  });

  const handleClose = () => {
    setFormData({
      title: "",
      price: "",
      address: "",
      description: "",
      city: "",
      bedrooms: "",
      bathrooms: "",
      latitude: "",
      longitude: "",
      type: "Rent",
      images: [],
    });
    onClose();
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        price: initialData.price,
        address: initialData.location.address,
        description: initialData.description,
        city: initialData.city,
        bedrooms: initialData.bedrooms,
        bathrooms: initialData.bathrooms,
        sqfeet: initialData.sqfeet || "",
        latitude: initialData.location.latitude,
        longitude: initialData.location.longitude,
        type: initialData.property_type,
        images: initialData.images,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
      const response = await fetch('http://localhost:5001/api/properties/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const data = await response.json();
      const newUrls = Array.isArray(data.urls) ? data.urls : [data.urls];
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images,...newUrls],
      }));
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const settingsResponse = await fetch('http://localhost:5001/api/settings');
    const settings = await settingsResponse.json();
    const autoApprove = settings.find(setting => setting.name === 'listingAutoApproval')?.value === 'true';

    if (formData.latitude < -90 || formData.latitude > 90) {
      return alert("Latitude must be between -90 and 90 degrees");
    }
  
    if (formData.longitude < -180 || formData.longitude > 180) {
      return alert("Longitude must be between -180 and 180 degrees");
    }
    if (!formData.sqfeet || isNaN(formData.sqfeet)) {
      alert("Please enter a valid square footage");
      setIsSubmitting(false);
      return;
    }
    const cleanFormData = { ...formData };
    if (!initialData) {
      delete cleanFormData._id;
      delete cleanFormData.property_id;
    }
    const requiredFields = [
      'title', 'price', 'address', 'city',
      'bedrooms', 'bathrooms', 'latitude', 'longitude'
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]?.toString().trim());
    if (missingFields.length > 0) {
      return alert(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate numeric fields
    const numericFields = ['price', 'latitude', 'longitude', 'bedrooms', 'bathrooms'];
    const numericErrors = numericFields.filter((field) => {
      const value = formData[field];
      return value === '' || isNaN(value);
    });

    if (numericErrors.length > 0) {
      return alert(`Invalid numbers in: ${numericErrors.join(', ')}`);
    }

    if (!formData.images || formData.images.length === 0) {
      return alert("Please upload at least one image");
    }
    const formattedData = {
      title: formData.title,
      price: parseFloat(formData.price),
      location: {
        address: formData.address,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      },
      description: formData.description,
      city: formData.city,
      bedrooms: parseInt(formData.bedrooms, 10),
      bathrooms: parseInt(formData.bathrooms, 10),
      sqfeet: parseInt(formData.sqfeet, 10),
      property_type: formData.type,
      images: Array.isArray(formData.images) ? formData.images : [],
      user_id: user._id, 
    };

   

    try {
      const method = initialData ? "PUT" : "POST";
      const url = initialData
        ? `http://localhost:5001/api/properties/${initialData._id}`
        : "http://localhost:5001/api/properties";

      const response = await axios[method.toLowerCase()](url, formattedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        onSubmit(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Submission error:", error.response?.data);
      alert(`Error: ${error.response?.data?.message || "Server error"}`);
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="listing-form">
      {/* Form JSX remains the same */}
      <div className="listing-form">
    <div className="form-header">
       <h2>{initialData ? "Edit Listing" : "Create New Listing"}</h2>
     </div>
    


 <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
 <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
   {/* ... rest of your form content ... */}
  
 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
   <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full relative">
     <h2 className="text-2xl font-bold text-center mb-6">Create a New Listing</h2>
     <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Title */}
       <div className="form-group flex flex-col">
         <label className="font-medium flex items-center">
           <FaHome className="mr-2" /> Title
         </label>
         <input type="text" name="title" value={formData.title} onChange={handleChange} className="border rounded p-2" placeholder="Enter property title" required />
       </div>

       {/* Price */}
       <div className="form-group flex flex-col">
         <label className="font-medium flex items-center">
           <FaRupeeSign className="mr-2" /> Price
         </label>
         <input type="number" name="price" value={formData.price} onChange={handleChange} className="border rounded p-2" placeholder="Enter price" required />
       </div>

       {/* Address */}
       <div className="form-group flex flex-col">
         <label className="font-medium flex items-center">
           <FaMapMarkerAlt className="mr-2" /> Address
         </label>
         <input type="text" name="address" value={formData.address} onChange={handleChange} className="border rounded p-2" placeholder="Enter address" required />
       </div>

       {/* City */}
       <div className="form-group flex flex-col">
         <label className="font-medium flex items-center">
           <FaCity className="mr-2" /> City
        </label>
         <input type="text" name="city" value={formData.city} onChange={handleChange} className="border rounded p-2" placeholder="Enter city" required />
      </div>

       {/* Bedrooms */}
      <div className="form-group flex flex-col">
         <label className="font-medium flex items-center">
           <FaBed className="mr-2" /> Bedrooms
         </label>
        <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="border rounded p-2" placeholder="Enter bedrooms" required />
       </div>

      {/* Bathrooms */}
      <div className="form-group flex flex-col">
         <label className="font-medium flex items-center">
        <FaBath className="mr-2" /> Bathrooms
        </label>
        <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="border rounded p-2" placeholder="Enter bathrooms" required />
      </div>

      {/* Latitude */}      <div className="form-group flex flex-col">
          <label className="font-medium">Latitude</label>
        <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} className="border rounded p-2" placeholder="Enter latitude" min="-90"
    max="90"
    step="0.000001" required />
       </div>

     {/* Longitude */}
      <div className="form-group flex flex-col">
        <label className="font-medium">Longitude</label>
        <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} className="border rounded p-2" placeholder="Enter longitude" required     min="-180"
    max="180"
    step="0.000001" />       </div>       {/* Type */}
       <div className="form-group flex flex-col">
         <label className="font-medium">Type</label>
         <select name="type" value={formData.type} onChange={handleChange} className="border rounded p-2" required>
             <option value="Rent">Rent</option>
           <option value="Sale">Sell</option>
         </select>
       </div>

       <div className="form-group flex flex-col">
  <label className="font-medium">Square Feet</label>
  <input
    type="number"
    name="sqfeet"
    value={formData.sqfeet}
    onChange={handleChange}
    className="border rounded p-2"
    placeholder="Enter square feet"
    required
  />
</div>

{/* Image Upload */}
<div className="form-group flex flex-col md:col-span-2">
  <label className="font-medium flex items-center gap-2 mb-2">
    <FaImage className="mr-2" /> Upload Images
    <span className="text-sm text-gray-500">(Click to add more images)</span>
  </label>

  {/* Image Previews */}
  <div className="flex flex-wrap gap-4 mb-4">
    {formData.images.map((img, index) => (
      <div key={index} className="relative group">
        <div className="w-[200px] h-[200px] border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center p-1">
          <img
            src={img}
            alt={`Preview ${index + 1}`}
            className="object-contain w-full h-full"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            const newImages = [...formData.images];
            newImages.splice(index, 1);
            setFormData(prev => ({ ...prev, images: newImages }));
          }}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>
    ))}
  </div>

  {/* Upload Input */}
  <label className="flex items-center gap-2 cursor-pointer">
    <span className="border rounded-lg p-2 hover:bg-gray-50 transition-colors text-sm">
      Choose Files
    </span>
    <input
      type="file"
      name="images"
      onChange={handleImageChange}
      className="hidden"
      multiple
      required={formData.images.length === 0}
    />
    <span className="text-sm text-gray-500">Max size: 5MB per image</span>
  </label>
</div>
       {/* Description */}
       <div className="form-group flex flex-col md:col-span-2">
         <label className="font-medium">Description</label>
         <textarea name="description" value={formData.description} onChange={handleChange} className="border rounded p-2" placeholder="Enter property description" rows="4" required></textarea>
       </div>

       {/* Buttons */}
       <div className="form-actions flex justify-between w-full md:col-span-2">
         <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Create Listing'}</button>
         <button type="button" onClick={onClose} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition">Cancel</button>
       </div>
     </form>
   </div>
 </div>
 </div>
 </div>
   
   </div>
    </div>
  );
};

export default ListingForm;
