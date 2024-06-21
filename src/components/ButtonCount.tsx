import React,{ useState } from 'react';

interface ButtonCountProps {
  part: 'break' | 'session';
  defaultCount: number;
  
}
const ButtonCount: React.FC<ButtonCountProps> = ({part, count, setCount, disabled, setTimeLeft, timeLeft, sessionbool}) => {
  let min = 1;
  let max = 60;
  //let [count, setCount] = useState(initialCount);
  

  const handleDecrement = () => {
    setCount(() => count > min ? count - 1: count);
    if (sessionbool === true) {
      setTimeLeft(() => timeLeft > 60 ? timeLeft - 60: timeLeft);
    }
    
  };

  const handleIncrement = () => {
    setCount(() => count < max ? count + 1: count);
    if (sessionbool === true) {
      setTimeLeft(() => timeLeft < 1500 ? timeLeft + 60: timeLeft);
    }
  };
  return (
    <div className='flex justify-center items-center'>
      <button disabled={disabled} id={`${part}-decrement`} className='bg-blue-500 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md' onClick={handleDecrement}>
        -
      </button>
      <span className='mx-2' id={`${part}-length`}>{count}</span>
      <button disabled={disabled} id={`${part}-increment`} className='bg-blue-500 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md' onClick={handleIncrement}>
        +
      </button>
    </div>
  );
}

export default ButtonCount