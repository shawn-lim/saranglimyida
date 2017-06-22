var React = require('react');
var PropTypes = require('prop-types');

var moment = require('moment');

class VideoSidebar extends React.Component {
  render(){
    var pa = this.props.profile_analysis;
    var aa = this.props.activity_analysis;
    var selected_video = this.props.selected_video;
    var onProfileSearch = this.props.onProfileSearch;
    var onActivitySearch = this.props.onActivitySearch;
    var onRequestDelete = this.props.onRequestDelete;
    var onClearProfileAnalysis = this.props.onClearProfileAnalysis;

    return (
      <div className="video-information-container">
        <section className="video-information">
          <div>
            <label className="label-above">Video Name:</label>
            <p className="text-primary">{selected_video.name}</p>
          </div>
          <div>
            <label className="label-above">Video Length:</label>
            <p className="text-primary">{selected_video.duration}</p>
          </div>
        </section>
        <section className="analysis-section mt-lg">
          <h4>Analysis Section</h4>
          <div>
            <label>Personnel Search</label>
            {pa ? 
                <div>
                  <div className="text-center">
                    {pa.status === 'Done' && (
                      pa.frames.length === 0 ? 
                      <div>
                        <p className="text-grey text-large">No Matches</p>
                        <button onClick={onClearProfileAnalysis.bind(null, null)}>Clear Results</button>
                      </div>
                      :
                      <div>
                        <p className="text-success text-large">Match Found</p>
                        <button>View Results</button>
                      </div>
                    )}
                    {pa.status === 'Created' &&
                        <h6 className="text-center">Searching in Progress...</h6>
                    }
                  </div>
                  <h6>{pa.profile.name}</h6>
                  <div className="profile-preview" style={{backgroundImage:'url('+encodeURI(pa.profile.path)+')'}}/>
                  <div>
                    <label className="label-above">Search From:</label>
                    <p className="text-primary">{moment(pa.starts_at).format('DD.MM.YYYY hh:mm:ss')}</p>
                  </div>
                  <div>
                    <label className="label-above">Search To:</label>
                    <p className="text-primary">{moment(pa.ends_at).format('DD.MM.YYYY hh:mm:ss')}</p>
                  </div>
                </div>
                :
                <button className="full-width" onClick={onProfileSearch}>Search for Person</button>
            }
          </div>
          <hr />
          <div>
            <label>Activity Analysis</label>
            { aa ?
                (aa.status === 'Done' ? 
                  <div>
                    <p className="text-success">Analysis Completed.</p>
                    <button className="full-width">View Activities</button>
                  </div>
                  :
                  <p>Analysis in Progress...</p>
                )
                :
                (selected_video.has_activities ? 
                  <div>
                    <p className="text-success">Analysis Completed.</p>
                    <button className="full-width">View Activities</button>
                  </div>
                  :
                  <button className="full-width" onClick={onActivitySearch}>Begin Activity Analysis</button>
                )
            }
          </div>
        </section>
        <section className="bottom-bar">
          <button 
            className="btn-danger"
            onClick={onRequestDelete}>
            <i className="fa fa-trash-o"></i>
            Delete Video
          </button>
        </section>
      </div>
    )
  }
}

VideoSidebar.propTypes = {
  pa: PropTypes.object,
  aa: PropTypes.object,
  selected_video: PropTypes.object,
  onActivitySearch: PropTypes.func.isRequired,
  onProfileSearch: PropTypes.func.isRequired,
  onRequestDelete: PropTypes.func.isRequired,
  onClearProfileAnalysis: PropTypes.func.isRequired
}

module.exports = VideoSidebar;
