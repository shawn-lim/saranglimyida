var React = require('react');
var Modal = require('react-modal').default;
var PropTypes = require('prop-types');

var Video = require('./HomeComponents/Video');
var VideoSidebar = require('./HomeComponents/VideoSidebar');
var VideoUploader = require('./HomeComponents/VideoUploader');
var ProfileSearch = require('./HomeComponents/ProfileSearch');

var api = require('../utils/api');
var helper = require('../utils/helper');

function VideoContainerHeader (props){
  return (
    <div className="row">
      <div className="col-sm-8">
        <h2 className="no-margin">Videos</h2>
      </div>
      <div className="col-sm-4 text-right">
        <button onClick={props.openImportModal}>Import Video</button>
      </div>
    </div>
  )
}

VideoContainerHeader.propTypes = {
  openImportModal: PropTypes.func.isRequired
}

class Home extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      selected_video: null,
      videos: [],
      profile_analysis: null,
      import_modal_open: false,
      delete_modal_open: false
    }

    this.getVideos = this.getVideos.bind(this);
    this.selectVideo = this.selectVideo.bind(this);
    this.deleteVideo = this.deleteVideo.bind(this);

    this.updateProfileAnalysis = this.updateProfileAnalysis.bind(this);
    this.checkProfileAnalysis = this.checkProfileAnalysis.bind(this);
    this.searchProfile = this.searchProfile.bind(this);

    this.updateActivityAnalysis = this.updateActivityAnalysis.bind(this);
    this.checkActivityAnalysis = this.checkActivityAnalysis.bind(this);
    this.searchActivity = this.searchActivity.bind(this);

    this.openImportModal = this.openImportModal.bind(this);
    this.closeImportModal = this.closeImportModal.bind(this);

    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);

    this.openProfileModal = this.openProfileModal.bind(this);
    this.closeProfileModal = this.closeProfileModal.bind(this);

    this.completeUpload = this.completeUpload.bind(this);
  }

  /* Modals */
  openImportModal(){
    this.setState({import_modal_open:true});
  }
  closeImportModal(){
    this.setState({import_modal_open:false});
  }

  openDeleteModal(){
    this.setState({delete_modal_open: true});
  }
  closeDeleteModal(){
    this.setState({delete_modal_open: false});
  }

  openProfileModal(){
    this.setState({profile_modal_open: true});
  }
  closeProfileModal(){
    this.setState({profile_modal_open: false});
  }

  updateProfileAnalysis(pa){
    this.setState({profile_analysis: pa});
  }
  updateActivityAnalysis(aa){
    this.setState({activity_analysis: aa});
  }

  checkProfileAnalysis(id){
    api.getProfileAnalysis(id)
      .then((res) => {
        this.updateProfileAnalysis(res);
        if(this.state.profile_analysis.status !== 'Done'){
          setTimeout(()=>{this.checkProfileAnalysis(id);},3000);
        }
      });
  }
  checkActivityAnalysis(id){
    api.getActivityAnalysis(id)
      .then((res) => {
        this.updateActivityAnalysis(res);
        if(this.state.activity_analysis.status !== 'Done'){
          setTimeout(()=>{this.checkActivityAnalysis(id);},3000);
        }
        else{
          this.getVideos();
        }
      });
  }

  searchProfile(id){
    this.closeProfileModal();
    this.checkProfileAnalysis(id);
  }
  searchActivity(){
    api.searchActivity(this.state.selected_video.id)
      .then((res) => {
        console.log(res);
        this.checkActivityAnalysis(this.state.selected_video.id);
      })
  }
  deleteVideo(){
    api.deleteVideo(this.state.selected_video.id)
      .then((res) => {
        this.getVideos();
        this.closeDeleteModal();
        this.setState({selected_video: null});
      });
  }

  getVideos(){
    api.getVideos()
      .then((res) => {
        this.setState({videos: res});
      })
  }
  selectVideo(video) {
    this.updateProfileAnalysis(null);
    this.setState({selected_video: video});
  }
  completeUpload(){
    this.closeImportModal();
    this.getVideos();
  }

  componentDidMount (){
    this.getVideos();
  }
  render(){
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-lg-9">
              <div className="video-container">
                <VideoContainerHeader openImportModal={this.openImportModal}></VideoContainerHeader>
                <hr />

                {this.state.videos.length && this.state.videos.map(function(video, index){
                  video.duration = helper.millisecondsToStr(video.end_time - video.start_time);
                  return (
                    <Video 
                      key={index} 
                      video={video}
                      onClick={this.selectVideo.bind(null, video)}
                      is_active={this.state.selected_video && this.state.selected_video.id === video.id}
                    ></Video>
                  )
                }.bind(this))}
                {!this.state.videos.length && 
                    <div className="text-center">
                      <h4>No Videos Found</h4>
                    </div>
                }
              </div>
            </div>
            <div className="col-lg-3">
              {this.state.selected_video ? 
                  <VideoSidebar
                    selected_video={this.state.selected_video}
                    profile_analysis={this.state.profile_analysis}
                    activity_analysis={this.state.activity_analysis}
                    onProfileSearch={this.openProfileModal}
                    onActivitySearch={this.searchActivity}
                    onRequestDelete={this.openDeleteModal}
                    onClearProfileAnalysis={this.updateProfileAnalysis}
                  ></VideoSidebar>
                  :
                  <div className="video-information-container">
                    <h6>No Video Selected</h6>
                  </div>
              }
            </div>
          </div>
        </div>

        {/** ------------------------------------- **/}
        {/**          MODAL DECLARATIONS           **/}
        {/** ------------------------------------- **/}
        <Modal
          isOpen={this.state.delete_modal_open && this.state.selected_video !== null}
          onRequestClose={this.closeDeleteModal}
          contentLabel="Delete Video"
        >
          <h4>Are you sure?</h4>
          <hr />
          <p>Are you sure you want to delete this video '{this.state.selected_video && this.state.selected_video.name}'?</p>
          <div className="bottom-bar">
            <button onClick={this.deleteVideo}>CONFIRM</button>
            <button onClick={this.closeDeleteModal}>CANCEL</button>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.import_modal_open}
          onRequestClose={this.closeImportModal}
          contentLabel="Import Video"
        >
          <h4>Import Video</h4>
          <VideoUploader onComplete={this.completeUpload} onCancel={this.closeImportModal}></VideoUploader>
        </Modal>
        <Modal
          isOpen={this.state.profile_modal_open}
          onRequestClose={this.closeProfileSearchModal}
          contentLabel="Profile Search"
        >
          <h4>Profile Search</h4>
          <ProfileSearch
            video_context={this.state.selected_video}
            onCancel={this.closeProfileModal}
            onSearchDispatched={this.searchProfile}
          ></ProfileSearch>
        </Modal>
        {/** ------------------------------------- **/}
        {/**         END MODAL DECLARATIONS        **/}
        {/** ------------------------------------- **/}
      </div>
    )
  }
}

module.exports = Home;
