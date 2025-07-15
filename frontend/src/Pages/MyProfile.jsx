import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';


function MyProfile() {
  const { userData, setUserData, backendUrl, token } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  const updateUserProfileUpdate = async () => {
    try {
      const formData = new FormData();
      if (image) formData.append('image', image);
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);
      formData.append("address", JSON.stringify(userData.address));

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token,
        },
      });

      if (data.success) {
        setUserData(data.user);
        setImage(null);
        setIsEdit(false);
        window.location.reload(); 
      }
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  return (
    userData && (
      <div className="max-w-2xl w-full p-4 md:p-6 bg-white rounded-lg">
        {/* Profile Image */}
        <div className="flex flex-col items-start">
          {isEdit ? (
            <label htmlFor="image" className="cursor-pointer">
              <div className="relative w-32 h-32 md:w-44 md:h-44">
                <img
                  className="w-full h-full object-cover rounded"
                  src={image ? URL.createObjectURL(image) : userData.image || assets.upload_icon}
                  alt="Profile"
                />
              </div>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                accept="image/*"
                hidden
              />
            </label>
          ) : (
            <img
              className="w-32 h-32 md:w-44 md:h-44 rounded object-cover"
              src={userData.image || assets.upload_icon}
              alt="Profile"
            />
          )}

          {isEdit ? (
            <input
              className="text-2xl md:text-3xl mt-3 font-medium border px-2 py-1 rounded w-full text-left"
              type="text"
              value={userData.name}
              onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
            />
          ) : (
            <p className="text-2xl md:text-3xl font-semibold mt-3 text-gray-600 text-left">
              {userData.name}
            </p>
          )}
        </div>

        <hr className="my-4 border-t border-gray-300" />

        {/* Contact Information */}
  <div className="space-y-4">
        <p className="text-lg font-medium text-gray-600 underline uppercase">Contact Information</p>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-gray-700">
          <p className="font-medium">Email:</p>
          <p className="break-words text-left text-blue-500">{userData.email}</p>

          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input 
              className="border px-3 py-2 rounded w-full text-left text-blue-500" 
              type="text" 
              value={userData.phone} 
              onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} 
            />
          ) : (
            <p className="break-words text-left text-blue-500">{userData.phone}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <div className="space-y-2">
              <input 
                className="border px-3 py-2 rounded w-full text-left" 
                type="text" 
                value={userData.address.line1}
                onChange={e => setUserData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, line1: e.target.value } 
                }))} 
              />
              <input 
                className="border px-3 py-2 rounded w-full text-left" 
                type="text" 
                value={userData.address.line2}
                onChange={e => setUserData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, line2: e.target.value } 
                }))} 
              />
            </div>
          ) : (
            <p className="break-words text-left">
              {userData.address?.line1}<br />{userData.address?.line2}
            </p>
          )}
        </div>
      </div>
        {/* Basic Information */}
        <div className="mt-6 space-y-4">
          <p className="text-lg font-medium text-gray-600 underline uppercase">Basic Information</p>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-gray-700">
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                className="border px-3 py-2 rounded w-full text-left"
                value={userData.gender}
                onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="break-words text-left">{userData.gender}</p>
            )}

            <p className="font-medium">Date of Birth:</p>
            {isEdit ? (
              <input
                className="border px-3 py-2 rounded w-full text-left"
                type="date"
                value={userData.dob}
                onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
              />
            ) : (
              <p className="break-words text-left">
                {userData.dob ? new Date(userData.dob).toLocaleDateString() : 'N/A'}
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-10 flex justify-start">
          <button
            className="px-6 py-2 md:px-8 md:py-2 rounded-full border font-medium transition duration-300 text-left hover:bg-blue-50"
            onClick={() => {
              if (isEdit) updateUserProfileUpdate();
              else setIsEdit(true);
            }}
          >
            {isEdit ? 'Save Information' : 'Edit'}
          </button>
        </div>
      </div>
    )
  );
}

export default MyProfile;
