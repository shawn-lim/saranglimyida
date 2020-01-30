import React from "react";

import HeaderBar from "./HeaderBar";
import Countdown from "./Countdown";
import Bali from "./Bali";
import Kuching from "./Kuching";
import Brunei from "./Brunei";
import Korea from "./Korea";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wHeight: window.innerHeight,
      homecardOpacity: 1
    };
  }
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleSetActive = active => {
    console.log(active);
  };

  handleScroll = evt => {
    let scrollTop = event.currentTarget.scrollY;
    const homecardOpacity =
      Math.max(this.state.wHeight / 2 - scrollTop, 0) /
      (this.state.wHeight / 2);
    this.setState({
      homecardOpacity,
    });
  };

  render() {
    const { homecardOpacity, countdownOpacity } = this.state;
    return (
      <div className="home-page-container">
        <HeaderBar />
        <HomeContent opacity={homecardOpacity} />
        <Countdown opacity={countdownOpacity} />
        <Bali />
        <Kuching />
        <Brunei />
        <Korea />
        <div className="home-page-background"></div>
      </div>
    );
  }
}

const HomeContent = ({ opacity }) => {
  return (
    <div className="home" id="home" style={{ opacity: opacity }}>
      <div className="image-container">
        <div className="image-content">
          <div className="introduction">
            <p>
              With great joy, please join us in our celebration officiating our
              love for each other.
            </p>
            <div className="names-container">
              <h1 className="names">Shawn Lim</h1>
              <p style={{ margin: "20px" }}>🎔</p>
              <h1 className="names">Christine Yi</h1>
            </div>
            <img
              className="home-page-logo"
              src="/public/images/transparent-cropped.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
