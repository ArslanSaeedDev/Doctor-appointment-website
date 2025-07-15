import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { useParams, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import axios from 'axios'; // Import axios
import { toast } from 'react-toastify';

function Appointment() {
  const [docsInfo, setDocsInfo] = useState({});
  const { docId } = useParams();
  const { doctors, userData, backendUrl, token, getAllDoctor } = useContext(AppContext); 
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const daysOfWeek = ['Sun', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const today = useMemo(() => new Date(), []);

  const getAvailableSlots = useCallback(() => {
    let slots = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() + i);
      currentDay.setHours(0, 0, 0, 0);

      let dayStart = new Date(currentDay);
      dayStart.setHours(10, 0, 0, 0);

      let dayEnd = new Date(currentDay);
      dayEnd.setHours(21, 0, 0, 0);

      if (i === 0) {
        const now = new Date();
        if (now > dayStart) {
          dayStart = new Date(now);
          const minutes = dayStart.getMinutes();
          dayStart.setMinutes(minutes > 30 ? 60 : 30);
          dayStart.setSeconds(0, 0);
        }
      }

      let currentSlotTime = new Date(dayStart);
      const timeSlots = [];

      while (currentSlotTime <= dayEnd && timeSlots.length < 7) {
        const slotDatetime = new Date(currentSlotTime);
        const formattedTime = slotDatetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let day = slotDatetime.getDate();
        let month = slotDatetime.getMonth() + 1;
        let year = slotDatetime.getFullYear();
        const slotDate = `${day}_${month}_${year}`;
        const slotTime = formattedTime;

        const isSlotAvailable = !(docsInfo.slots_booked && docsInfo.slots_booked[slotDate] && docsInfo.slots_booked[slotDate].includes(slotTime));


        if (isSlotAvailable) {
          timeSlots.push({
            datetime: slotDatetime,
            formattedTime: formattedTime,
          });
        }
        currentSlotTime.setMinutes(currentSlotTime.getMinutes() + 30);
      }

      slots.push({ date: currentDay, slots: timeSlots });
    }
    setDocSlots(slots);
  }, [today, docsInfo]);


  const fetchDocInfo = useCallback(() => {
    const doctor = doctors.find(doc => doc._id === docId);
    if (doctor) {
      setDocsInfo(doctor);
    }
  }, [docId, doctors]);

  useEffect(() => {
    fetchDocInfo();
    getAvailableSlots();
  }, [fetchDocInfo, getAvailableSlots]);


  // -------------- Book Appointment Function --------------
  const handleBookAppointment = async () => {
    if (!token) {
      toast.warn("Please login to book an appointment")
      navigate('/login')
      return
    }

    try {
      // Get the selected slot from docSlots
      const selectedDay = docSlots[slotIndex];
      const selectedSlot = selectedDay.slots[selectedSlotIndex];

      // Format the date as day-month-year
      const date = selectedSlot.datetime;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const slotDate = `${day}-${month}-${year}`;

      // Get the time from the selected slot
      const slotTime = selectedSlot.formattedTime;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctor();
        navigate('/myAppointment');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };
  // ---------------------------------------------------------

  return (
    <div className='flex flex-col gap-6'>
      {/* Doctor Info Section */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docsInfo.image} alt="" />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 mx-2 bg-white sm:0 mt-[-80px] sm:mt-0'>
          <div className='flex items-center text-2xl font-medium text-gray-900 gap-2'>
            <p>{docsInfo.name}</p>
            <img className='w-5' src={assets.verified_icon} alt="" />
          </div>

          <div className='flex items-center text-gray-600 font-medium gap-2 text-sm mt-1'>
            <p>{docsInfo.degree} - {docsInfo.speciality}</p>
            <button className='border text-xs px-2 py-0.5 rounded-full'>{docsInfo.experience}</button>
          </div>

          <div className='flex items-center gap-1 text-base font-semibold text-gray-900 mt-3'>
            <p>About</p>
            <img className='w-4' src={assets.info_icon} alt="" />
          </div>

          <div className='text-gray-500 text-sm max-w-[700px] mt-1'>
            <p>{docsInfo.about}</p>
          </div>

          <div className='text-gray-500 mt-4'>
            <p>Appointment fee: <span className='font-semibold text-gray-600'>${docsInfo.fees}</span></p>
          </div>
        </div>
      </div>

      {/* Booking Slots Section */}
      <div className='sm:ml-80 sm:pl-4 mt-4 font-medium text-gray-700'>
        <h3 className='font-medium text-gray-700'>Booking Slots</h3>
        <div className='flex gap-3 items-center w-full overflow-x-auto mt-4'>
          {docSlots.length > 0 && docSlots.map((daySlot, index) => (
            <div
              key={index}
              onClick={() => setSlotIndex(index)}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
            >
              <p>{daysOfWeek[daySlot.date.getDay()]}</p>
              <p>{daySlot.date.getDate()}</p>
            </div>
          ))}
        </div>

        {docSlots[slotIndex] && docSlots[slotIndex].slots.length > 0 && (
          <div className='flex gap-2 flex-wrap mt-4'>
            {docSlots[slotIndex].slots.map((slot, i) => (
              <button
                key={i}
                onClick={() => setSelectedSlotIndex(i)}
                className={`border px-6 py-3 rounded-full transition-colors ${selectedSlotIndex === i
                  ? 'bg-primary text-white border-primary'
                  : 'text-gray-700 border-gray-300'
                  }`}
              >
                {slot.formattedTime}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleBookAppointment}
          disabled={loading}
          className={`mt-4 py-4 px-12 rounded-full ${loading ? 'bg-gray-400' : 'bg-primary text-white'}`}
        >
          {loading ? "Booking..." : "Book an Appointment"}
        </button>
      </div>

      {/* Related Doctors Section */}
      <div className='mt-12'>
        <h3 className='text-xl md:text-3xl font-semibold text-gray-700 text-center'>Related Doctors</h3>
        <p className='text-gray-500 text-sm md:text-lg text-center'>Simply Browse through our list of trusted doctors</p>
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 lg:flex justify-center items-center lg:gap-6'>
          {doctors
            .filter(doc => doc.speciality === docsInfo.speciality && doc._id !== docId)
            .map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  navigate(`/appointment/${item._id}`);
                  window.scrollTo(0, 0);
                }}
                className='flex flex-col border border-gray-200 rounded-lg cursor-pointer overflow-hidden transition-transform duration-300 ease-in-out hover:translate-y-[-5px] lg:w-52'
              >
                <img src={item.image} alt={item.name} className='bg-blue-50' />
                <div className='flex items-center px-2 py-1'>
                  <span className='h-2 w-2 bg-green-500 rounded-full'></span>
                  <p className='ml-2 text-green-500 font-sans text-sm font-normal'>Available</p>
                </div>
                <div className='px-2 pb-4'>
                  <p className='text-sm md:text-base font-semibold text-gray-900'>{item.name}</p>
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

export default Appointment;
