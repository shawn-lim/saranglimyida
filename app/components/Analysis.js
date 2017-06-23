var React = require('react');
var PropTypes = require('prop-types');
var queryString = require('query-string');
var axios = require('axios');

var Timeline = require('./AnalysisComponents/Timeline');
var VideoPlayer = require('./AnalysisComponents/VideoPlayer');
var ActivityList = require('./AnalysisComponents/ActivityList');

var api = require('../utils/api');

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
          {
            this.state.analysis_type === 'activities' && 
              this.state.frame_data && 
              this.state.timeline &&
              <ActivityList
                timeline={this.state.timeline}
                selected_activity={this.state.selected_activity}
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
