import React from "react";
import moment from "moment";
import firebase from "../utils/firebase";

class RSVP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    const pair = props.location.search.substring(1).split("=");
    if (pair[0] === "kittycat") {
      try {
        const decoded = atob(pair[1]);
        this.loadGuest(decoded);
      } catch (e) {
        window.location.href = "/";
      }
    }
  }

  loadGuest = guest => {
    const rootRef = firebase.database().ref("bali/" + guest);
    rootRef.once("value").then(snapshot => {
      const raw = snapshot.val();
      if (!raw) {
        window.location.href = "/";
      } else {
        this.setState({ guest_key: guest, ...raw });
      }
    });
  };

  handleInfoChange = key => evt => {
    this.setState({
      [key]: evt.currentTarget.value
    });
  };

  changeRSVP = () => {
    this.setState(state => ({
      attending: !state.attending
    }));
  };

  handleSubmit = evt => {
    evt.preventDefault();
    console.log(this.state);

    this.setState(
      {
        responded: Date.now(),
        saved: true
      },
      this.sendRSVPInformation
    );
  };

  sendRSVPInformation = () => {
    firebase
      .database()
      .ref("bali/" + this.state.guest_key)
      .set({
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        drinkability: this.state.drinkability,
        attending: this.state.attending,
        party_size: this.state.party_size,
        dietary: this.state.dietary || "",
        email: this.state.email || "",
        responded: this.state.responded
      });
  };

  render() {
    const {
      guest_key,
      first_name,
      last_name,
      party_size,
      dietary,
      attending,
      saved,
      responded
    } = this.state;
    return (
      <div className="rsvp-page">
        <div className="rsvp-background"></div>
        {guest_key && (
          <div className="rsvp-card-envelope">
            <div className="rsvp-card">
              <img
                className="sns-watermark"
                src="/public/images/SNS.png"
                alt=""
              />
              <p>To</p>
              <h2 className="guest-name">{first_name + " " + last_name} </h2>
              <div className="card-contents">
                <p>
                  <span className="bridegroom-name">Shawn Lim Hoong Tze</span>{" "}
                  and{" "}
                  <span className="bridegroom-name">Christine Seungmin Yi</span>{" "}
                </p>
                <p>are getting hitched!</p>
                <p>
                  Please join us for a celebration of love, friendship, laughter
                  and family.
                </p>
                <div className="time-and-place">
                  <p>25th of September, 2020</p>
                  <p>Tirtha Bridal, Uluwatu </p>
                </div>
                <p>
                  Dinas Karang Boma, Jl. Uluwatu Banyar, Pecatu, Kec. Kuta Sel.,
                  Kabupaten Badung, Bali 80364, Indonesia
                </p>
              </div>

              <div className="rsvp-form">
                <form onSubmit={this.handleSubmit}>
                  <div className="field">
                    <label htmlFor="party_size">My party size is</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      name="party_size"
                      value={party_size}
                      onChange={this.handleInfoChange("party_size")}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="dietary">
                      I have the following dietary requests:
                    </label>
                    <input
                      type="text"
                      name="dietary"
                      className="dietary"
                      value={dietary}
                      onChange={this.handleInfoChange("dietary")}
                    />
                  </div>

                  <div className="rsvp-toggle" onClick={this.changeRSVP}>
                    {attending ? (
                      <h1>
                        {party_size < 2 ? "I'm" : "We're"} going! See you there!
                      </h1>
                    ) : (
                      <h1>Sorry, I can't make it.</h1>
                    )}
                    <p>Click to change RSVP</p>
                  </div>
                  <div className="send-response-container">
                    <input
                      disabled={saved}
                      type="submit"
                      value={
                        saved
                          ? "Sent"
                          : responded
                          ? "Update Response"
                          : "Send Response"
                      }
                      className={`submit-button ${saved ? "saved" : ""}`}
                    />
                    {responded && (
                      <div className="sent-marker">
                        <i
                          className="fa fa-check-double"
                          style={{
                            color: responded ? "#75a458" : "transparent"
                          }}
                        ></i>
                        <span className="response-sent-timestamp">
                          You sent your response {moment(responded).calendar()}
                        </span>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default RSVP;
