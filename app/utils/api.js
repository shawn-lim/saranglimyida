var axios = require('axios');

module.exports = {
  getVideos: function(){
    return axios.get('/api/videos').then(function(res){return res.data;});
  },
  getVideoSlices: function(id){
    return axios.get('/api/videos/'+id+'/slices').then(function(res){return res.data;});
  },
  deleteVideo: function(id){
    return axios.delete('/api/videos/'+id).then(function(res){return res.data;});
  },

  searchProfile: function(params){
    return axios.post('/api/profile_analysis', params).then(function(res){return res.data;});
  },
  getProfileAnalysis: function(id){
    return axios.get('/api/profile_analysis/' + id).then(function(res){return res.data;});
  },

  searchActivity: function(id){
    return axios.post('/api/videos/' + id +'/activity_analysis').then(function(res){return res.data;});
  },
  getActivityAnalysis: function(id){
    return axios.get('/api/videos/' + id +'/activity_analysis').then(function(res){return res.data;});
  }
}
