import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctor from "../components/RelatedDoctor";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol } = useContext(AppContext);
  const daysofWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState(null); // State for selected slot time

  const fetchDocInfo = () => {
    const doctor = doctors.find((doc) => doc._id === docId);
    setDocInfo(doctor);
  };

  const getAvailableSlots = () => {
    const today = new Date();
    const slots = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date();
      const endTime = new Date();

      currentDate.setDate(today.getDate() + i);
      currentDate.setHours(today.getDate() === currentDate.getDate() ? Math.max(10, currentDate.getHours() + 1) : 10, 0, 0, 0);

      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      const dailySlots = [];
      while (currentDate < endTime) {
        dailySlots.push({
          datetime: new Date(currentDate),
          time: currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      slots.push(dailySlots);
    }

    setDocSlots(slots);
  };

  useEffect(() => {
    if (doctors.length) fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  return (
    docInfo && (
      <div>
        {/* Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience} years</button>
            </div>
            <div>
              <p className="flex">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
            </div>
            <p className="text-gray-50 font-medium mt-4">
              Appointment fee: <span className="text-gray-600">{currencySymbol}{docInfo.fees}</span>
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 ? (
              docSlots.map((slots, index) => (
                <div
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index ? "bg-primary text-white" : "border border-gray-200"
                  }`}
                  key={index}
                  onClick={() => setSlotIndex(index)}
                >
                  <p>{daysofWeek[slots[0].datetime.getDay()]}</p>
                  <p>{slots[0].datetime.getDate()}</p>
                </div>
              ))
            ) : (
              <p>No slots available</p>
            )}
          </div>

          {/* Slot Times */}
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 && docSlots[slotIndex]?.length > 0 ? (
              docSlots[slotIndex].map((item, index) => (
                <p
                  className={`px-5 py-2 rounded-full cursor-pointer ${
                    slotTime === item.time ? "bg-primary text-white" : "text-gray-400 border border-gray-300"
                  }`}
                  onClick={() => setSlotTime(item.time)} // Update state
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))
            ) : (
              <p>No time slots available</p>
            )}
          </div>
          <button className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6">Book an appointment</button>
        </div>

        {/* Listing Related Doctors */}
        <RelatedDoctor docId={docId} speciality={docInfo.speciality}/>
      </div>
    )
  );
};

export default Appointment;
