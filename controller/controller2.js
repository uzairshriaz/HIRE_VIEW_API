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
const	educationModel = mongoose.model('educationModel');
const expereinceModel = mongoose.model('expereinceModel');
const asyncMap = require('async-map');
const async = require('async');
const path = require('path');
const fs = require('fs');
var converter = require('node-base64-image');
const elasticsearch = require('elasticsearch');
var forEachAsync = require('forEachAsync').forEachAsync;
const FCM = require('fcm-node');




exports.GET_MY_JOBS_REQUEST = function(req,res)
{
  array=[];
  temp=0;
  console.log("GET_MY_JOBS_REQUEST");
  const seekerID = req.params.seekerID;
  jobsRequestModel.find({$and:[{"seekerID":seekerID},{"status":"1"}]}).then((jobRequest)=>{
    //console.log(jobRequest);
    seekerModel.findOne({"_id":seekerID}).then((seekerResult)=>{
      userModel.findOne({"_id":seekerResult.userID}).then((userResult)=>{
      //  console.log(userResult);
      for(var i=0;i<jobRequest.length;i++)
      {
        temp++;
        var obj={

          "seekerName":userResult.name,
          "jobsRequest":jobRequest[i],
          "seekerLogo":userResult.userImage
        };
        array.push(obj);
      }
      if(temp==jobRequest.length){
          res.send(array);
      }


      },(userError)=>{
        return res.send(userError);
      });
    },(seekerError)=>{
      return res.send(seekerError);
    });


    //res.send(jobRequest);
  },(error)=>{
    res.send(error);
  });
}

exports.GET_MY_JOBS = function(req,res)
{
  temp=0;
  array=[];
  const companyID = req.params.companyID;
  jobsModel.find({$and:[{"companyID":companyID},{"status":"1"}]}).then((jobs)=>{
    companyModel.findOne({"_id":companyID}).then((companyResult)=>{
      userModel.findOne({"_id":companyResult.userID}).then((userResult)=>{
        for(var i=0;i<jobs.length;i++)
        {
          temp++;
          var obj={

            "companyName":userResult.name,
            "jobs":jobs[i],
            "companyLogo":userResult.userImage
          };
          array.push(obj);
        }
        if(temp==jobs.length){
            res.send(array);
        }

      },(userError)=>{
        return res.send(userError);
      });
    },(companyError)=>{
      return res.send(companyError);
    });

    //res.send(jobs);
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
            "jobs":arrayForAllJobs[i],
            "companyLogo":arrayForAllUsers[i].userImage
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
            "jobsRequest":arrayForJobsRequests[i],
            "seekerLogo":arrayForAllUsers[i].userImage
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
    const imageType = req.body.imageType;
    const base64str = req.body.image;
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
            userResult.save().then((updatedUserObj)=>{
              var obj={
                "result":updatedUserObj
              };
              res.send(obj);
            },(err)=>{
              res.send(err);
            });

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
//Add experinece
exports.ADD_EXPEREINCE =function(req,res){
  const tenureStart = req.body.tenureStart;
  const tenureEnd = req.body.tenureEnd;
  const designation = req.body.designation;
  const companyName = req.body.companyName;
  const seekerID = req.body.seekerID;

  var obj = {
    "tenureStart":tenureStart,
    "tenureEnd"  :tenureEnd,
    "designation":designation,
    "companyName":companyName
  }

  const newExpereinceModel = new expereinceModel(obj);
  seekerModel.findById(seekerID).then((seekerResult)=>{
    seekerResult.expereince.push(obj);
    seekerResult.save().then((result2)=>{
      res.send(result2.expereince);
    },(err2)=>{
      return res.send(err2);
    });
  },(seekerError)=>{
    return res.send(seekerError);
  });

}
//ADD education
exports.ADD_EDUCATION =function(req,res){
  const tenureStart = req.body.tenureStart;
  const tenureEnd = req.body.tenureEnd;
  const institueName = req.body.name;
  const degreeName = req.body.degreeName;
  const seekerID = req.body.seekerID;
  //console.log();
  var obj = {
    "tenureStart":tenureStart,
    "tenureEnd"  :tenureEnd,
    "institueName":institueName,
    "degreeName":degreeName
  }
  console.log(tenureStart);

  const newEducationModel = new educationModel(obj);
  seekerModel.findById(seekerID).then((seekerResult)=>{
    seekerResult.education.push(obj);
    seekerResult.save().then((result2)=>{
      res.send(result2.education);
    },(err2)=>{
      return res.send(err2);
    });
  },(seekerError)=>{
    return res.send(seekerError);
  });

}
exports.ADD_SKILLS = function(req,res){
  const seekerID = req.body.seekerID;
  const skills = req.body.skills;
  seekerModel.findById(seekerID).then((seekerResult)=>{
    arrayForSeekerSkills = seekerResult.skills;
    var temp =0;
    for(var i=0;i<skills.length;i++)
    {
      temp++;
      if(seekerResult.skills.indexOf(skills[i]) <= -1){
        seekerResult.skills.push(skills[i]);
      }

    }
    if(temp == skills.length)
    {
        seekerResult.save().then((result2)=>{
          return res.send(result2.skills);
        }),(err2)=>{
          return res.send(err2);
        };

    }

  },(seekerError)=>{
    return res.send(seekerError);
  });

}
exports.GET_ANSWERS_BY_POST_ID = function(req,res)
{
  data = [];
  const postID = req.params.postID;
  var k=0;
  answerModel.find({"postID":postID}).then((answerResult)=>{
    getUser(answerResult,(results)=>{
      for(var i=0;i<results.length;i++)
      {

        k++;
        var obj = {
          "_id": answerResult[i]._id,
           "postID":answerResult[i].postID,
           "userID": answerResult[i].userID,
           "content":answerResult[i].content,
           "dateTimeCreated": answerResult[i].dateTimeCreated,
           "status":answerResult[i].status,
          "user":results[i]
        };
        data.push(obj);
        //console.log(obj);

      }
      if(k== answerResult.length)
      {
        res.send(data);
      }
    });
  },(answerError)=>{
    res.send(answerError);
  });
}
function getUser(arrayForAnswer,cb)
{
  async.map(arrayForAnswer,getUserObj,function(err,results){
     cb(results);
  });
}
function getUserObj(item,donecallback){
  userModel.findById(item.userID).then((userResult)=>{
    donecallback(null,userResult);
  },(userError)=>{

  });
}
exports.SEARCH_USER= function(req,res)
{
  text = req.params.text;
//  var query = { text: /^*/ };
  userModel.find({"name": new RegExp(text, 'i')}).then((searchResult)=>{
    res.send(searchResult);

  },(searchError)=>{
    res.send(searchError);
  });

}
companyArray = [];
AllJobsArray = [];
exports.GET_ALL_JOBS2 = function(req,res){
  companyArray.length = 0;
  AllJobsArray.length = 0;

  jobsModel.find({"status":"1"}).then((jobsResult)=>{
    console.log(jobsResult);
    forEachAsync(jobsResult,function(next,element,index,array){
      getCompany(element,next);
    }).then(()=>{
      //final callback fire for this jobsResult loop
      console.log(companyArray);
    // res.send(companyArray);
      forEachAsync(companyArray,function(next,element,index,array){
        //console.log(element);
        getUsersObjects(element,next);

      }).then(()=>{
        //final Callback for companyArray
      console.log(AllJobsArray);
        res.send(AllJobsArray);
      });
    });
  },(jobsError)=>{
    res.send(jobsError);
  });

}
function getCompany(job,cb){
  companyModel.findOne({"_id":job.companyID}).then((companyResult)=>{
    var obj = {
      "userID":companyResult.userID,
      "jobs":job
    }
    companyArray.push(obj);
    cb();
  },(companyError)=>{
    return res.send(companyError);
  });
}
function getUsersObjects(companyObj,cb){
  //console.log("inside get user");
  userModel.findOne({"_id":companyObj.userID}).then((userObj)=>{
   console.log(userObj);
    var obj = {
      "companyName":userObj.name,
      "companyStatus":userObj.status,
      "jobs":companyObj.jobs,
      "companyLogo":userObj.userImage
    };
    AllJobsArray.push(obj);
    cb();
  },(userError)=>{
    return res.send(userError);
  });
}
//GET_USER_FEED
arrayforPosts = [];
posts = [];
exports.GET_USER_FEED2 = function(req,res){
  arrayforPosts.length = 0;
  posts.length = 0;
  count=0;
  const userID = req.params.userID;
  userModel.findById(userID).then((userResult)=>{
    postModel.find({"userID":userID,"status":"1"}).then((postResult)=>{
      posts = postResult;
      forEachAsync(userResult.following,function(next,element,index,array){
        getFollowPost(element,next);
      }).then(()=>{
        //final cb for post
        forEachAsync(posts,function(next,element,index,array){
          getUsersObject(element,next);
        }).then(()=>{
          res.send(arrayforPosts);
        });
      });
    },(postError)=>{
      res.send(postError);
    });
  },(userError)=>{
    res.send(userError);
  });
}
function getFollowPost(element,cb){
  postModel.find({"userID":element,"status":"1"}).then((postResult)=>{
    //console.log(element);
      for(var i=0;i<postResult.length;i++)
      {
        count++;
        posts.push(postResult[i]);
      }
      if(count == postResult.length){
        count = 0;
        cb();
      }
  },(postError)=>{
    res.send(postError)
  });
}
function getUsersObject(element,cb){
  userModel.findById(element.userID).then((userResult)=>{
    var obj = {
      "userType":userResult.userType,
      "name":userResult.name,
      "userImage":userResult.userImage,
      "likes":element.likes,
      "likesCount":element.likes.length,
      "_id":element._id,
      "userID":element.userID,
      "content":element.content,
      "dateTimeCreated":element.dateTimeCreated,
      "postType":element.postType,
      "isReported":element.isReported,
      "status":element.status,
      "userObject":userResult
    }
    arrayforPosts.push(obj);
    cb();
  },(userError)=>{
    res.send(userError);
  });
}
exports.GET_JOB_REQUEST_BY_JOB_REQUEST_ID = function(req,res){
  const jobRequestID = req.params.jobRequestID;
  jobsRequestModel.findById(jobRequestID).then((jobRequestResult)=>{
    seekerModel.findById(jobRequestResult.seekerID).then((seekerResult)=>{
      userModel.findById(seekerResult.userID).then((userResult)=>{
        var obj = {
          "jobRequest":jobRequestResult,
          "seeker":seekerResult,
          "user":userResult
        }
        res.send(obj);
      },(userError)=>{
        res.send(userError);
      });
    },(seekerError)=>{
      res.send(seekerError);
    });
  },(jobRequestError)=>{
    res.send(jobRequestError);
  });
}
arrayForSend = [];
arrayForSend2 = [];
exports.GET_RESPONSES_BY_JOB_ID = function(req,res){

  arrayForSend.length = 0;
  arrayForSend2.length = 0;
  const jobID = req.params.jobID;
  jobsModel.findById(jobID).then((jobRequestResult)=>{
    var arra = jobRequestResult.responsesSeekerID;
    forEachAsync(arra,function(next,element,index,array){
      getUser(element,next);
    }).then(()=>{
      forEachAsync(arrayForSend,function(next,element,index,array){
        getJobRequests(element,next);
      }).then(()=>{res.send(arrayForSend2);});
    });
  },(jobError)=>{
    res.send(jobError);
  });
}
function getUser(element,cb){
  userModel.findById(element.userID).then((userResult)=>{
    var obj = {
      "jobsRequestID":element.jobRequestID,
      "seekerName":userResult.name,
      "seekerLogo":userResult.userImage
    };
    arrayForSend.push(obj);
    cb();
  },(seekerError)=>{
    res.send(seekerError);
  });
}
function getJobRequests(element,cb){
  jobsRequestModel.findById(element.jobsRequestID).then((jrResult)=>{
    var obj = {
      "seekerName":element.seekerName,
      "seekerLogo":element.seekerLogo,
      "jobsRequest":jrResult
    }
    arrayForSend2.push(obj);
    cb();
  },(jobRequestError)=>{
      res.send(jobRequestError);
  });

}
arrayForJobSend=[];
exports.SEARCH_JOBS = function(req,res){
  arrayForJobSend.length = 0;
  const text = req.params.text;
  jobsModel.find({$and:[{"jobTitle": new RegExp(text, 'i')},{"status":"1"}]}).then((jobsResult)=>{
    forEachAsync(jobsResult,function(next,element,index,array){
        getJobUser(element,next);
    }).then(()=>{
      res.send(arrayForJobSend);
    },(error)=>{
      res.send(error)
    });
    //res.send(jobsResult);
  },(jobsError)=>{
    return res.send(jobsError);
  });
}
function getJobUser(element,cb){
  //console.log(element);
  companyModel.findOne({"_id":element.companyID}).then((companyResult)=>{
    userModel.findOne({"_id":companyResult.userID}).then((userResult)=>{
      console.log(userResult);
      var obj = {
        "jobs":element,
        "companyName":userResult.name,
        "companyLogo":userResult.userImage,
        "comapanyStatus":userResult.status
      };
      arrayForJobSend.push(obj);
      cb();

    },(userError)=>{
      res.send(userError);
    });


  },(seekerError)=>{
    res.send(seekerError);
  });
}
arrayForJobsRequestSend = [];
exports.SEARCH_JOB_REQUEST = function(req,res){
  arrayForJobsRequestSend.length = 0;
  const text = req.params.text;
  jobsRequestModel.find({$and:[{"title": new RegExp(text, 'i')},{"status":"1"}]}).then((jobRequestResult)=>{
    forEachAsync(jobRequestResult,function(next,element,index,array){
      getJobRequestUser(element,next);
    }).then(()=>{
      res.send(arrayForJobsRequestSend);
    },(error)=>{
      res.send(error);
    });

    //res.send(jobRequestResult);
  },(jobReqError)=>{
    return res.send(jobReqError);
  });
}
function getJobRequestUser(element,cb){
  seekerModel.findOne({"_id":element.seekerID}).then((seekerResult)=>{
    userModel.findOne({"_id":seekerResult.userID}).then((userResult)=>{
      //console.log(userResult);
      var obj = {
        "jobsRequest":element,
        "seekerName":userResult.name,
        "seekerLogo":userResult.userImage
      };
      arrayForJobsRequestSend.push(obj);
      cb();

    },(userError)=>{
      res.send(userError);
    });


  },(seekerError)=>{
    res.send(seekerError);
  });
}
exports.REMOVE_JOB = function(req,res) {
  const jobID = req.params.jobID;
  jobsModel.findById(jobID).then((jobsResult)=>{
    console.log(jobsResult);
    jobsResult.status = "0";
    jobsResult.save().then(()=>{
      res.send(jobsResult);
    },()=>{res.json({"error":"error occured"});});
  },(jobsError)=>{
    res.send(jobsError);
  });
}
exports.REMOVE_JOB_REQUEST = function(req,res){
  const jobRequestID = req.params.jobRequestID;
  jobsRequestModel.findById(jobRequestID).then((jobRequestResult)=>{
    jobRequestResult.status = "0";
    jobRequestResult.save().then(()=>{
      res.send(jobRequestResult);
    },()=>{
      res.json({"error":"error occured"});
    });
  },(jobRequestError)=>{
    res.send(jobRequestError);
  });
}
exports.REMOVE_EXPERIENCE = function(req,res){
  const seekerID = req.params.seekerID;
  const expereinceID = req.params.expereinceID;
  newExpereince = [];
  seekerModel.findById(seekerID).then((seekerResult)=>{
    if(seekerResult.status == "1"){
      expereineceArray = seekerResult.expereince;
      for(var i = 0 ;i<expereineceArray.length;i++)
      {
        if(expereineceArray[i]._id != expereinceID){
          newExpereince.push(expereineceArray[i]);
        }
      }
      seekerResult.expereince = newExpereince;
      seekerResult.save().then(()=>{
        res.send(seekerResult)
      },()=>{
        res.json({"error":"error occured"});
      });

    }
    else{
      res.json({"error":"user status is inactive"});
    }
  },(seekerError)=>{
    res.send(seekerError);
  });
}
//remove education
exports.REMOVE_EDUCATION = function(req,res){
  const seekerID = req.params.seekerID;
  const educationID = req.params.educationID;
  newEducation = [];
  seekerModel.findById(seekerID).then((seekerResult)=>{
    if(seekerResult.status == "1"){
      educationArray = seekerResult.education;
      for(var i = 0 ;i<educationArray.length;i++)
      {
        if(educationArray[i]._id != educationID){
          newEducation.push(educationArray[i]);
        }
      }
      seekerResult.education = newEducation;
      seekerResult.save().then(()=>{
        res.send(seekerResult)
      },()=>{
        res.json({"error":"error occured"});
      });

    }
    else{
      res.json({"error":"user status is inactive"});
    }
  },(seekerError)=>{
    res.send(seekerError);
  });
}
arrayOfAnswer=[];
exports.GET_ANSWERS_BY_POST_ID2 = function(req,res){
  arrayOfAnswer =[];
  const postID = req.params.postID;
  answerModel.find({"postID":postID}).then((postResult)=>{
    forEachAsync(postResult,function(next,element,index,array){
      getAnswerUserobj(element,next);
    }).then(()=>{
      res.send(arrayOfAnswer);
    });
  },(postError)=>{
    res.send(postError);
  });
}
function getAnswerUserobj(element,cb){
  userModel.findOne(element.userID).then((userResult)=>{
    var obj = {
      "_id": element._id,
       "postID":element.postID,
       "userID": element.userID,
       "content":element.content,
       "dateTimeCreated": element.dateTimeCreated,
       "status":element.status,
      "user":userResult
    }
    arrayOfAnswer.push(obj);
    cb();
  },(userError)=>{
    res.send(userError);
  });
}
exports.UPDATE_EXPEREINCE = function(req,res){
  tempArrayForExp = [];
  arrayData=[];
  const seekerID = req.body.seekerID;
  const expereinceID = req.body._id;
  seekerModel.findById(seekerID).then((seekerResult)=>{
    tempArrayForExp = seekerResult.expereince;
    for (var i =0 ;i<tempArrayForExp.length;i++)
    {
      if(tempArrayForExp[i]._id == expereinceID){
        var obj ={
          "tenureStart" : req.body.tenureStart,
          "tenureEnd" : req.body.tenureEnd,
          "designation" : req.body.designation,
          "companyName" : req.body.companyName,
          "_id" : tempArrayForExp[i]._id
        };
          arrayData.push(obj);
      }else {
        arrayData.push(tempArrayForExp[i]);
      }
    }
    seekerResult.expereince = arrayData;
    seekerResult.save().then(()=>{
      res.send(seekerResult);
    },()=>{
      res.json({"result":"error occcured"});
    });

  },(seekerError)=>{
    res.send(seekerError);
  });
}
exports.UPDATE_EDUCATION = function(req,res){
  tempArrayForEdu = [];
  arrayDataEdu=[];
  const seekerID = req.body.seekerID;
  const educationID = req.body.educationID;
  console.log(educationID);
  seekerModel.findById(seekerID).then((seekerResult)=>{
    tempArrayForEdu = seekerResult.education;
    for (var i =0 ;i<tempArrayForEdu.length;i++)
    {
      if(tempArrayForEdu[i]._id == educationID){
        var obj ={
          "tenureStart" : req.body.tenureStart,
          "tenureEnd" : req.body.tenureEnd,
          "institueName" : req.body.institueName,
          "degreeName" : req.body.degreeName
        };
        console.log(obj);
          arrayDataEdu.push(obj);
      }else {
        arrayDataEdu.push(tempArrayForEdu[i]);
      }
    }
    seekerResult.education = arrayDataEdu;
    //console.log(seekerResult.education);
    seekerResult.save().then(()=>{
      res.send(seekerResult);
    },()=>{
      res.json({"result":"error occcured"});
    });

  },(seekerError)=>{
    res.send(seekerError);
  });
}

arrayForJobsRequest1 =[];
arrayForJobsRequest2 =[];
exports.GET_ALL_JOBS_REQUESTS2 =function(req,res){
  arrayForJobsRequest1.length = 0;
  arrayForJobsRequest2.length = 0;
  jobsRequestModel.find({"status":"1"}).then((jrResult)=>{
    forEachAsync(jrResult,function(next,element,index,array){
      getSeekerFromJobRequest(element,next);
    }).then(()=>{
      //call back for jrResult
      forEachAsync(arrayForJobsRequest1,function(next,element,index,array){
        getUserFromJobRequest(element,next);
      }).then(()=>{
        //callback for jr1
        res.send(arrayForJobsRequest2);
      });


    });
  },(jrError)=>{
    res.send(jrError);
  });
}
function getSeekerFromJobRequest(element,cb){
  seekerModel.findById(element.seekerID).then((seekerResult)=>{
    console.log(seekerResult);
    var obj ={
      "userID":seekerResult.userID,
      "jobsRequest":element
    };
    arrayForJobsRequest1.push(obj);
    cb();
  },(seekerError)=>{
    res.send(seekerError);
  });
}
function getUserFromJobRequest(element,cb){
  userModel.findById(element.userID).then((userResult)=>{
    var obj = {
      "seekerName":userResult.name,
      "seekerLogo":userResult.userImage,
      "jobsRequest":element.jobsRequest
    };
    arrayForJobsRequest2.push(obj);
    cb();
  },(userError)=>{
    res.send(userError);
  });
}
//getCompanyResponsesByjobRequestID
arrayForComID = [];
arrayForComID1 = [];
exports.GET_COMPANY_RESPONSES_BY_JOB_REQUEST_ID =function(req,res) {
  arrayForComID.length = 0;
  arrayForComID1.length = 0;
  const jrID = req.params.jobReqID;
  console.log(jrID);
  jobsRequestModel.findById(jrID).then((jrResult)=>{
    forEachAsync(jrResult.responsesCompanyID,function(next,element,index,array){
      getCompanyForResponse(element,next);
    }).then(()=>{
      //call back for jr
      forEachAsync(arrayForComID,function(next,element,index,array){
        getUserByComId(element,next);
      }).then(()=>{
        //call back for comid
        res.send(arrayForComID1);
      });
    });

  },(jrError)=>{
    res.send(jrError);
  });
}
function getCompanyForResponse(element,cb){
  console.log(element);
  companyModel.findById(element).then((companyResult)=>{
    arrayForComID.push(companyResult);
    cb();
  },(companyError)=>{
    res.send(companyError);
  });
}
function getUserByComId(element,cb){
  console.log(element);
  userModel.findById(element.userID).then((userResult)=>{
    //console.log(userResult);
    var obj ={
      "userID": userResult._id,
      "Name": userResult.name,
      "Logo": userResult.userImage
    };
    arrayForComID1.push(obj);
    cb();

  },(userError)=>{
    res.send(userError);
  });
}

//fire based notifications
const serverKey = 'AIzaSyA2CTXtO5PdWwKpMkpjfqSYpN71NwXBavE';
var fcm = new FCM(serverKey);
var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: 'registration_token',
    collapse_key: 'your_collapse_key',

    notification: {
        title: 'Title of your push notification',
        body: 'Body of your push notification'
    },

    data: {  //you can send only notification or only data(or include both)
        my_key: 'my value',
        my_another_key: 'my another value'
    }
};
fcm.send(message, function(err, response){
     if (err) {
         console.log("Something has gone wrong!");
     } else {
         console.log("Successfully sent with response: ", response);
     }
 });
