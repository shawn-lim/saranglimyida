import React from "react";

class Bali extends React.Component {
  render() {
    return (
      <div className="home-page-container">
        <div className="home-page-background"></div>
        <div className="image-container">
          <div className="image-content">
            <img
              className="home-page-logo"
              src="/public/images/transparent-cropped.png"
            />
            <div className="introduction">
      <p>Bali</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Bali;
