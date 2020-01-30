import React from "react";

class Countdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counting: false
    };

    this.countdowner();
  }

  countdowner = () => {
    const countDownDate = new Date("Sept 25, 2020 15:37:25").getTime();

    // Update the count down every 1 second
    setInterval(() => {
      // Get today's date and time
      const now = new Date().getTime();

      // Find the distance between now and the count down date
      const distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.setState({
        counting: true,
        days,
        hours,
        minutes,
        seconds
      });
    });
  };

  render() {
    const { counting, days, hours, minutes, seconds } = this.state;
    return counting ? (
      <div className="countdown-container">
        <h1 className="save-the-date">Save the Date!</h1>
        <div className="countdown">
          <div className="days unit">
            <p>
              {days} <span className="unit-label">days</span>
            </p>
          </div>
          <div className="hours unit">
            <p>
              {hours} <span className="unit-label">hours</span>
            </p>
          </div>
          <div className="minutes unit">
            <p>
              {minutes} <span className="unit-label">minutes</span>
            </p>
          </div>
          <div className="seconds unit">
            <p>
              {seconds} <span className="unit-label">seconds</span>
            </p>
          </div>
        </div>
        <h1 className="wedding-date">25th of September, 2020</h1>
      </div>
    ) : (
      <div />
    );
  }
}

export default Countdown;
