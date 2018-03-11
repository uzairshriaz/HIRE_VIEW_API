var mongoose = require('mongoose');
var _ = require('lodash');
var bodyParser = require('body-parser');
const	userModel = mongoose.model('userModel');
const	seekerModel = mongoose.model('seekerModel');
const	answerModel = mongoose.model('answerModel');
const	jobsModel = mongoose.model('jobsModel');
const	jobsRequestModel = mongoose.model('jobsRequestModel');
const	postModel = mongoose.model('postModel');
const	companyModel = mongoose.model('companyModel');
const asyncMap = require('async-map');
const async = require('async');

exports.GET_ALL_JOBS = function(req,res)
{
  console.log("GET_ALL_JOBS");
  jobsModel.find({"status":"1"}).then((jobs)=>{
    res.send(jobs);
  },(error)=>{
    res.send(error);
  });
}

exports.GET_MY_JOBS_REQUEST = function(req,res)
{
  console.log("GET_ALL_JOBS_REQUEST");
  const seekerID = req.params.seekerID;
  jobsRequestModel.find({$and:[{"seekerID":seekerID},{"status":"1"}]}).then((jobRequest)=>{

    res.send(jobRequest);
  },(error)=>{
    res.send(error);
  });
}

exports.GET_MY_JOBS = function(req,res)
{
  const companyID = req.params.companyID;
  jobsModel.find({$and:[{"companyID":companyID},{"status":"1"}]}).then((jobs)=>{

    res.send(jobs);
  },(error)=>{
    res.send(error);
  });
}

exports.GET_ALL_JOB_REQUESTS = function(req,res)
{

  jobsRequestModel.find({"status":"1"}).then((jobsRequest)=>{
    res.send(jobsRequest);
  },(error)=>{
    res.send(error);
  });
}
