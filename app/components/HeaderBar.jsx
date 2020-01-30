import React from "react";
import {
  Link,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
  scroller
} from "react-scroll";

class HeaderBar extends React.Component {
  handleSetActive = active => {
    console.log(active);
  };
  render() {
    return (
      <div className="home-header-bar">
        <div className="header-links">
          <Link
            activeClass="active"
            to="home"
            spy={true}
            smooth={true}
            offset={-50}
            duration={500}
            onSetActive={this.handleSetActive}
          >
            Home
          </Link>
        </div>
        <p className="heart-separator">🎔</p>
        <div className="header-links">
          <Link
            activeClass="active"
            to="bali"
            spy={true}
            smooth={true}
            offset={-50}
            duration={500}
            onSetActive={this.handleSetActive}
          >
            Bali
          </Link>
        </div>
        <p className="heart-separator">🎔</p>
        <div className="header-links">
          <Link
            activeClass="active"
            to="kuching"
            spy={true}
            smooth={true}
            offset={-50}
            duration={500}
            onSetActive={this.handleSetActive}
          >
            Kuching
          </Link>
        </div>
        <p className="heart-separator">🎔</p>
        <div className="header-links">
          <Link
            activeClass="active"
            to="brunei"
            spy={true}
            smooth={true}
            offset={-50}
            duration={500}
            onSetActive={this.handleSetActive}
          >
            Brunei
          </Link>
        </div>
        <p className="heart-separator">🎔</p>
        <div className="header-links">
          <Link
            activeClass="active"
            to="korea"
            spy={true}
            smooth={true}
            offset={50}
            duration={500}
            onSetActive={this.handleSetActive}
          >
            Korea
          </Link>
        </div>
      </div>
    );
  }
}

export default HeaderBar;
