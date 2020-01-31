import React from "react";
import { Fade } from "react-reveal";

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
        <Fade>
          <div className="custom-container">
            <h1 className="wedding-date">25th of September, 2020</h1>
            <div className="countdown-address">
              <div className="countdown-address-icon"></div>
              <div className="countdown-address-content">
                <a
                  style={{ color: "blue" }}
                  href="https://www.google.com/maps/search/?api=1&query=Tirtha%20Bridal%2C%20Indonesia"
                  target="_blank"
                >
                  <h3>
                    <i className="fa fa-map-pin"></i>
                    Tirtha Bridal
                  </h3>
                </a>
                <p>Dinas Karang Boma,</p>
                <p>Jl. Uluwatu Banyar, Pecatu, Kec. Kuta Sel.,</p>
                <p>Kabupaten Badung,</p>
                <p>Bali 80364, Indonesia</p>
              </div>
            </div>
            <div className="countdown">
              <div className="days unit">
                <p className="unit-value">{days}</p>
                <p className="unit-label">days</p>
              </div>
              <div className="hours unit">
                <p className="unit-value">{hours}</p>
                <p className="unit-label">hours</p>
              </div>
              <div className="minutes unit">
                <p className="unit-value">{minutes}</p>
                <p className="unit-label">minutes</p>
              </div>
              <div className="seconds unit">
                <p className="unit-value">{seconds}</p>
                <p className="unit-label">seconds</p>
              </div>
            </div>
          </div>
        </Fade>
      </div>
    ) : (
      <div />
    );
  }
}

export default Countdown;
