var React = require('react');
var PropTypes = require('prop-types');
var queryString = require('query-string');
var axios = require('axios');

var api = require('../utils/api');

class VideoPlayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onPlayNext: this.props.onPlayNext
    }
  }

  componentDidMount(){
    /* Auto move to next clip */
    document.getElementById('main-player').addEventListener('ended', () => {
      this.state.onPlayNext();
    }, false);
  }
  render(){
    var url = this.props.current_video ? this.props.current_video.filename : null;
    var bounding_box = this.props.bounding_box || false;
    return (
      <div className="player-container">
        <div className="main-player-container">
          <div className={"video-status " + (this.props.current_video ? "text-success" : "text-danger")}>
            <div className="triangle-topleft"></div>
            <i className="fa fa-circle display-inline"></i>
            <p className="no-margin">
              {this.props.current_video ? 
                  <span>REPLAY: <span className="text-grey">&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;CAM#3124</span></span>
                  :
                  <span>NO PLAYBACK</span>
              }
            </p>
          </div>
          <video id="main-player" src={url} type="video/mp4"></video>
          {bounding_box &&
              <div className="bounding-box" style={bounding_box}>
                <div className="bounding-box-info">
                  Subject 1
                  Detected at Camera 1
                  At 21:00:21 PM
                </div>
              </div>
          }
        </div>
      </div>
    )
  }
}
class Timeline extends React.Component {
  render(){
    var now = this.props.current_time;
    var bounds = this.props.timeline.bounds || {};
    var pois = this.props.timeline.pois || [];
    return (
      <div className="timeline">
        <div className="play-marker" style={{left: now + '%' }}></div>
        <div className="search-marker start" style={bounds.start}></div>
        <div className="search-marker end" style={bounds.end}></div>
        {pois.map((poi,index) => {
          return (
            <div key={index} className="poi" style={poi.style} onClick={this.props.onJump.bind(null, poi.start - 1500)}>
              <div className="time-marker-container">
                <div className="time-marker start"></div>
                <div className="time-marker end"></div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

class ActivityList extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      activities: [],
      timeline: this.props.timeline,
      frame_data: this.props.frame_data,
      onSelectActivity: this.props.onSelectActivity
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
    return (
      <div className="activity-container">
        {this.state.activities.map((activity)=>{
          return(
            <div key={activity.action}>
              <button onClick={this.state.onSelectActivity.bind(null, activity)}>
                {activity.action}
              </button>
            </div>
          )
        })}
      </div>
    )
  }
}
class Analysis extends React.Component {
  constructor(props){
    super(props)

    var params = queryString.parse(this.props.location.search);

    this.state = {
      id: params.id,
      videos: null,
      current_video: null,
      current_video_index: -1,
      analysis_type: params.type,
      frame_data: null,
      timeline: null,
      selected_activity: null,
      pois: null,
      error: null
    }
    this.play = this.play.bind(this);
    this.setVideo = this.setVideo.bind(this);
    this.jumpTo = this.jumpTo.bind(this);
    this.pollTime = this.pollTime.bind(this);
    this.buildTimeline = this.buildTimeline.bind(this);
    this.updateCurrentTime = this.updateCurrentTime.bind(this);
    this.playNextVideo = this.playNextVideo.bind(this);
    this.registerFrameData = this.registerFrameData.bind(this);
    this.registerVideoClips = this.registerVideoClips.bind(this);
    this.updateActivity = this.updateActivity.bind(this);
    this.handleError = this.handleError.bind(this);
  }
  play(vid, time){
    if(vid !== this.state.current_video_index){
      this.setVideo(vid);
    }
    if(time){
      document.getElementById('main-player').currentTime = time / 1000;
    }
    document.getElementById('main-player').play();
    this.pollTime();
  }
  setVideo(i){
    this.setState({
      current_video: this.state.videos[i],
      current_video_index: i
    });
  }
  jumpTo(time){
    var index = this.state.videos.findIndex((vid) => {
      return vid.ends_at > time;
    });
    time -= this.state.videos[index].starts_at;
    this.play(index, time);
  }
  updateCurrentTime(t){
    this.setState({current_time: t});
  }
  pollTime() {
    var player_time = document.getElementById('main-player').currentTime * 1000;
    var vid = this.state.videos[this.state.current_video_index];
    if(vid){
      var total_elapsed = player_time + (vid.starts_at - this.state.timeline.beginning) + ( vid.total_skipped || 0 );
      this.updateCurrentTime(total_elapsed / this.state.timeline.total * 100);
    }
    // TODO : PAUSE POLL WHEN VIDEO IS PAUSED
    setTimeout(this.pollTime, 30);
  }

  /* Build the timeline from a video library. */
  buildTimeline(analysis){
    var timeline = {};
    var ss = analysis.starts_at;
    var se = analysis.ends_at;

    timeline.beginning = this.state.videos[0].starts_at;
    var prev = this.state.videos[0].starts_at;

    timeline.total = this.state.videos.reduce((total, video, index) => {
      var val = video.ends_at - prev + total;
      prev = video.ends_at;
      return val;
    }, 0);

    var sw = ((ss - timeline.beginning) / timeline.total * 100) || 0;
    var ew = ((timeline.total - (se - timeline.beginning)) / timeline.total * 100) || 0;
    timeline.bounds = {
      start: {
        left: 0,
        width: sw + '%'
      },
      end: {
        right: 0,
        width: ew + '%'
      }
    }
    this.setState({timeline: timeline});
  }

  playNextVideo(){
    if(this.state.current_video_index < this.state.videos.length-1){
      this.play(this.state.current_video_index+1);
    }
  }
  registerFrameData(frame_data){
    this.setState({frame_data: frame_data});
  }
  registerVideoClips(videos){
    this.setState({videos: videos});
  }

  updateActivity(activity){
    this.setState(function(prev){
      var tmp = {selected_activity: activity};
      tmp.timeline = prev.timeline;
      tmp.timeline.pois = activity.pois;
      return tmp;
    });
  }
  handleError(err){
    this.setState({error: err});
  }
  componentDidMount(){
    if(this.state.analysis_type === 'profile'){
      api.getProfileAnalysis(this.state.id)
        .then(function(res){
          console.log(res);
        });
    }
    else if (this.state.analysis_type === 'activities'){
      axios.all([
        api.getActivityAnalysis(this.state.id),
        api.getVideoSlices(this.state.id)
      ]).then((res) => {
        this.registerVideoClips(res[1]);
        this.registerFrameData(res[0].slices);
        this.buildTimeline(res[0])
        this.play(0);
      })
    }
    else {
      this.handleError('Invalid Activity');
    }

  }
  render(){
    return (
      <div className="container-fluid">
        <section className="analysis-video-information">
          {!this.state.error ? 
              <div className="row">
                <div className="col-sm-3">
                  <label className="label-above">Analysis Type:</label>
                  <p className="text-primary text-capitalize">{this.state.analysis_type}</p>
                </div>
                <div className="col-sm-3"></div>
                <div className="col-sm-3"></div>
                <div className="col-sm-3"></div>
              </div>
              :
              <h3 className="text-large text-danger no-margin">
                Error: {this.state.error}
              </h3>
          }
        </section>
        <section className="main-section-container">
          {this.state.frame_data && this.state.timeline &&
              <ActivityList
                timeline={this.state.timeline}
                frame_data={this.state.frame_data}
                onSelectActivity={this.updateActivity}
              ></ActivityList>
          }
          {this.state.timeline &&
              <div>
                <VideoPlayer 
                  current_video={this.state.current_video} 
                  frame_data={this.state.frame_data}
                  onPlayNext={this.playNextVideo}
                ></VideoPlayer>
                <Timeline
                  current_time={this.state.current_time}
                  timeline={this.state.timeline}
                  onJump={this.jumpTo}
                ></Timeline>
              </div>
          }
        </section>
      </div>
    )
  }
}

module.exports = Analysis;
