import React, { useEffect, useContext, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function Profile() {
  const { dToken, profileData, setProfileData, doctorProfile, backendUrl } = useContext(DoctorContext);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (dToken && !profileData) doctorProfile();
  }, [dToken]);

  const updateProfile = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        { docId: profileData._id, ...profileData },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success("Profile updated successfully");
        await doctorProfile(); 
        setIsEdit(false);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return profileData && (
    <div className="w-full p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center gap-4 mb-6">
        <img src={profileData.image} alt="Doctor" className="w-32 h-32 object-cover rounded border" />
        <div>
          <p className="text-xl font-semibold">{profileData.name}</p>
          <p className="text-gray-600">{profileData.degree}</p>
          <p className="text-gray-600">{profileData.speciality}</p>
          <span className="inline-block mt-1 px-2 py-1 text-sm bg-green-100 text-green-700 rounded">
            {profileData.experience} years experience
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium mb-1">About</h3>
        <p className="text-gray-700">{profileData.about}</p>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Appointment Fees:</label>
        {isEdit ? (
          <input
            type="number"
            className="border px-3 py-1 rounded w-32"
            value={profileData.fees}
            onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
          />
        ) : (
          <p className="text-blue-600">${profileData.fees}</p>
        )}
      </div>

      <div className="mb-4">
        <h4 className="font-medium">Address:</h4>
        {isEdit ? (
          <>
            <input
              type="text"
              className="border px-3 py-1 rounded w-full mb-2"
              placeholder="Line 1"
              value={profileData.address?.line1 || ''}
              onChange={(e) =>
                setProfileData(prev => ({
                  ...prev,
                  address: { ...prev.address, line1: e.target.value },
                }))
              }
            />
            <input
              type="text"
              className="border px-3 py-1 rounded w-full"
              placeholder="Line 2"
              value={profileData.address?.line2 || ''}
              onChange={(e) =>
                setProfileData(prev => ({
                  ...prev,
                  address: { ...prev.address, line2: e.target.value },
                }))
              }
            />
          </>
        ) : (
          <>
            <p className="text-gray-700">{profileData.address?.line1}</p>
            <p className="text-gray-700">{profileData.address?.line2}</p>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="checkbox"
          checked={profileData.available}
          onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
          className="w-4 h-4"
        />
        <label className="text-gray-800">Available</label>
      </div>

      <button
        onClick={isEdit ? updateProfile : () => setIsEdit(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isEdit ? 'Save' : 'Edit'}
      </button>
    </div>
  );
}

export default Profile;
