import { useTimer } from "react-timer-hook";

function MyTimer({ expiryTimestamp }) {
  const { seconds, minutes, hours, isRunning, start, pause, resume } = useTimer(
    {
      expiryTimestamp,
      autoStart: false,
      onExpire: () => {
        console.log("bazinga");
      },
      interval: 20,
    }
  );

  return (
    <>
      <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      {/* <p>{isRunning ? "Running" : "Not running"}</p> */}
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={resume}>Resume</button>
    </>
  );
}

export default function Timer() {
  const timer15 = new Date();
  timer15.setSeconds(timer15.getSeconds() + 900);

  return (
    <>
      <div>
        <MyTimer expiryTimestamp={timer15} />
      </div>
    </>
  );
}
