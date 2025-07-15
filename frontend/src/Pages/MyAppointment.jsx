import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointment = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

  // Fetch Appointments
  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      console.log(data.message);
      if (data.success) {
        setAppointments(data.message.reverse());
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Cancel Appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointments`,
        { appointmentId },
        {
          headers: { token },
        }
      );
      if (data.success) {
        fetchAppointments();
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="pt-6 md:pt-8 lg:pt-10">
      <p className="text-zinc-500 font-semibold border-b pb-4 md:pb-6 text-lg md:text-xl">
        My Appointments
      </p>
      <div className="space-y-6 mt-4">
        {appointments.map((item, index) => (
          <div
            className="flex flex-col md:flex-row gap-4 py-4 border-b"
            key={index}
          >
            {/* Doctor Image */}
            <div>
              <img
                className="w-48 bg-blue-50"
                src={item.docData.image}
                alt="Doctor"
              />
            </div>

            {/* Doctor Details */}
            <div className="flex-1 space-y-2 md:space-y-3">
              <p className="text-lg md:text-xl font-semibold text-zinc-600">
                {item.docData.name}
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                {item.docData.speciality}
              </p>
              <div className="space-y-1">
                <p className="font-semibold text-zinc-500 text-sm md:text-base">
                  Address:
                </p>
                <p className="text-gray-600 text-sm md:text-base">
                  {item.docData.address.line1}
                </p>
                <p className="text-gray-600 text-sm md:text-base">
                  {item.docData.address.line2}
                </p>
              </div>
              <p className="font-semibold text-zinc-500 text-sm md:text-base">
                Date & Time:{" "}
                <span className="font-normal text-gray-500">
                  {item.slotDate} | {item.slotTime}
                </span>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col justify-end gap-2 md:w-48 lg:w-56">
              {!item.cancelled && !item.isCompleted && (
                <>
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="border py-2 px-4 md:px-6 lg:px-8 rounded text-gray-600 text-sm md:text-base hover:bg-red-500 transition-colors w-full"
                  >
                    Cancel Appointment
                  </button>
                </>
              )}
              {item.cancelled && !item.isCompleted && <button className="border border-red-500 py-2 px-4 md:px-6 lg:px-8 rounded text-red-500 text-sm md:text-base   w-full"> Appointment Cancel</button>}
              {item.isCompleted && <button className="border border-blue-500 py-2 px-4 md:px-6 lg:px-8 rounded text-blue-500 text-sm md:text-base   w-full"> Completed</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointment;
