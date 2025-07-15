import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { MDBSpinner } from 'mdb-react-ui-kit';



function AddDoctor() {
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [about, setAbout] = useState('');
  const [fees, setFees] = useState('');
  const [speciality, setSpeciality] = useState('General Physician');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [degree, setDegree] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { aToken, backendUrl } = useContext(AdminContext);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setDocImg(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!docImg) {
      toast.error("Please select an image");
      return;
    }

    if (!name || !email || !password || !experience || !fees || !speciality || !address1) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append('image', docImg);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('experience', experience);
    formData.append('about', about);
    formData.append('fees', fees);
    formData.append('speciality', speciality);
    formData.append('degree', degree);
    formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

    try {
      setIsLoading(true);
      const { data } = await axios.post("http://localhost:8000/api/admin/add-doctor", formData , { headers: { aToken } });


      if (data.success) {
        toast.success(data.message);
        setDocImg(false)
        setName("")
        setAbout("")
        setAddress1("")
        setAddress2("")
        setDegree("")
        setEmail("")
        setExperience("")
        setPassword("")
        setExperience("")
        setFees('')
      }
    } catch (error) {
      console.error("Error submitting form:", error.response.data || error.message);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false); // Hide Loader
    }
  };

  return (
    <form className="m-5 w-full" onSubmit={handleSubmit}>
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Doctor"
            />
          </label>
          <input type="file" id="doc-img" hidden onChange={handleImageChange} />
          <p>Upload doctor <br /> Picture</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          {/* Left Side */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Name</p>
              <input className="border rounded px-3 py-2 focus:outline-primary" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Email</p>
              <input className="border rounded px-3 py-2 focus:outline-primary" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Password</p>
              <input className="border rounded px-3 py-2 focus:outline-primary" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select className="border rounded px-3 py-2 focus:outline-primary" value={experience} onChange={(e) => setExperience(e.target.value)} required>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`${i + 1} Year`}>{`${i + 1} Year`}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Fees</p>
              <input className="border rounded px-3 py-2 focus:outline-primary" type="number" value={fees} onChange={(e) => setFees(e.target.value)} placeholder="Fees" required />
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Speciality</p>
              <select className="border rounded px-3 py-2 focus:outline-primary" value={speciality} onChange={(e) => setSpeciality(e.target.value)} required>
                <option value="">Select Speciality</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="General Physician">General Physician</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>



            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input className="border rounded px-3 py-2 focus:outline-primary" type="text" value={address1} onChange={(e) => setAddress1(e.target.value)} placeholder="Address 1" required />
              <input className="border rounded px-3 py-2 focus:outline-primary" type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} placeholder="Address 2" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Degree</p>
              <input className="border rounded px-3 py-2 focus:outline-primary" type="text" value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="Degree" required />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1 mt-4 text-gray-800">
          <p>About Doctor</p>
          <textarea className="border rounded px-3 py-2 focus:outline-primary" value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Write About Doctor" rows={5} required></textarea>
        </div>

        <button
          type="submit"
          className="bg-primary border px-8 py-3 rounded-md text-white mt-4 hover:bg-blue-900  transition ease-in duration-300 flex items-center gap-2"
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? (
            <MDBSpinner size="sm" className="mr-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </MDBSpinner>
          ) : (
            'Add Doctor'
          )}
        </button>
      </div>
    </form>
  );
}

export default AddDoctor;
