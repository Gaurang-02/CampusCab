'use client';

import axios from 'axios';
import Image from 'next/image';
import React from 'react';

type Props = {
  setConfirmRidePanel: (val: boolean) => void;
  setVehicleFound: (val: boolean) => void;
  createRide: () =>  Promise<{ _id: string }>
  pickup: string;
  destination: string;
  fare: {
    car?: number;
    moto?: number;
    auto?: number;
  };
  vehicleType: 'car' | 'moto' | 'auto';
};

const ConfirmRide: React.FC<Props> = ({
  setConfirmRidePanel,
  setVehicleFound,
  createRide,
  pickup,
  destination,
  fare,
  vehicleType,
}) => { 

  

 const handleConfirmRide = async () => {
  try {
    // Wait until the ride is created
    const ride = await createRide();  // Make sure createRide returns ride object
    console.log('Ride created:', ride);

    // Call the driver now with the correct rideId
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/twilio/call-driver`, {
      phone: '+917906969394',
      rideId: ride._id, // Correct rideId from created ride
      pickup,
      destination,
    });

    setVehicleFound(true);
    setConfirmRidePanel(false);

  } catch (err) {
    console.error('Error confirming ride:', err);
    alert('Failed to confirm ride.');
  }
};


  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => setConfirmRidePanel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">Confirm your Ride</h3>

      <div className="flex gap-2 justify-between flex-col items-center">
        <Image
          className="h-20"
          src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
          alt="vehicle"
          width={220}
          height={120}
        />

        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">{pickup}</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">{destination}</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{fare[vehicleType] ?? '-'}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleConfirmRide}
          className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;
