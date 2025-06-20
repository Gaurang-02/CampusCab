"use client";

import React, { useEffect, useRef, useState, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import { useRouter } from "next/navigation";

import dynamic from "next/dynamic";

import LocationSearchPanel from "@/components/LocationSearchPanel";
import VehiclePanel from "@/components/VehiclePanel";
import ConfirmRide from "@/components/ConfirmRide";
import LookingForDriver from "@/components/LookingForDriver";
import WaitingForDriver from "@/components/WaitingForDriver";
const LiveTracking = dynamic(() => import("@/components/LiveTracking"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});
import { SocketContext } from "@/context/SocketContext";
import { UserDataContext } from "@/context/UserContext";
type Fare = {
  [key: string]: any;
};

type VehicleType = "car" | "moto" | "auto";

const Home: React.FC = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  type Suggestion = {
    description: string;
    place_id: string;
    [key: string]: any;
  };

  const [pickupSuggestions, setPickupSuggestions] = useState<Suggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    Suggestion[]
  >([]);

  const [activeField, setActiveField] = useState<
    "pickup" | "destination" | null
  >(null);
  const [fare, setFare] = useState<Fare>({});
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);

  const [ride, setRide] = useState<any>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const panelCloseRef = useRef<HTMLHeadingElement>(null);
  const vehiclePanelRef = useRef<HTMLDivElement>(null);
  const confirmRidePanelRef = useRef<HTMLDivElement>(null);
  const vehicleFoundRef = useRef<HTMLDivElement>(null);
  const waitingForDriverRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  // const contextSocket = useContext(SocketContext);
  // const socket = contextSocket?.socket;

  const userContext = useContext(UserDataContext);
  if (!userContext) throw new Error("UserContext is undefined");
  const { user } = userContext;

  // Join socket room when user is available
  // useEffect(() => {
  //   if (user?._id && socket) {
  //     socket.emit("join", { userType: "user", userId: user._id });
  //   }
  // }, [user, socket]);

  // // Handle ride-related socket events
  // useEffect(() => {
  //   if (!socket) return;

  //   const handleRideConfirmed = (rideData: any) => {
  //     setVehicleFound(false);
  //     setWaitingForDriver(true);
  //     setRide(rideData);
  //   };

  //   const handleRideStarted = () => {
  //     setWaitingForDriver(false);
  //     router.push("/riding");
  //   };

  //   socket.on("ride-confirmed", handleRideConfirmed);
  //   socket.on("ride-started", handleRideStarted);

  //   return () => {
  //     socket.off("ride-confirmed", handleRideConfirmed);
  //     socket.off("ride-started", handleRideStarted);
  //   };
  // }, [socket]);

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
    if (waitingForDriver && waitingForDriverRef.current) {
      gsap.to(waitingForDriverRef.current, { y: 0 });
    } else if (waitingForDriverRef.current) {
      gsap.to(waitingForDriverRef.current, { y: "100%" });
    }
  }, [waitingForDriver]);

  const findTrip = async () => {
    setVehiclePanel(true);
    setPanelOpen(false);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/rides/get-fare`,
      {
        params: { pickup, destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setFare(response.data);
  };

  const createRide = async () => {
    await axios.post(
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
  };

  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />
      <div className="absolute inset-0 z-0">
        <LiveTracking />
      </div>
      <div className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none">
        {/* Bottom panel */}
        <div className="h-[30%] p-6 bg-white relative shadow-lg rounded-t-2xl pointer-events-auto">
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
            className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
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
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
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
          setConfirmRidePanel={function (
            value: React.SetStateAction<boolean>
          ): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>

      <div
        ref={waitingForDriverRef}
        className="fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12"
      >
        <WaitingForDriver
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
        />
      </div>
    </div>
  );
};

export default Home;
