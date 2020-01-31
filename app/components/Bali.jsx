import React from "react";

class Bali extends React.Component {
  render() {
    return (
      <div className="bali homepage-section" id="bali">
        <div className="border-top"></div>
        <div className="bali-background"></div>
        <div className="bali-container custom-container">
          <div className="envelope-container">
            <div className="envelope-content">
              <h1>Tirtha Uluwatu, Bali</h1>
              <p>
                Our main wedding ceremony and reception will be done in Bali,
                Indonesia, near crystal clear blue waters and fresh tropical
                greeneries.{" "}
              </p>
              <p>
                We will have a classic chapel wedding at the Tirtha Bridal
                Chapel to commemorate the beginning of our new journey, followed
                by an evening full of family, friends, food and music.{" "}
              </p>
            </div>
          </div>
          <div className="boxes-container">
            <div className="box">
              <h3>
                <i className="fa fa-map-marker-alt"></i>
              </h3>
              <p>
                <span style={{ fontWeight: "bold", fontSize: "24px" }}>
                  The I Do's
                </span>
                <br />
                5 - 6:30pm
                <br />
                25th September, 2020
                <br />
                @Tirtha Uluwatu Chapel
              </p>
            </div>
            <div className="box">
              <h3>
                <i className="fa fa-utensils"></i>
              </h3>
              <p>
                <span style={{ fontWeight: "bold", fontSize: "24px" }}>
                  Reception
                </span>
                <br />
                6:30 - 11pm
                <br />
                25th September, 2020
                <br />
                Dinner Pavilion @Tirtha
              </p>
            </div>
            <div className="box">
              <h3>
                <i className="fa fa-cocktail"></i>
              </h3>
              <p>
                <span style={{ fontWeight: "bold", fontSize: "24px" }}>
                  The Afterparty
                </span>
                <br />
                TBA
                <br />
                25th September, 2020
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Bali;
