var React = require('react');

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

module.exports = VideoPlayer;

