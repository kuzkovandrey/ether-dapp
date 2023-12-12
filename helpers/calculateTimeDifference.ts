function calculateTimeDifference() {
  const SEC = 1000;
  const time = {
    start: 0,
    end: 0,
  };

  const start = () => {
    time.start = Date.now();
  };

  const stop = () => {
    time.end = Date.now();

    return (time.end - time.start) / SEC;
  };

  return {
    start,
    stop,
  };
}

export default calculateTimeDifference;
