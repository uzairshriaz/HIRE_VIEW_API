var mongoose = require('mongoose');
var _ = require('lodash');
var base64ToImage = require('base64-to-image');
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
const path = require('path');
const fs = require('fs');
var converter = require('node-base64-image');



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



//get all job by company ID
let userResult1=0;
exports.GET_ALL_JOBS_BY_COMPANY_ID = function(req,res){
  console.log("comapny ID jobs");
  const companyID = req.params.companyID;
  jobsModel.find({$and:[{"companyID":companyID},{"status":"1"}]}).then((jobsResult)=>{
    companyModel.findById(companyID).then((companyResult)=>{
      getUserName(companyResult.userID,function(err,result){
        var obj ={
          "CompanyName":userResult1.name,
          "jobs":jobsResult
        };
        res.send(obj);
      });
    },(companyError)=>{
      res.send(companyError);
    });

  },(jobsError)=>{
    res.send(jobsError);
  });
}
//have one global varible userResult1 used by both get all jobs by comapny id and jobs request by seeker id
function getUserName(userID,callback)
{
  userModel.findOne({$and:[{"_id":userID},{"status":"1"}]}).then((userResult)=>{
    //console.log(userResult);
    userResult1 = userResult;
     return callback(userResult);
  },(userError)=>{
    return res.send(userError);
  });
}
// end of get all job by company ID

//get all jobs request by seeker id
exports.GET_ALL_JOBS_REQUEST_BY_SEEKER_ID = function(req,res){
  const seekerID = req.params.seekerID;
  jobsRequestModel.find({$and:[{"seekerID":seekerID},{"status":"1"}]}).then((jobsRequestResult)=>{
    seekerModel.findById(seekerID).then((seekerResult)=>{
      getUserName(seekerResult.userID,function(err,result2){
        var obj = {
          "seekerName":userResult1.name,
          "jobsRequest": jobsRequestResult
        };
        res.send(obj);
      });
    },(seekerError)=>{
      res.send(seekerError);
    });

  },(jobsRequestError)=>{
    res.send(jobsRequestError);
  });
}
//end of get all jobs request by seeker id
//get All jobs
arrayForAllJobs = [];
arrayForAllCompanies =[];
arrayForAllUsers =[];
arrayForSendingData =[];
exports.GET_ALL_JOBS=function(req,res){
  jobsModel.find({"status":"1"}).then((jobsResult)=>{
    arrayForAllJobs = jobsResult;
    //console.log(arrayForAllJobs);
    getCompanyIDs(arrayForAllJobs,function(err,comapanyIDs){
    //  console.log(arrayForAllCompanies);
      getUsersIDs(arrayForAllCompanies,function(err,UsersIDs){
      //  console.log(arrayForAllUsers);
        //console.log(arrayForAllJobs);
        //console.log(arrayForAllCompanies);
        var count=0;
        for(var i=0;i<arrayForAllJobs.length;i++)
        {
          count++;
          var obj = {
            "companyName":arrayForAllUsers[i].name,
            "companyStatus":arrayForAllCompanies[i].status,
            "jobs":arrayForAllJobs[i]
          };
          arrayForSendingData.push(obj);
          if(count == arrayForAllJobs.length)
          {
            res.send(arrayForSendingData);

            arrayForAllJobs.length =0;
            arrayForAllCompanies.length=0;
            arrayForAllUsers.length=0;
            arrayForSendingData.length=0;
          }
        }
      });
    });
    //console.log(arrayForAllJobs);
  },(jobsError)=>{
    res.send(jobsError);
  });
}
function getCompanyIDs(arrayForAllJobs,callback)
{
  //console.log(arrayForAllJobs);
  async.each(arrayForAllJobs,getCompanies,function(err){
    callback();
  });
}
function getCompanies(item,doneCallback){
  companyModel.findById(item.companyID).then((companyResult)=>{
    arrayForAllCompanies.push(companyResult);
  },(companyError)=>{
    res.send(companyError);
  }).then(()=>{
    doneCallback();
  },(err)=>{res.send(err);})
}

function getUsersIDs(arrayForAllCompanies,getUsercallback){
  async.each(arrayForAllCompanies,getUsers,function(err){
    getUsercallback();
  });
}
function getUsers(item,doneCallback1){
  userModel.findById(item.userID).then((userResult)=>{
    arrayForAllUsers.push(userResult);
  },(userError)=>{
    res.send(userError);
  }).then(()=>{
    doneCallback1();
  },(err)=>{res.send(userError);});

}
// end of get All jobs

//get all jobs Request
arrayForJobsRequests = [];
arrayForSeekers = [];
exports.GET_ALL_JOBS_REQUESTS = function(req,res){
  jobsRequestModel.find({"status":"1"}).then((jobsRequestResult)=>{
    arrayForJobsRequests = jobsRequestResult;
    //console.log(arrayForJobsRequests);
    getSeekers(arrayForJobsRequests,function(err){
    //console.log(arrayForSeekers);
      getUsersIDs(arrayForSeekers,function(err){
      //  console.log(arrayForAllUsers.length);
        var count=0;
        for(var i = 0;i<arrayForJobsRequests.length;i++)
        {
          console.log("hahah");
          count++;
          var obj={

            "seekerName":arrayForAllUsers[i].name,
            "jobsRequest":arrayForJobsRequests[i]
          };

          arrayForSendingData.push(obj);
        }
        if(count == arrayForJobsRequests.length){

            res.send(arrayForSendingData);

            arrayForJobsRequests.length =0;
            arrayForSeekers.length = 0;
            arrayForAllUsers.length=0;
            arrayForSendingData.length = 0;
            count == 0;
        }
      });

    });
  },(jobsRequestError)=>{
    res.send(jobsRequestError);
  });

}
function getSeekers(arrayForJobsRequests,callback){
  async.each(arrayForJobsRequests,getseekersData,function(err){
    callback();
  });
}
function getseekersData(item,getSeekerCallback){
  seekerModel.findById(item.seekerID).then((seekerResult)=>{
    arrayForSeekers.push(seekerResult);
  },(seekerError)=>{
    res.send(seeker);
  }).then(()=>{
    getSeekerCallback();
  },(err)=>{
    res.send(err)
  });

}
//save image
exports.SAVE_IMAGE =function(req,res){
    const imageType = req.body.ImageType;
    const base64str = req.body.base64string;
    const userID=req.body.userID;
    var appDir = path.dirname(require.main.filename);

    const saveName = "img" + Date.now() + "." + imageType;
    const path1 = appDir + "/images/" + saveName;

    //console.log(path1);

    fs.writeFile(path1, base64str, 'base64', function(err) {
        if(err)
        {
          return res.send(err);
        }
        else{
          userModel.findById(userID).then((userResult)=>{
            //console.log(userResult);
            userResult.userImage = saveName;
            userResult.save().then((updatedUserObj)=>{res.send(updatedUserObj);},(err)=>{res.send(err);});

          },(userError)=>{
            return res.send(userError);
          });
        }
    });
}
exports.GET_IMAGE =function(req,res){
  const imagePath = req.params.imagePath;
  var arr = imagePath.split('.');
  var newPath = "C:\\nodeProjects\\hireView\\images\\"+imagePath;
  console.log(newPath);
  if(fs.existsSync(newPath)){
    var img = fs.readFileSync(newPath);
    res.writeHead(200, {'Content-Type': 'image/'+arr[1] });
    res.end(img,'binary');
}


}
