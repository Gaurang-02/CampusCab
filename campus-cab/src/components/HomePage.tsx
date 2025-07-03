"use client";

import React, { useEffect, useRef, useState, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";

import Image from "next/image";

import dynamic from "next/dynamic";

import LocationSearchPanel from "@/components/LocationSearchPanel";
import VehiclePanel from "@/components/VehiclePanel";
import ConfirmRide from "@/components/ConfirmRide";
import LookingForDriver from "@/components/LookingForDriver";
import RideConfirmation from "@/components/RideConfirmation";
const LiveTracking = dynamic(() => import("@/components/LiveTracking"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});
import { SocketContext } from "@/context/SocketContext";
import { UserDataContext } from "@/context/UserContext";
// import RideSharingWindow from "./RideSharingWindow";
type Fare = {
  [key: string]: number;
};

type VehicleType = "auto";

// const [showRideSharingWindow, setShowRideSharingWindow] = useState(false);
// const [rideSharingMatched, setRideSharingMatched] = useState(false);
// const [sharedRideData, setSharedRideData] = useState(null);

const Home: React.FC = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [rideConfirmed, setRideConfirmed] = useState(false);
  type Suggestion = {
    description: string;
    place_id: string;
    location: { lat: number; lng: number };
    [key: string]: unknown;
  };

  type Ride = {
    _id: string;
    pickup: string;
    destination: string;
    [key: string]: unknown;
  };

  const [pickupSuggestions, setPickupSuggestions] = useState<Suggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    Suggestion[]
  >([]);

  type LatLng = { lat: number; lng: number };

  const [pickupLocation, setPickupLocation] = useState<LatLng | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<LatLng | null>(
    null
  );

  const [activeField, setActiveField] = useState<
    "pickup" | "destination" | null
  >(null);
  const [fare, setFare] = useState<Fare>({});
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);

  const [ride, setRide] = useState<Ride | null>(null);

  const [showRoute, setShowRoute] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const panelCloseRef = useRef<HTMLHeadingElement>(null);
  const vehiclePanelRef = useRef<HTMLDivElement>(null);
  const confirmRidePanelRef = useRef<HTMLDivElement>(null);
  const vehicleFoundRef = useRef<HTMLDivElement>(null);
  const RideConfirmationRef = useRef<HTMLDivElement>(null);

  const contextSocket = useContext(SocketContext);
  const socket = contextSocket?.socket;

  const userContext = useContext(UserDataContext);
  if (!userContext) throw new Error("UserContext is undefined");
  const { user } = userContext;

  useEffect(() => {
    if (user?._id && socket) {
      console.log("Joining room with user ID:", user._id);
      socket.emit("join", { userType: "user", userId: user._id });
    }
  }, [user, socket]);

  useEffect(() => {
    console.log("Socket from context: ", socket);

    if (!socket) {
      console.log("Socket is not available.");
      return;
    }

    console.log("Socket listeners are active");

    socket.on("ride-accepted", (data) => {
      console.log("Ride Accepted Event Received:", data);
      setVehicleFound(false);
      setRide(data);
      setRideConfirmed(true);
      // alert(
      //   `Driver has accepted your ride from ${data.pickup} to ${data.destination}`
      // );
    });

    socket.on("ride-rejected", (data) => {
      console.log("Ride Rejected Event Received:", data);
      setVehicleFound(false);
      setRideConfirmed(false);
      // alert("Driver has rejected your ride.");
    });

    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("ride-accepted");
      socket.off("ride-rejected");
    };
  }, [socket]);

  const handlePickupChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickup(e.target.value);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      setPickupSuggestions(response.data);
    } catch {}
  };

  const handleDestinationChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDestination(e.target.value);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDestinationSuggestions(response.data);
    } catch {}
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
  };

  useGSAP(() => {
    if (panelOpen && panelRef.current && panelCloseRef.current) {
      gsap.to(panelRef.current, { height: "70%", padding: 24 });
      gsap.to(panelCloseRef.current, { opacity: 1 });
    } else if (panelRef.current && panelCloseRef.current) {
      gsap.to(panelRef.current, { height: "0%", padding: 0 });
      gsap.to(panelCloseRef.current, { opacity: 0 });
    }
  }, [panelOpen]);

  useGSAP(() => {
    if (vehiclePanel && vehiclePanelRef.current) {
      gsap.to(vehiclePanelRef.current, { y: 0 });
    } else if (vehiclePanelRef.current) {
      gsap.to(vehiclePanelRef.current, { y: "100%" });
    }
  }, [vehiclePanel]);

  useGSAP(() => {
    if (confirmRidePanel && confirmRidePanelRef.current) {
      gsap.to(confirmRidePanelRef.current, { y: 0 });
    } else if (confirmRidePanelRef.current) {
      gsap.to(confirmRidePanelRef.current, { y: "100%" });
    }
  }, [confirmRidePanel]);

  useGSAP(() => {
    if (vehicleFound && vehicleFoundRef.current) {
      gsap.to(vehicleFoundRef.current, { y: 0 });
    } else if (vehicleFoundRef.current) {
      gsap.to(vehicleFoundRef.current, { y: "100%" });
    }
  }, [vehicleFound]);

  useGSAP(() => {
    if (rideConfirmed && RideConfirmationRef.current) {
      gsap.to(RideConfirmationRef.current, { y: 0 });
    } else if (RideConfirmationRef.current) {
      gsap.to(RideConfirmationRef.current, { y: "100%" });
    }
  }, [rideConfirmed]);

  const findTrip = async () => {
    // console.log("Find Trip Clicked 🚀");
    // console.log("Pickup:", pickup);
    // console.log("Destination:", destination);
    // console.log("Pickup Location:", pickupLocation);
    // console.log("Destination Location:", destinationLocation);

    if (!pickup || !destination) {
      alert("Please select both pickup and destination.");
      return;
    }

    setShowRoute(true);
    setVehiclePanel(true);
    setPanelOpen(false);

    try {
      // 1. Get route from backend
      // You may want to get the location object from suggestions if needed
      // For now, we'll skip the directions API call since pickup/destination are strings
      // If you want to use the directions API, you need to get the lat/lng from the selected suggestion

      // 2. Get fare
      const fareRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/rides/get-fare`,
        {
          params: {
            pickup,
            destination,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setFare(fareRes.data);
    } catch (error) {
      console.error("Error fetching trip data", error);
      alert("Failed to fetch trip details.");
    }
  };

  const createRide = async () => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/rides/create`,
      {
        pickup,
        destination,
        vehicleType,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setRide(res.data);
    return res.data;
  };

  //   useEffect(() => {
  //   if (rideConfirmed) {
  //     axios.post(`${process.env.NEXT_PUBLIC_API_URL}/twilio/call-driver`, {
  //       phone: "7906969394",
  //       rideId: ride?._id || "test-ride-id", // Replace with real ID if available
  //     });
  //   }
  // }, [rideConfirmed]);

  return (
    <div className="min-h-[100svh] relative overflow-hidden">
      <Image
        className="w-24 absolute left-10 top-3 z-10"
        src="/logo_campus.png"
        alt="Campus Cab Logo"
        width={96}
        height={96}
      />
      <div className="absolute inset-0 z-0">
        <LiveTracking
          pickup={showRoute ? pickupLocation : undefined}
          destination={showRoute ? destinationLocation : undefined}
        />
      </div>
      <div className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none">
        {/* Bottom panel */}
        <div className="min-h-[30%] p-6 bg-white relative shadow-lg rounded-t-2xl pointer-events-auto">
          <h5
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className="absolute opacity-0 right-6 top-6 text-2xl cursor-pointer"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form className="relative py-3" onSubmit={submitHandler}>
            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              value={pickup}
              onChange={handlePickupChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full"
              type="text"
              placeholder="Add a pick-up location"
            />
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              value={destination}
              onChange={handleDestinationChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
          <button
            onClick={findTrip}
            className={`px-4 py-1 rounded-lg mt-3 w-full ${
              !pickupLocation || !destinationLocation
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white"
            }`}
            disabled={!pickupLocation || !destinationLocation}
          >
            Find Trip
          </button>
        </div>

        {/* Expandable search panel */}
        <div ref={panelRef} className="bg-white h-0 z-20 pointer-events-auto">
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            setPickupLocation={setPickupLocation} 
            setDestinationLocation={setDestinationLocation} 
            activeField={activeField}
          />
        </div>
      </div>

      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <VehiclePanel
          selectVehicle={setVehicleType}
          fare={fare}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
        />
      </div>

      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <ConfirmRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType as VehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <LookingForDriver
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType as VehicleType}
          setVehicleFound={setVehicleFound}
          setConfirmRidePanel={function ():
          void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>

      {/* <div
        ref={RideSharingWindowRef}
        className={`fixed w-full z-10 bottom-0 ${
          showRideSharingWindow ? "" : "translate-y-full"
        } bg-white px-3 py-6 pt-12`}
      >
        <RideSharingWindow
          countdown={5 * 60} // 5 minutes
          onTimeout={() => {
            // Timeout handler: proceed with solo ride
            setShowRideSharingWindow(false);
            // You can optionally show a message that no ride was found
          } }
          onMatchFound={(matchedUser) => {
            // Match found: proceed to ride share confirmation
            setSharedRideData(matchedUser);
            setShowRideSharingWindow(false);
            setRideSharingMatched(true);
          } } socket={undefined}        />
      </div> */}

      <div
        ref={RideConfirmationRef}
        className="fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12"
      >
        <RideConfirmation
          ride={ride}
          // setVehicleFound={setVehicleFound}
          fare={fare[vehicleType as VehicleType]}
          setRideConfirmed={setRideConfirmed}
        />
      </div>
    </div>
  );
};

export default Home;
