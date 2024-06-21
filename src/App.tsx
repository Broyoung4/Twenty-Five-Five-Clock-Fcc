import './App.css';
import { useEffect, useState, useRef } from 'react';
import ButtonCount from './components/ButtonCount';
import AlarmSound from "./assets/AlarmSound.mp3";

export default function App() {
  const [sessionDuration, setSessionDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [play, setPlay] = useState(false);
  const [timingType, setTimingType] = useState('SESSION');
  const [timeLeft, setTimeLeft] = useState(1500);
  const title = timingType === "SESSION" ? "Session" : "Break";
  const audioRef = useRef<HTMLAudioElement>(null); // Store audio element in a ref

  const timeFormatter = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft - minutes * 60;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handlePlay = () => {
    setPlay((prev) => !prev);
  };

  const resetTimer = () => {
    if (!timeLeft && timingType === "SESSION") {
      setTimeLeft(breakDuration * 60);
      setTimingType("BREAK");
      audioRef.current.play(); 
    } else if (!timeLeft && timingType === "BREAK") {
      setTimeLeft(sessionDuration * 60);
      setTimingType("SESSION");
      audioRef.current.pause();
      audioRef.current.currentTime = 0; 
    }
  };

  const handleReset = () => {
    clearTimeout(timeoutRef.current); // Clear the timeout first
    setPlay(false);
    setTimeLeft(1500);
    setBreakDuration(5);
    setSessionDuration(25);
    setTimingType("SESSION");
    audioRef.current.pause(); 
    audioRef.current.currentTime = 0;
  };

  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Store timeout in a ref

  useEffect(() => {
    if (play) {
      timeoutRef.current = setTimeout(() => {
        if (timeLeft > 0) {
          setTimeLeft(timeLeft - 1);
        } else {
          resetTimer();
        }
      }, 1000);
    } else {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    return () => {
      clearTimeout(timeoutRef.current); 
    };
  }, [play, timeLeft]); 

  return (
    <div className='container flex flex-col justify-center items-center gap-8'>
      <div className='flex justify-between items-center text-center gap-6'>
        <div id='break-label'>
          <h3 className='text-xl font-bold'>Break Length</h3>
          <ButtonCount
            disabled={play}
            part='break'
            count={breakDuration}
            setCount={setBreakDuration}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            sessionbool={false}
          />
        </div>
        <div id='session-label'>
          <h3 className='text-xl font-bold'>Session Length</h3>
          <ButtonCount
            disabled={play}
            part='session'
            count={sessionDuration}
            setCount={setSessionDuration}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            sessionbool={true}
          />
        </div>
      </div>
      <div className='timer-container '>
        <div className='border border-gray-500 p-6 flex flex-col justify-center items-center gap-6 mb-4' id='timer'>
          <h1
            className={`${timeLeft < 60 ? 'text-red-500' : 'text-black'} text-xl font-bold`}
            id='timer-label'
          >
            {title}
          </h1>
          <h3 className={`${timeLeft < 60 ? 'text-red-500' : 'text-black'} text-xl`} id='time-left'>{timeFormatter()}</h3>
        </div>
        <button
          className='bg-blue-500 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md'
          onClick={handlePlay}
          id='start_stop'
        >
          Start/Stop
        </button>
        <button
          className='bg-blue-500 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md'
          onClick={handleReset}
          id='reset'
        >
          Reset
        </button>
      </div>
      <audio id="beep" ref={audioRef} preload="auto" src={AlarmSound} />
    </div>
  );
}