var React = require('react');

var Activity = require('./Activity');

class ActivityList extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      activities: [],
      timeline: props.timeline,
      frame_data: props.frame_data,
      onSelectActivity: props.onSelectActivity
    }
    this.registerActivities = this.registerActivities.bind(this);
    this.processFrameData = this.processFrameData.bind(this);
  }
  registerActivities(activities){
    this.setState({activities: activities});
  }
  processFrameData(frame_data){
    var activities = [];
    var actions={};
    var poi = {};
    frame_data.map(function(res){
      res.actions.map(function(a){
        if(!actions[a.action]){actions[a.action] = [];}
        actions[a.action].push({
          start: parseInt(res.start_time),
          end: parseInt(res.end_time),
          confidence: Math.round(a.probability * 100)
        });
      });
    });
    for(var action in actions){
      var slices = actions[action];
      slices.sort(function(a,b){
        return a.start-b.start;
      });
      var tmp = {
        action: action,
        slices: slices,
        highest_confidence: 0
      };
      tmp.pois = [];
      var poi = {};
      var prev;
      slices.map(function(slice){
        if(!poi.start){
          poi.start = slice.start;
          poi.confidence = slice.confidence;
          tmp.highest_confidence = Math.max(tmp.highest_confidence, slice.confidence);
        }
        else if (slice.start !== prev){
          poi.end = prev;
          tmp.pois.push(poi);
          poi = {};
        }
        prev = slice.end;
      });
      poi.end = prev;
      tmp.pois.push(poi);
      tmp.pois.map((poi)=>{
        poi.pos_start = (poi.start - this.state.timeline.beginning) / this.state.timeline.total * 100;
        poi.pos_length = (poi.end - poi.start) / this.state.timeline.total * 100;
        poi.style = {
          left: poi.pos_start + '%',
          width: poi.pos_length + '%'
        }
      });
      activities.push(tmp);
    }
    activities = activities.sort(function(a,b){
      return b.highest_confidence - a.highest_confidence;
    });
    this.registerActivities(activities);
    console.log(activities);
  }
  componentDidMount(){
    this.processFrameData(this.state.frame_data);
  }
  render(){
    var sa = this.props.selected_activity;
    return (
      <div className="activity-container">
        {this.state.activities.map((activity)=>{
          return(
            <Activity
              key={activity.action}
              activity={activity}
              onClick={this.state.onSelectActivity}
              is_active={sa && sa.action === activity.action}
            >
            </Activity>
          )
        })}
      </div>
    )
  }
}
module.exports = ActivityList;
