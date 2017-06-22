var React = require('react');
var PropTypes = require('prop-types');
var moment = require('moment');
var qq = require('fine-uploader/lib/core');
var wNumb = require('wnumb');
var noUiSlider = require('nouislider');
require('nouislider/distribute/nouislider.css');

var api = require('../../utils/api');

class ProfileSearch extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      video_context: props.video_context,
      profile_id: null,
      profile_path: null,
      start_time: null,
      end_time: null,
      uploader: null
    }
    this.updateProfileId = this.updateProfileId.bind(this);
    this.updateProfilePath = this.updateProfilePath.bind(this);
    this.updateStartTime = this.updateStartTime.bind(this);
    this.updateEndTime = this.updateEndTime.bind(this);
    this.submitProfileSearch = this.submitProfileSearch.bind(this);
  }

  updateProfileId(id){
    this.setState({profile_id: id});
  }
  updateProfilePath(name){
    this.setState({profile_path: name});
  }
  updateStartTime(st){
    this.setState({start_time: parseInt(st)});
  }
  updateEndTime(et){
    this.setState({end_time: parseInt(et)});
  }
  submitProfileSearch(){
    var params = {
      profile_id: this.state.profile_id,
      video_id: this.state.video_context.id,
      start_time: this.state.start_time,
      end_time: this.state.end_time
    }
    api.searchProfile(params)
      .then((res) => {
        this.props.onSearchDispatched(res.id);
      });
  }
  componentDidMount(){
    var search_slider = document.getElementById("video-search-range");
    noUiSlider.create(search_slider, {
      start: [this.state.video_context.start_time, this.state.video_context.end_time],
      connect: true,
      margin: 60000,
      step: 1000,
      format: wNumb({
        decimals: 0
      }),
      range: {
        'min': this.state.video_context.start_time,
        'max': this.state.video_context.end_time
      }
    });

    search_slider.noUiSlider.on('update', (values, handle) => {
      if(handle === 0){
        this.updateStartTime(values[handle]);
      }
      else {
        this.updateEndTime(values[handle]);
      }
    });

    this.setState({
      uploader: new qq.FineUploaderBasic({
        element: document.getElementById('profile-uploader'),
        button: document.getElementById('select-profile'),
        request: {
          endpoint: '/api/profile',
          inputName: 'file',
        },
        callbacks:{
          onSubmit: (id, name) => {
            this.updateProfilePath(name);
            this.state.uploader.setParams({
              name: name
            });
          },
          onComplete: (id, name, response) => {
            this.updateProfileId(response.id);
          }
        }
      })
    });
  }
  render(){
    return (
      <div>
        <div className="row">
          <div className="col-sm-2">Video:</div>
          <div className="col-sm-10 text-primary">{this.state.video_context.name}</div>
        </div>
        <div className="row">
          <div className="col-sm-2">Start Time:</div>
          <div className="col-sm-10 text-primary">
            {moment(this.state.video_context.start_time).format('DD.MM.YYYY hh:mm:ss')}
          </div>
        </div>
        <div className="row">
          <div className="col-sm-2">Duration:</div>
          <div className="col-sm-10 text-primary">
            {this.state.video_context.duration}
          </div>
        </div>
        <form id="profile-uploader">
          <label className="label-above">1. Select and image</label>
          <div id="select-profile" className="file-upload-input">
            {this.state.profile_path ? this.state.profile_path : 'example-picture.jpg'}
          </div>
        </form>
        <div>
          <label className="label-above">2. Pick a time range</label>
          <div className="row mt-md">
            <div className="col-sm-5 text-right">
              <div>
                {moment(this.state.start_time).format('DD.MM.YYYY')}
              </div>
              <div className="profile-search-time">
                {moment(this.state.start_time).format('hh:mm:ss')}
              </div>
            </div>
            <div className="col-sm-2 text-center text-x-large">-</div>
            <div className="col-sm-5">
              <div>
                {moment(this.state.end_time).format('DD.MM.YYYY')}
              </div>
              <div className="profile-search-time">
                {moment(this.state.end_time).format('hh:mm:ss')}
              </div>
            </div>
          </div>
          <div id="video-search-range" className="nouislider"></div>
        </div>
        <div className="bottom-bar">
          <button 
            onClick={this.submitProfileSearch}
            disabled={!this.state.profile_id || !this.state.start_time || !this.state.end_time}
          >SEARCH</button>
          <button onClick={this.props.onCancel}>CANCEL</button>
        </div>
      </div>
    )
  }
}

ProfileSearch.propTypes = {
  video_context: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onSearchDispatched: PropTypes.func.isRequired
}

module.exports = ProfileSearch;
