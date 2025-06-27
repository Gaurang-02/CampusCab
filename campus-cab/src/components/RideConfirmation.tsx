"use client";

import React from "react";

type RideDetails = {
  captain: {
    fullname: {
      firstname: string;
    };
    vehicle: {
      plate: string;
    };
  };
  pickup: string;
  destination: string;
  otp: string;
};

type Props = {
  setRideConfirmed: (val: boolean) => void;
  ride?: RideDetails;
  fare: number;
};

const RideConfirmation: React.FC<Props> = ({
  setRideConfirmed,
  ride,
  fare,
}) => {
  if (!ride) return null;

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => setRideConfirmed(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5 text-center">
        Ride Confirmed
      </h3>

      <div className="flex gap-2 justify-between flex-col items-center">
        <img
          className="h-24"
          src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
          alt="UberAuto"
        />

        {/* <div className="text-center mt-3">
          <h2 className="text-lg font-medium capitalize">
            {ride?.captain.fullname.firstname}
          </h2>
          <h4 className="text-xl font-semibold -mt-1 -mb-1">
            {ride?.captain.vehicle.NoPlate}
          </h4>
          <p className="text-sm text-gray-600 capitalize">
            {ride?.captain.vehicle.type}
          </p>
          <h1 className="text-lg font-semibold mt-2">OTP: {ride?.otp}</h1>
        </div> */}

        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">{ride?.pickup}</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">{ride?.destination}</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{fare ?? "-"}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setRideConfirmed(false)}
          className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default RideConfirmation;
