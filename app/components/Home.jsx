import React from "react";

class Home extends React.Component {
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
              <p>
                With great joy, please join us in our celebration officiating
                our love for each other.
              </p>
              <h1 className="names">Shawn Lim</h1>
              <p>and</p>
              <h1 className="names">Christine Yi</h1>
              <p>invites you to save the date for the</p>
              <p style={{ fontSize: "46px" }}>25th of September, 2020</p>
              <p style={{ fontSize: "32px" }}>
                in Tirtha Uluwatu Chapel, Bali, Indonesia
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
