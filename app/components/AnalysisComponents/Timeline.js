var React = require('react');

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

module.exports = Timeline;
