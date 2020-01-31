import React from "react";
import { Link } from "react-scroll";

import HeaderBar from "./HeaderBar";
import Countdown from "./Countdown";
import About from "./About";
import Bali from "./Bali";
import Kuching from "./Kuching";
import Brunei from "./Brunei";
import Korea from "./Korea";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wHeight: window.innerHeight,
      homecardOpacity: 1,
      headerOpacity: 0
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
      headerOpacity: 1 - homecardOpacity,
      scrollTop: scrollTop
    });
  };

  render() {
    const {
      scrollTop,
      homecardOpacity,
      headerOpacity,
      countdownOpacity
    } = this.state;
    return (
      <div className="home-page-container">
        <HeaderBar headerOpacity={headerOpacity} />
        <HomeContent opacity={homecardOpacity} />
        <Countdown opacity={countdownOpacity} />
        <About scrollTop={scrollTop} />
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
            <div className="introduction-image"></div>
            <p>We decided to live happily ever after.</p>
            <p>Join us in celebrating the wedding of</p>
            <div className="names-container">
              <h1 className="names">Shawn Lim Hoong Tze</h1>
              <p className="name-heart-separator">
                <i className="fa fa-heart"></i>
              </p>
              <h1 className="names">Christine Seungmin Yi</h1>
            </div>
            <p>
              <Link
                to="bali"
                spy={true}
                smooth={true}
                offset={-50}
                duration={500}
              >
                Tirtha Bridal, Uluwatu, Bali
              </Link>
              <br />

              <span style={{ fontSize: "14px" }}>
                and{" "}
                <Link
                  to="kuching"
                  spy={true}
                  smooth={true}
                  offset={-50}
                  duration={500}
                >
                  other locations.
                </Link>
              </span>
            </p>
            <div className="respectfully-container">
              <p className="respectfully">Respectfully,</p>
              <img className="home-page-logo" src="/public/images/SNS.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
