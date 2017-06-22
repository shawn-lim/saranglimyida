var React = require('react');

var qq = require('fine-uploader/lib/core');
var filesize = require('filesize');
var moment = require('moment');

class VideoUploader extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      video_name: '',
      video_path: null,
      video_size: null,
      video_start: moment(new Date()).format('YYYY-MM-DDThh:mm:ss'),
      uploader: null,
      uploading: false
    }
    this.updateVideoPath = this.updateVideoPath.bind(this);
    this.updateVideoSize = this.updateVideoSize.bind(this);
    this.updateVideoName = this.updateVideoName.bind(this);
    this.updateVideoStart = this.updateVideoStart.bind(this);
    this.updateUploadProgress = this.updateUploadProgress.bind(this);
    this.registerUploader = this.registerUploader.bind(this);
    this.uploadVideo = this.uploadVideo.bind(this);
    this.cancelDialog = this.cancelDialog.bind(this);
  }

  updateVideoName(e){
    this.setState({video_name: e.target.value});
  }
  updateVideoStart(e){
    this.setState({video_start: e.target.value});
  }
  updateVideoPath(name){
    this.setState({video_path: name});
  }
  updateVideoSize(size){
    this.setState({video_size: size});
  }
  updateUploadProgress(u, t){
    var percentage = u/t*100;
    this.setState({upload_progress: percentage+'%'});
  }

  registerUploader(uploader){
    this.setState({
      uploader: uploader
    });
  }
  cancelDialog(e){
    this.props.onCancel();
    e.preventDefault();
  }
  uploadVideo(e){
    this.state.uploader.setParams({
      name: this.state.video_name,
      start_time: moment(this.state.video_start).valueOf()
    });
    this.state.uploader.uploadStoredFiles();
    this.setState({uploading:true});
    e.preventDefault();
  }
  componentDidMount(){
    this.registerUploader(
      new qq.FineUploaderBasic({
        element: document.getElementById('video-uploader'),
        button: document.getElementById('select-video'),
        autoUpload: false,
        request: {
          endpoint: '/api/videos',
          inputName: 'file',
        },
        callbacks:{
          onSubmit: (id, name) => {
            this.updateVideoPath(name);
            this.updateVideoSize(this.state.uploader.getSize(id));
          },
          onProgress: (id, name, uploaded, total) => {
            this.updateUploadProgress(uploaded, total);
          },
          onAllComplete: (succeeded, failed) => {
            this.props.onComplete();
          }
        }
      })
    );
  }

  render(){
    return (
      <div>
        {
          !this.state.uploading && 
            <form id="video-uploader">
              <hr />
              <div>
                <label className="label-above">Video Clip Directory</label>
                <div id="select-video" className="file-upload-input">
                  { this.state.video_path ? this.state.video_path : 'Select a video'}
                </div>
                <span className="small">{this.state.video_size && 'Size: ' + filesize(this.state.video_size)}</span>
                { this.state.upload_progress }
              </div>
              <div>
                <label className="label-above">Video Name</label>
                <input type="text" name="name" placeholder="Enter a name" value={this.state.video_name} onChange={this.updateVideoName}/>
              </div>
              <div>
                <label className="label-above" htmlFor="time-input">Video Start Time</label>
                <input type="datetime-local" name="start_time" step="1" required value={this.state.video_start} onChange={this.updateVideoStart}/>
              </div>
              <div className="bottom-bar">
                <button onClick={this.uploadVideo}>Submit</button>
                <button onClick={this.cancelDialog}>Close</button>
              </div>
            </form>
        }
        {
          this.state.uploading && 
            <div>
              <hr />
              <h6>Upload Progress:</h6>
              <div className="progress">
                <div className="progress-bar" style={{width: this.state.upload_progress}}></div>
              </div>
            </div>
        }
      </div>
    )
  }
}

module.exports = VideoUploader;
