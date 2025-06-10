"use client"; 
import { useRef, useState } from "react";
// import LiveTracking from "../components/LiveTracking";
// import LocationSearchPanel from "../components/LocationSearchPanel";
// import VehiclePanel from "../components/VehiclePanel";
// import ConfirmRide from "../components/ConfirmRide";
// import LookingForDriver from "../components/LookingForDriver";
// import WaitingForDriver from "../components/WaitingForDriver";

const Home: React.FC = () => {
    const [pickup, setPickup] = useState<string>("");
    const [destination, setDestination] = useState<string>("");
    const [activeField, setActiveField] = useState<"pickup" | "destination" | null>(null);
    const [panelOpen, setPanelOpen] = useState<boolean>(false);
    const [vehicleType, setVehicleType] = useState<string>("");
    const [fare, setFare] = useState<number>(0);
    const [vehicleFound, setVehicleFound] = useState<boolean>(false);
    const [waitingForDriver, setWaitingForDriver] = useState<boolean>(false);

    const panelCloseRef = useRef<HTMLHeadingElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const vehiclePanelRef = useRef<HTMLDivElement>(null);
    const confirmRidePanelRef = useRef<HTMLDivElement>(null);
    const vehicleFoundRef = useRef<HTMLDivElement>(null);
    const waitingForDriverRef = useRef<HTMLDivElement>(null);

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Your form submission logic here
    };

    const findTrip = () => {
        // Logic for finding a trip
    };

    const createRide = () => {
        // Logic for ride creation
    };

    return (
        <div className="h-screen relative overflow-hidden">
            {/* <img className="w-16 absolute left-5 top-5" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber Logo" /> */}
            <div className="h-screen w-screen">
                {/* <LiveTracking /> */} map
            </div>
            <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
                <div className="h-[30%] p-6 bg-white relative">
                    <h5 ref={panelCloseRef} onClick={() => setPanelOpen(false)} className="absolute opacity-0 right-6 top-6 text-2xl">
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className="text-2xl font-semibold">Find a trip</h4>
                    <form className="relative py-3" onSubmit={submitHandler}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                        <input
                            onClick={() => { setPanelOpen(true); setActiveField("pickup"); }}
                            value={pickup}
                            onChange={(e) => setPickup(e.target.value)}
                            className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full"
                            type="text"
                            placeholder="Add a pick-up location"
                        />
                        <input
                            onClick={() => { setPanelOpen(true); setActiveField("destination"); }}
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
                            type="text"
                            placeholder="Enter your destination"
                        />
                    </form>
                    <button onClick={findTrip} className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full">
                        Find Trip
                    </button>
                </div>
                <div ref={panelRef} className="bg-white h-0">
                    {/* <LocationSearchPanel
                        suggestions={activeField === "pickup" ? [] : []} // Add suggestion data
                        setPanelOpen={setPanelOpen}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    /> */}
                </div>
            </div>
            <div ref={vehiclePanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12">
                {/* <VehiclePanel selectVehicle={setVehicleType} fare={fare} setConfirmRidePanel={setVehicleFound} /> */}
            </div>
            <div ref={confirmRidePanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
                {/* <ConfirmRide createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} /> */}
            </div>
            <div ref={vehicleFoundRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
                {/* <LookingForDriver createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} /> */}
            </div>
            <div ref={waitingForDriverRef} className="fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12">
                {/* <WaitingForDriver ride={{}} setWaitingForDriver={setWaitingForDriver} waitingForDriver={waitingForDriver} /> */}
            </div>
        </div>
    );
};

export default Home;