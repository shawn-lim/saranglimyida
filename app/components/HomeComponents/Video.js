var React = require('react');
var PropTypes = require('prop-types');
var moment = require('moment');

var helper = require('../../utils/helper');

var VideoPreview = require('./VideoPreview');

class Video extends React.Component {
  render(){
    var id = this.props.video.id;
    var name = this.props.video.name;
    var start = moment(this.props.video.start_time);
    var end = moment(this.props.video.end_time);
    var duration = this.props.video.duration;
    var activities = this.props.video.has_activities;
    var onClick = this.props.onClick;
    var is_active = this.props.is_active;
    return (
      <div className={"video-preview-container "+(is_active ? 'active' : '')} onClick={onClick}>
        <VideoPreview id={id}>
          <div className="video-info">
            <div className="row">
              <div className="col-sm-4"><label>Video Name:</label></div>
              <div className="col-sm-8"><span className="text-grey">{name}</span></div>
            </div>
            <div className="row">
              <div className="col-sm-4"><label>Location:</label></div>
              <div className="col-sm-8"><span className="text-grey">Random Location</span></div>
            </div>
            <div className="row">
              <div className="col-sm-4"><label>Video Length:</label></div>
              <div className="col-sm-8">
                <span className="text-grey">
                  {duration}
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4"><label>Activity Analysis:</label></div>
              <div className="col-sm-8">
                { activities ? 
                    <span className="text-success">Completed</span>
                    :
                    <span className="text-danger">Incomplete</span>
                }
              </div>
            </div>
          </div>
        </VideoPreview>
      </div>
    )
  }
}

Video.propTypes = {
  video: PropTypes.object.isRequired
}

module.exports = Video;
