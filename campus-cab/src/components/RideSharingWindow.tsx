import React, { useEffect, useState } from 'react';

type RideSharingWindowProps = {
  countdown: number; // in seconds
  onTimeout: () => void;
  onMatchFound: (matchedUser: any) => void;
  socket: any;
};

const RideSharingWindow: React.FC<RideSharingWindowProps> = ({
  countdown,
  onTimeout,
  onMatchFound,
  socket,
}) => {
  const [timeLeft, setTimeLeft] = useState(countdown);

  useEffect(() => {
    if (!socket) return;

   
    socket.on('ride-share-found', (data: any) => {
      console.log('Ride sharing match found!', data);
      onMatchFound(data); 
    });

    return () => {
      socket.off('ride-share-found');
    };
  }, [socket]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout(); 
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeout]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="fixed w-full h-full z-20 bg-white flex flex-col justify-center items-center p-4">
      <h2 className="text-2xl font-bold mb-4">Looking for Ride Sharing...</h2>
      <p className="text-lg mb-2">Time Remaining: {formatTime(timeLeft)}</p>
      <p className="text-center max-w-md text-gray-600">
        We are checking if someone nearby is booking a similar ride. If a match is found, you can share the ride and split the fare!
      </p>
    </div>
  );
};

export default RideSharingWindow;
