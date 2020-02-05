import React, { useState, useEffect } from "react";
import Select from "react-select";
import firebase from "../utils/firebase";

class Admin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      total: 0,
      list: [],
      user: undefined,
      checked: false
    };
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    if (user) {
      this.loadFirebase();
      this.setState({ user: user });
    }

    setTimeout(() => {
      this.setState({ checked: true });
    }, 500);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.loadFirebase();
      }
      this.setState({ user: user });
    });
  }

  loadFirebase = () => {
    const rootRef = firebase.database().ref("bali");
    rootRef.once("value").then(snapshot => {
      const raw = snapshot.val();
      let total = 0;

      const list = Object.keys(raw).map(key => {
        total += raw[key].party_size * raw[key].attending;
        return raw[key];
      });

      this.setState({
        total: total,
        list: list
      });
    });
  };

  authenticate = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        // Handle Errors here.
        var errorMessage = error.message;
        this.setState({ authError: errorMessage });
      });
  };

  onSignOut = () => {
    firebase.auth().signOut();
  };

  render() {
    const { checked, user, total, authError } = this.state;
    const guestList = this.state.list.slice(1);
    return (
      <div className="admin-page-container">
        <div className="home-page-background"></div>
        {user ? (
          <Authenticated
            guestList={guestList}
            total={total}
            onSignOut={this.onSignOut}
          />
        ) : checked ? (
          <SignIn onSubmit={this.authenticate} error={authError} />
        ) : (
          <div />
        )}
      </div>
    );
  }
}

const SignIn = props => {
  const handleSubmit = evt => {
    evt.preventDefault();

    props.onSubmit(evt.target.email.value, evt.target.password.value);
  };

  return (
    <div>
      <form className="sign-in-form" onSubmit={handleSubmit}>
        <h2 className="sign-in-form-header">
          Bride and Groom Preparation Room!
        </h2>
        <input type="email" name="email" />
        <input type="password" name="password" />
        <input type="submit" value="Restricted Access" />
        <p className="error">{props.error}</p>
      </form>
    </div>
  );
};
const Authenticated = props => {
  const { guestList, total, onSignOut } = props;

  const [filteredGuestList, setFilteredGuestList] = useState(guestList || []);
  const [responseFilter, setResponseFilter] = useState({
    value: "responded",
    label: "Responded"
  });
  const [attendingFilter, setAttendingFilter] = useState({
    value: "attending",
    label: "Attending"
  });
  const [stats, setStats] = useState({
    total: 0,
    attending: 0,
    notAttending: 0,
    pending: 0
  });

  useEffect(() => {
    let total = guestList.length;
    let attending = 0;
    let notAttending = 0;
    let pending = 0;

    for (let i = 0; i < guestList.length; i++) {
      if (!guestList[i].responded) {
        pending += 1;
      } else if (guestList[i].attending) {
        attending += guestList[i].party_size || 1;
      } else {
        notAttending += 1;
      }
    }

    setStats({ total, attending, notAttending, pending });
  }, [ guestList ]);
  useEffect(() => {
    const list = guestList
      .filter(guest => {
        return (
          (responseFilter.value === "all" ||
            (responseFilter.value === "responded" && guest.responded > 0) ||
            (responseFilter.value === "notresponded" &&
              !Boolean(guest.responded))) &&
          (attendingFilter.value === "all" ||
            (attendingFilter.value === "attending" && guest.attending) ||
            (attendingFilter.value === "notattending" && !guest.attending))
        );
      })
      .sort((el1, el2) => {
        if (el1.responded && el1.attending) return -1;
        else if (!el1.responded) return 0;
        else return 1;
      });
    setFilteredGuestList(list);
  }, [guestList, responseFilter, attendingFilter]);

  const handleFilterChange = filter => {
    switch (filter) {
      case "response":
        return f => {
          setResponseFilter(f);
        };
      case "attending":
        return f => {
          setAttendingFilter(f);
        };
    }
  };

  const optionsResponded = [
    { value: "all", label: "All" },
    { value: "responded", label: "Responded" },
    { value: "notresponded", label: "No Response" }
  ];

  const optionsAttending = [
    { value: "all", label: "All" },
    { value: "attending", label: "Attending" },
    { value: "notattending", label: "Not Attending" }
  ];

  return (
    <div className="custom-container">
      <div className="guest-list-info-container">
        <h1 className="guest-list-header">Guest List</h1>
        <button style={{ float: "right" }} onClick={onSignOut}>
          Log Out
        </button>
        <div className="filters flex">
          <div className="filter-group flex-1">
            <label htmlFor="response">Response: </label>
            <Select
              value={responseFilter}
              onChange={handleFilterChange("response")}
              options={optionsResponded}
            />
          </div>
          <div className="filter-group flex-1">
            <label htmlFor="response">Attending: </label>
            <Select
              value={attendingFilter}
              onChange={handleFilterChange("attending")}
              options={optionsAttending}
            />
          </div>
        </div>
        <div className="flex">
          <div className="total-guests flex-1">
            Total Invitations: {stats.total}
          </div>
          <div className="total-guests flex-1">
            Attending: {stats.attending} Souls
          </div>
          <div className="total-guests flex-1">
            Not Attending: {stats.notAttending}
          </div>
          <div className="total-guests flex-1">
            Pending Invitations: {stats.pending}
          </div>
        </div>
      </div>
      <div className="guest_list_table">
        {filteredGuestList &&
          filteredGuestList.map(guest => (
            <div
              className={
                "guest_information " +
                (guest.responded
                  ? guest.attending
                    ? "attending"
                    : "notattending"
                  : "pending")
              }
              key={guest.first_name + "_" + guest.last_name}
            >
              <div className="guest_header">
                <div className="guest_size">
                  <div className="guest_party_size">{guest.party_size}</div>
                </div>
                <div className="guest_name">{`${guest.first_name} ${guest.last_name}`}</div>
                {guest.email && (
                  <div className="guest_email">
                    <a href={`mailto:${guest.email}`}>
                      {`Email: ${guest.email}`}
                    </a>
                  </div>
                )}
              </div>
              <div className="guest_details">
                <div className="guest_drinkability">{`Drink Rating: ${guest.drinkability}`}</div>
                <div className="guest_dietary">{`Dietary Comments: ${guest.dietary}`}</div>
              </div>
              <div className="attending-marker">
                <i
                  className={`fa fa-${
                    guest.responded
                      ? guest.attending
                        ? "check"
                        : "times"
                      : "question"
                  }`}
                ></i>{" "}
                {`${
                  guest.responded
                    ? guest.attending
                      ? "Attending"
                      : "Not Attending"
                    : "Awaiting Response"
                }`}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Admin;
