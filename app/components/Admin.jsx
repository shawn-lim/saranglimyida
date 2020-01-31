import React from "react";
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

      const list = Object.keys(raw).map((key) => {
        total += raw[key].party_size * raw[key].attending
        return raw[key];
      })

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
  return (
    <div className="custom-container">
      <div className="guest-list-info-container">
        <h1 className="guest-list-header">Guest List</h1>
        <button style={{ float: "right" }} onClick={onSignOut}>
          Log Out
        </button>
        <div className="total-guests"> Total Guests RSVP: {total} </div>
      </div>
      <div className="guest_list_table">
        {guestList &&
          guestList.map(guest => (
            <div className="guest_information">
              <div className="guest_header">
                <div className="guest_size">
                  <div className="guest_party_size">{guest.party_size}</div>
                </div>
                <div className="guest_name">{`${guest.first_name} ${guest.last_name}`}</div>
              </div>
              <div className="guest_details">
                <div className="guest_drinkability">{`Drink Rating: ${guest.drinkability}`}</div>
                <div className="guest_dietary">{`Dietary Comments: ${guest.dietary}`}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Admin;
