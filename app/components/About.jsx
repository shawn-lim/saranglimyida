import React from "react";
import { Rotate, Fade } from "react-reveal";

class About extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="our-story" className="homepage-section">
        <div className="border-top"></div>
        <div className="about-bg"></div>
        <div className="custom-container">
          <Rotate bottom left>
            <div className="about-card">
              <div
                className="about-card-image"
                style={{ backgroundImage: "url(/public/images/sunny.jpg)" }}
              ></div>
              <p>
                <h2>Shawn and Seungmina's story</h2>
                We met in Downtown Vancouver on a warm sunny day. Fast forward
                several months, and we did almost everything together.
              </p>
            </div>
          </Rotate>

          <Rotate bottom right>
            <div className="picture-card-container right">
              <div className="picture-card">
                <div
                  className="picture-card-image"
                  style={{ backgroundImage: "url(/public/images/archery.jpg)" }}
                ></div>
                <p>
                  In Olympic Archery, we taught each other the tireless pursuit
                  of consistency and perfection, stability and patience in all
                  we do.
                </p>
              </div>
            </div>
          </Rotate>
          <Rotate bottom left>
            <div className="picture-card-container left shift-up">
              <div className="picture-card">
                <div
                  className="picture-card-image"
                  style={{ backgroundImage: "url(/public/images/sailing.jpg)" }}
                ></div>
                <p>
                  We took a sailing course and became certified sailors to chart
                  our own journey in the big open blue.
                </p>
              </div>
            </div>
          </Rotate>

          <Rotate bottom right>
            <div className="about-card">
              <p>
                Led by her hand, we picked strawberries and learned to
                appreciate even the ugly strawberries; for their sweetness did
                not dependant on it.
              </p>
              <div
                className="about-card-image right"
                style={{
                  height: "520px",
                  backgroundImage: "url(/public/images/strawberrypicking.jpg)"
                }}
              ></div>
            </div>
          </Rotate>

          <Fade bottom>
            <div className="picture-card-container center">
              <div className="picture-card">
                <div
                  className="picture-card-image"
                  style={{
                    height: "410px",
                    backgroundImage: "url(/public/images/run.jpg)"
                  }}
                ></div>
                <p>
                  Here we see Shawn forced on a 10k run by Christine. Sometimes,
                  no matter how tired you are, you have to keep moving, and
                  Christine made sure Shawn never gave up.
                </p>
              </div>
            </div>
            <div className="this-year-blob">
              <div
                className="this-year-blob-image"
                style={{
                  backgroundImage: "url(/public/images/shawnandseungmin.jpg)"
                }}
              ></div>
              <div className="this-year-blob-content">
                <p>
                  This year, we're tying the knot officially, and thus going to
                  begin a new chapter in our lives together. Join us as we
                  celebrate this joyous moment in our lives!
                </p>
                <p>
                  We are truly blessed to be loved by families and friends
                  across multiple countries, and as a result we will be
                  celebrating in four different locations!
                </p>
              </div>
            </div>
          </Fade>
        </div>
      </div>
    );
  }
}

export default About;
