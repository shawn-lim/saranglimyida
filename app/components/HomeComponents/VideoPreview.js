var React = require('react');
var api = require('../../utils/api');

/* GET FIRST FRAME OF VIDEO CODE */
function getThumbnail (vid_url, canvas){
  // Create a video element.
  var vid = document.createElement("video");

  // We don't want it to start playing yet.
  vid.autoplay = false;
  vid.loop = false;

  // No need for user to see the video itself.
  vid.style.display = "none";

  // This will fire when there's some data loaded for the video, should be at least 1 frame here.
  vid.addEventListener("loadeddata", function()
    {
      // Let's wait another 100ms just in case?
      setTimeout(function()
        {
          // Set it to same dimensions as video.

          // Get the drawing context for canvas.
          var ctx = canvas.getContext("2d");

          // Draw the current frame of video onto canvas.
          ctx.drawImage(vid, 0, 0, 315, 165);

          // Done!
        });
    }, false);

  var source = document.createElement("source");
  source.src = vid_url;
  source.type = "video/mp4";
  vid.appendChild(source);

  // Add video to document to start loading process now.
  document.body.appendChild(vid); 
};

class VideoPreview extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      id: 'vid-'+props.id,
      active: props.active
    }
  }
  componentDidMount() {
    api.getVideoSlices(this.props.id)
      .then(function(res){
        getThumbnail(res[0].filename, document.getElementById(this.state.id));
      }.bind(this))
  }
  render(){
    return (
      <div style={{display:"flex"}}>
        <canvas id={this.state.id}></canvas>
        {this.props.children}
      </div>
    )
  }
}

module.exports = VideoPreview;
