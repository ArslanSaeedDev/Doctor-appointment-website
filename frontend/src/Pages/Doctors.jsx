import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Doctors() {
  const navigate = useNavigate()
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const { doctors } = useContext(AppContext);
  console.log(speciality)
  const commonClass = "w-[84vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded-lg cursor-pointer";
  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };
  useEffect(() => {
    applyFilter();
  }, [speciality, doctors]);
  return (

    <div className=''>
      <p className='text-gray-600  text-xl'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <div className='flex flex-col gap-4 text-sm text-gray-600 '>
          <p onClick={() => speciality === "General physician" ? navigate("/doctor") : navigate('/doctor/General Physician')}
            className={`${commonClass} ${speciality === "General physician" ? "bg-indigo-100" : ""}`}>
            General Physician
          </p>

          <p onClick={() => speciality === "Gynecologist" ? navigate("/doctor") : navigate('/doctor/Gynecologist')}
            className={`${commonClass} ${speciality === "Gynecologist" ? "bg-indigo-100" : ""}`}>
            Gynecologist
          </p>

          <p onClick={() => speciality === "Dermatologist" ? navigate("/doctor") : navigate('/doctor/Dermatologist')}
            className={`${commonClass} ${speciality === "Dermatologist" ? "bg-indigo-100" : ""}`}>
            Dermatologist
          </p>

          <p onClick={() => speciality === "Pediatricians" ? navigate("/doctor") : navigate('/doctor/Pediatricians')}
            className={`${commonClass} ${speciality === "Pediatricians" ? "bg-indigo-100" : ""}`}>
            Pediatricians
          </p>

          <p onClick={() => speciality === "Neurologist" ? navigate("/doctor") : navigate('/doctor/Neurologist')}
            className={`${commonClass} ${speciality === "Neurologist" ? "bg-indigo-100" : ""}`}>
            Neurologist
          </p>

          <p onClick={() => speciality === "Gastroenterologist" ? navigate("/doctor") : navigate('/doctor/Gastroenterologist')}
            className={`${commonClass} ${speciality === "Gastroenterologist" ? "bg-indigo-100" : ""}`}>
            Gastroenterologist
          </p>
        </div>
        <div className=' grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-4  md:grid-cols-[repeat(2,_minmax(190px,_1fr))] lg:grid-cols-[repeat(4,_minmax(190px,_1fr))] '>
          {filterDoc.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(`/appointment/${item._id}`)}
              className='flex flex-col  border border-gray-200 rounded-lg cursor-pointer overflow-hidden transition-transform duration-300 ease-in-out hover:translate-y-[-5px]'>
              {/* Doctor Image */}

              <img src={item.image} alt={item.name} className='bg-blue-50' />

              {/* Availability Section */}
              <div className='flex items-center px-2 py-1'>
                <span className='h-2 w-2 bg-green-500 rounded-full'></span>
                {
                  item.available ? <p className='ml-2 text-green-500 font-sans text-sm font-normal'>Available</p> : <p>Not Availaible</p>
                }
              </div>

              {/* Doctor Information */}
              <div className='px-2 pb-4'>
                <p className='text-sm md:text-base font-medium text-gray-900'>{item.name}</p>
                <p className='text-xs md:text-sm font-normal text-gray-600 leading-[1.125rem]'>
                  {item.speciality}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Doctors;
