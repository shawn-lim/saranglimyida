var React = require('react');

class Activity extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      activity: props.activity,
      onClick: props.onClick
    }
  }
  render(){
    var a = this.state.activity;
    var is_active = this.props.is_active;
    return (
      <div 
        className={"activity " + (is_active ? 'active' : '') }
        onClick={this.state.onClick.bind(null, this.state.activity)}>
        <h4 className="no-margin">{a.action}</h4>
        <div>
          <label className="label-above">
            Highest Confidence:
          </label>
          <p className="text-x-large text-primary text-center">{a.highest_confidence}%</p>
        </div>
      </div>
    )
  }
}

module.exports = Activity;
