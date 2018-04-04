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
  const institueName = req.body.institueName;
  const degreeName = req.body.degreeName;
  const seekerID = req.body.seekerID;

  var obj = {
    "tenureStart":tenureStart,
    "tenureEnd"  :tenureEnd,
    "institueName":institueName,
    "degreeName":degreeName
  }

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
  userModel.find({"name":new RegExp('^' + req.params.text + '$', "i")}).then((searchResult)=>{
    res.send(searchResult);
  },(searchError)=>{
    res.send(searchError);
  });

}
companyArray = [];
AllJobsArray = [];
exports.GET_ALL_JOBS2 = function(req,res){
  jobsModel.find().then((jobsResult)=>{
    forEachAsync(jobsResult,function(next,element,index,array){
      getCompany(element,next);
    }).then(()=>{
      //final callback fire for this jobsResult loop
      //console.log(companyArray.length);
      forEachAsync(companyArray,function(next,element,index,array){
        getUser(element,next);

      }).then(()=>{
        //final Callback for companyArray
        //console.log(AllJobsArray);
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
function getUser(companyObj,cb){
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
arrayforFollowingPost = [];
exports.GET_USER_FEED2 = function(req,res){
  userObj = 0;
  userFollowing=[];
  userModel.findById(req.params.userID).then((userResult)=>{
    userObj = userResult;
    userFollowing = userResult.following;
    postModel.find({"userID":req.params.userID}).then((postResult)=>{
      forEachAsync(postResult,function(next,element,index,array){
        user(element,userObj,next);
      }).then(()=>{
        //final call back for postResult
        forEachAsync(userFollowing,function(next,element,index,array){
            getFollowingPosts(element,next);
        }).then(()=>{
          //final callback of userFollowing
          //userFollowing posts array of arrays has been returend
          //res.send(arrayforFollowingPost);
          forEachAsync(arrayforFollowingPost,function(next,element,index,array){
            getFollowingPostsUser(element,next);
          }).then(()=>{

            //final call back for arrayforFollowingPost
            res.send(arrayforPosts);
          });
        });
      });
    },(postError)=>{
      return res.send(postError);
    });

  },(userError)=>{
    return res.send(userError);
  });
}
function user(post,userObj,cb){
  var obj = {
    "userType":userObj.userType,
    "name":userObj.name,
    "userImage":userObj.userImage,
    "likes":post.likes,
    "likesCount":post.likes.length,
    "_id":post._id,
    "userID":post.userID,
    "content":post.content,
    "dateTimeCreated":post.dateTimeCreated,
    "postType":post.postType,
    "isReported":post.isReported,
    "status":post.status,
    "userObject":userObj
  }
  arrayforPosts.push(obj);
  cb();

}
function getFollowingPosts(followingObj,cb){
  postModel.find({"userID":followingObj}).then((postResult)=>{
    if(postResult.length >0){
      arrayforFollowingPost.push(postResult);
    }
    cb();
  },(postError)=>{
    return res.send(postError);
  });
}
function getFollowingPostsUser(postArray,cb){
  forEachAsync(postArray,function(next,element,index,array){
    getUser(element,next);

  }).then(()=>{
      cb();
  });
}
function getUser(post,cb){
  userModel.findById(post.userID).then((userObj)=>{
    var obj = {
      "userType":userObj.userType,
      "name":userObj.name,
      "userImage":userObj.userImage,
      "likes":post.likes,
      "likesCount":post.likes.length,
      "_id":post._id,
      "userID":post.userID,
      "content":post.content,
      "dateTimeCreated":post.dateTimeCreated,
      "postType":post.postType,
      "isReported":post.isReported,
      "status":post.status,
      "userObject":userObj
    }
    arrayforPosts.push(obj);
    cb();

  },(userError)=>{
    res.send(userError);
  });
}
