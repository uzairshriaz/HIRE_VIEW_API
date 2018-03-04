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


exports.CREATE_USER=function(req,res){
    str1 = "seeker";
    str2 = "company";

    const newUser = new userModel(req.body);
    const usertype = req.body.userType;
    newUser.save().then((result)=>{
    //  console.log(usertype);
      if(usertype.toUpperCase() === str1.toUpperCase()){
        //seeker
        newObj = {
          "userID":result._id,
          "age":"0",
          "status":"0",
          "postalAddress":"0",
          "skills":"[]",
          "education":"[]",
          "expereince":"[]"
        }
        const newSeeker = new seekerModel(newObj);
        newSeeker.save().then((result6)=>{
          res.json({"seekerID":result6._id,"userObject":result});
        },(e1)=>{
          return res.send(e1);
        });

      }
      else if (usertype.toUpperCase() === str2.toUpperCase()) {
        //company
        newObj = {
          "userID":result._id,
          "numberOfEmployees":"0",
          "dateFounded":"0",
          "postalAddress":"0",
          "status":"[]",
          "portfolio":"[]",
          "typeOfCompany":"[]",
          "contact":"0",
          "Address":"0"
        }
        const newCompany = new companyModel(newObj);
        newCompany.save().then((result3)=>{
          res.json({"userObject":result,"companyID":result3._id});
        },(e3)=>{
          return res.send(e3);
        });



    }
      else{
        //error
        res.json({"status":"error"});

      }
    },(e)=>{
      return res.send(e);
    });
};

exports.LOGIN = function(req,res){
  const usertype = req.body.userType;
  userModel.find({'email': req.params.email, 'password': req.params.password}).then((result)=>{
    console.log(result);
    if(!result[0])
    {
      return res.json({"Error":"User Not Found"});
    }

    if(result[0].userType === "Seeker" && result[0])
    {
      //console.log("sucewilfc");
      seekerModel.find({"userID": result[0]._id}).then((result1)=>{
        //console.log(result1);

        var obj = {
          "seekerID":result1[0]._id,
          "user":result[0],
          "age": result1[0].age,
          "status": result1[0].status,
          "postalAddress": result1[0].postalAddress,
          "skills": result1[0].skills,
          "skills": result1[0].skills,
          "expereince": result1[0].expereince,
        };
        return res.send(obj);

      }, (error)=>{
        return res.send(error);
        console.log(error);
      });
    }
    else if (result[0].userType === "Company" && result[0]){
      companyModel.find({"userID": result[0]._id}).then((result1)=>{
        var obj = {
          "companyID":result1[0]._id,
          "user":result[0],
          "numberOfEmployees": result1[0].numberOfEmployees,
          "dateFounded": result1[0].dateFounded,
          "status": result1[0].status,
          "portfolio": result1[0].portfolio,
          "typeOfCompany": result1[0].typeOfCompany,
          "contact": result1[0].contact,
          "Address": result1[0].Address
        };
        return res.send(obj);

      }, (error1)=>{
        res.send(error1)
        console.log(error1);
      });
    }
    else{
      return res.json({"Error":"User Not Found"});
    }
  }, (error2)=>{
    return res.send(error2);
    console.log(error2);
  });
};

exports.CREATE_SEEKER=function(req,res){
    const newSeeker = new seekerModel(req.body);
    newSeeker.save().then((result)=>{
      return res.send(result);
    },(e)=>{
      return res.send(e);
    });
};

exports.CREATE_COMPANY=function(req,res){
    const newCompany = new companyModel(req.body);
    newCompany.save().then((result)=>{
      return res.json({"result":result});
    },(e)=>{
      return res.send(e);
    });

};

exports.CREATE_POST=function(req,res){
    const newPost = new postModel(req.body);
    newPost.save().then((result)=>{
      return res.json({"result":result});
    },(e)=>{
        return res.send(e);
    });

};



exports.REMOVE_USER=(req,res)=>{
  const userID = req.params.userID;

  userModel.findById(userID).then((result)=>{
    if(result && result.status === "1")
    {
      result.status = "0";
      result.save();
      res.json({"status":"updated Successfully"});

    }else {
      res.json({"status":"Unsuccessfull"});
    }
  },(e)=>{
    return res.send(e);
  });

};

exports.REMOVE_POST=(req,res)=>{
  const postID = req.params.postID;

  postModel.findById(postID).then((result)=>{
    if(result && result.status === "1")
    {
      result.status = "0";
      result.save();
      res.json({"status":"Updated Successfully"});

    }else {
      res.json({"status":"Unsuccessfull"});
    }
  },(e)=>{
    return res.send(e);
  });

};

exports.UPDATE_USER=(req,res)=>{
  const userID = req.params.userID;
  var obj = req.body;
  userModel.findByIdAndUpdate(userID,{$set:obj},{new:true}).then((result)=>{
    res.json({status:"updated Successfully"});

  },(e)=>{
    res.send(e);
  });

};


exports.GET_USER_BY_ID=function(req,res){
  const id = req.params.userID;
  userModel.findById(id).then((result)=>{
    if(result && result.status === "1")
    {
      res.send(result);
    }else {
      res.status(404).send();
    }
  },(e)=>{
    res.send(e);
  });

};

exports.GET_POST_BY_ID = function(req,res){

  const id = req.params.postID;
    postModel.findById(id).then((result)=>{
      if(result.status === "1")
      {
        return  res.send(result);
      }
      else{
        return res.status(400).send();
      }

    },(e)=>{
      res.send(e);
    });
};


exports.UPDATE_POST = function(req,res){
  console.log('inside');
  const id = req.body._id;
  console.log(id);
  postModel.findByIdAndUpdate(id,{$set:req.body},{new:true}).then((result)=>{
    res.json({"status":"updatd Successfully"});
  },(e)=>{
    return res.send(e);
  });

};


exports.REMOVE_SEEKER = function(req,res){
  const seekerID=req.params.seekerID;

  seekerModel.findById(seekerID).then((result)=>{
    console.log(result);
    if(result && result.status ==="1")
    {
      console.log('inside');
      result.status = "0";
      result.save();
      res.json({"status":"updated Successfully"});
    }
  },(e)=>{
    console.log('else');
      return res.send(e);
  });
};


exports.GET_SEEKER_BY_ID = function(req,res){
  const id = req.params.seekerID;
  seekerModel.findById(id).then((result)=>{
    if(result && result.status === "1")
    {
      return res.send(result);

    }
    else{
      return res.status(404).send({"status":"no found"});
    }

  },(e)=>{
     return res.send(e);
  });
};


exports.GET_COMPANY_BY_ID = function(req,res){
  const id = req.params.companyID;
  companyModel.findById(id).then((result)=>{
    if(result && result.status ==="1")
    {
      res.send(result);
    }
    else{
      return res.status(404).send({"status":"not found"});
    }
  },(e)=>{
      return res.send(e);
  });
};

exports.REMOVE_COMPANY_BY_ID = function(req,res){
  const id = req.params.companyID;
  companyModel.findById(id).then((result)=>{
    if(result && result.status === "1")
    {
      result.status = "0";
      result.save();
      res.send({"status":"removed succesffully"});
    }
  },(e)=>{
      return res.send(e);
  });
};

exports.UPDATE_COMPANY = function(req,res){
  const id = req.body._id;
  companyModel.findByIdAndUpdate(id,{$set:req.body},{new:true}).then((result)=>{
      return res.json({"status":"updated succesffully"});

  },(e)=>{
      return res.send(e);
  });
};

exports.FOLLOW_USER = function(req,res){
  const followerID = req.body.followerID; // 1 na 2 ko follow krna
  const followingID = req.body.followingID;
  var flag = false;
  var text = '{ "object":"'+followingID+'"}';
  userModel.findById(followerID).then((result1)=>{
    if(result1 && result1.status === "1")
    {
      userModel.findById(followingID).then((result2)=>{
        if(result2 && result2.status === "1")
        {
            var arrayOfFollowedUsers = result1.following;
            var obj = JSON.parse(text);
            for (var i = 0 ;i<arrayOfFollowedUsers.length;i++)
            {
              if(JSON.stringify(arrayOfFollowedUsers[i]) == '"'+obj.object+'"'){
                flag = true;
                break;
              }
            }
            if(flag)
            {
              return res.status(404).json({"status":"already added"}).send();
            }
            arrayOfFollowedUsers.push(followingID);
            result1.following = arrayOfFollowedUsers;
            result1.save();

            var arrayoffollowers = result2.followers;
            arrayoffollowers.push(followerID);
            result2.followers = arrayoffollowers;
            result2.save();
            res.send({"status":"followed successfully"});
          }
        else{
          return res.status(404).send();
        }
      },(e2)=>{
          return res.send(e2);
      });
    }
    else {
      return res.status(404).send();
    }
  },(e1)=>{
      return res.send(e1);
  });
};


exports.UNFOLLOW_USER = function(req,res){
  console.log('unfollow');
  const followerID = req.body.followerID;
  const followingID = req.body.followingID;
  var flag = false;
  var text = '{ "object":"'+followingID+'"}';
  var text2 = '{ "objectfr":"'+followerID+'"}';
  var index;

  userModel.findById(followerID).then((result1)=>{
    if(result1 && result1.status === "1")
    {
      userModel.findById(followingID).then((result2)=>{
        if(result2 )
        {
          var arrayOfFollowedUsers = result1.following;
          var obj = JSON.parse(text);
          for (var i = 0 ;i<arrayOfFollowedUsers.length;i++)
          {
            if(JSON.stringify(arrayOfFollowedUsers[i]) == '"'+obj.object+'"'){
              flag = true;
              index = i;
              break;
            }
          }
          if(flag)
          {
            arrayOfFollowedUsers.splice(index,1);
            result1.following = arrayOfFollowedUsers;
            result1.save();

            var obj = JSON.parse(text2);
            var ob = '"'+obj.objectfr+'"'
            var arrayoffollowers = result2.followers;
            var ind;

            for (var i = 0 ;i<arrayOfFollowedUsers.length;i++)
            {
              if(JSON.stringify(arrayoffollowers[i]) == '"'+obj.objectfr+'"'){
                ind = i;
                break;
              }
            }
            arrayoffollowers.splice(ind,1);
            result2.followers = arrayoffollowers;
            result2.save();
            res.send({"status":"UN-followed successfully"});
          }
          else {
            return res.status(404).json({"status":"already unfollowed"}).send();
          }
        }
        else {
          return res.status(404).send();
        }

      },(e2)=>{
          return res.status(404).send();
      });

    }
    else {
          return res.status(404).send();
    }

  },(e)=>{
          return res.status(404).send();
  });

};


exports.LIKE_POST = function(req,res){
  console.log('like');
  const postID = req.body.postID;
  const likerID = req.body.likerID;
  var text = '{ "object":"'+likerID+'"}';
  var flag = false;
  var index;

  postModel.findById(postID).then((result1)=>{
    if(result1.status === "1" && result1)
    {
      userModel.findById(likerID).then((result2)=>{
        if(result2 && result2.status === "1")
        {
          var userID = result2._id;
          arrayOfLikes = result1.likes;
          var obj = JSON.parse(text);

          for (var i = 0 ;i<arrayOfLikes.length;i++)
          {
            if(JSON.stringify(arrayOfLikes[i]) == '"'+obj.object+'"'){

              flag = true;
              index = i;
              break;
            }
          }
          if(flag)
          {
            return res.status(404).json({"status":"already liked"});
          }else {
              arrayOfLikes.push(userID);
              result1.likes = arrayOfLikes;
              result1.save();
              res.json({"status":"liked :) "});
          }
        }else {
          return res.status(404).json({"status":"user deactivated"});
        }

      },(e2)=>{
          return res.status(404).json({"status":"user not found"});
      });

    }else {
      return res.status(404).json({"status":"post deactivated"});
    }
  },(e1)=>{
     return res.status(404).json({"status":"post not found"});
  });
};



exports.UNLIKE_POST = function(req,res){
  console.log('unlike');
  const postID = req.body.postID;
  const likerID = req.body.likerID;
  var text = '{"object":"'+likerID+'"}'
  var obj = JSON.parse(text);
  var index = -1;
  postModel.findById(postID).then((result1)=>{
    if(result1 && result1.status === "1")
    {
      var arrayOfLikes = result1.likes;
      console.log(JSON.stringify(arrayOfLikes[0]));
      console.log('"'+obj.object+'"');
      for(var i = 0 ;i <arrayOfLikes.length;i++ ){
        if(JSON.stringify(arrayOfLikes[i]) == '"'+obj.object+'"')
        {
          index = i;
          break;
        }

      }
      if(index > -1){
        arrayOfLikes.splice(index,1);
        result1.likes = arrayOfLikes;
        result1.save();
        res.json({"status":"unliked succesffully"});
      }else {
        return res.status(404).json({"status":"already unliked or like not found"});
      }
    }else {
      return res.status(404).json({"status":"post deactivated or post not found"});
    }
  },(e1)=>{
      return res.status(404).json({"status":"post not found"});
  });
};


exports.CREATE_ANSWER=function(req,res){
  console.log('create answer');
  const postID = req.body.postID;
  const userID = req.body.userID;
  const content = req.body.content;
  postModel.findById(postID).then((result1)=>{
    if(result1 && result1.status == "1")
    {
      userModel.findById(userID).then((result2)=>{
        if (result2 && result2.status == "1") {
          var obj = {
            "postID":postID,
            "userID":userID,
            "content":content,
            "dateTimeCreated":Date.now(),
            "status":1
          };
          const Answer = new answerModel(obj);
          Answer.save().then((result)=>{
            return res.json({"result":result});
          },(e)=>{
              return res.status(404).send();
          });

        }else {
            return res.status(404).json({"status":"user not found or deactivated"});
        }
      },(e2)=>{
            return res.status(404).json({"status":"user not found"});
      });


    }else {
      return res.status(404).json({"status":"post not found or deactivated"});
    }

  },(e1)=>{
      return res.status(404).json({"status":"post not found"});
  });
}

exports.REMOVE_ANSWER = function(req,res){
  console.log('remove answer');
  const postID = req.body.postID;
  const userID = req.body.userID;
  const answerID = req.body.answerID;
  var text = '{"userID":"'+userID+'","postID":"'+postID+'","answerID":"'+answerID+'"}'
  var obj = JSON.parse(text);
  postModel.findById(postID).then((result1)=>{
    if(result1 && result1.status == "1")
    {
      userModel.findById(userID).then((result2)=>{
        if(result2 && result2.status == "1")
        {

          answerModel.findById(answerID).then((result3)=>{
            if(result3 && result3.status == "1"){
                if(JSON.stringify(result3.userID) == '"'+obj.userID+'"' && JSON.stringify(result3.postID) =='"'+obj.postID+'"'){
                result3.status = "0";
                result3.save();
                res.json({"status":"removed succesffully"});
                }else {
                  res.json({"status":"not found"});
              }
            }
            else{
              res.status(404).json({"status":"answer already removed"});
            }

          },(e3)=>{
              res.status(404).json({"status":"answer not found "});
          });

        }
        else{
          res.status(404).json({"status":"already removed"});
        }
      },(e2)=>{
        return res.status(404).json({"status":"user not found"});
      });

    }else{
      return res.status(404).json({"status":"post not found or removed"});
    }
  },(e1)=>{
    return res.status(404).json({"status":"post not found"});
  });
};

exports.UPDATE_ANSWER = function(req,res){
  console.log('update answer');
  const postID = req.body.postID;
  const userID = req.body.userID;
  const answerID = req.body.answerID;
  var text = '{"userID":"'+userID+'","postID":"'+postID+'","answerID":"'+answerID+'"}'
  var obj = JSON.parse(text);
  postModel.findById(postID).then((result1)=>{
    if(result1 && result1.status == "1")
    {
      userModel.findById(userID).then((result2)=>{
        if(result2 && result2.status == "1")
        {

          answerModel.findById(answerID).then((result3)=>{
            if(result3){
                if(JSON.stringify(result3.userID) == '"'+obj.userID+'"' && JSON.stringify(result3.postID) =='"'+obj.postID+'"'){
                    result3.status = req.body.status;
                    result3.content = req.body.content;
                    result3.date = Date.now();
                    result3.save();
                    res.json({"status":"updated succesffully"});
                }else {
                  res.json({"status":"not found"});
              }
            }
            else{
              res.status(404).json({"status":"answer not found"});
            }

          },(e3)=>{
              res.status(404).json({"status":"answer not found "});
          });

        }
        else{
          res.status(404).json({"status":"user not found"});
        }
      },(e2)=>{
        return res.status(404).json({"status":"user not found"});
      });

    }else{
      return res.status(404).json({"status":"post not found or removed"});
    }
  },(e1)=>{
    return res.status(404).json({"status":"post not found"});
  });

};
exports.CREATE_JOB_REQUEST = function(req,res){
  console.log(' create job request');
  const jobRequest = new jobsRequestModel(req.body);
  jobRequest.save().then((result)=>{
    res.json({"result":result});
  },(e)=>{
    res.status(404).json({"status":"error in creation"});
  });
};
exports.CREATE_JOB = function(req,res){
  console.log('create job ');
  const job = new jobsModel(req.body);
  job.save().then((result)=>{
    res.json({"result":result});
  },(e)=>{
    res.status(404).json({"status":"error in creation"});
  });
};
exports.ADD_SEEKER_JOB_RESPONSE=function(req,res){
  console.log('inside');
  const jobID = req.body.jobID;
  const userID = req.body.seekerID;
  var text = '{"userID":"'+userID+'"}'
  var obj = JSON.parse(text);
  var flag = false;
  jobsModel.findById(jobID).then((result)=>{
    if(result && result.status==="1")
    {
      seekerModel.findById(userID).then((result2)=>{
        if(result2 && result2.status === "1")
        {
          for(var i=0;i<result.responsesSeekerID.length;i++)
          {
            if(JSON.stringify(result.responsesSeekerID[i]) == '"'+obj.userID+'"'){
              flag = true;
            }
          }
          if(flag){
            return res.status(404).json({"status":"response already added"});
          }
          var arrayOfSeekerResponses = result.responsesSeekerID;
          arrayOfSeekerResponses.push(userID);
          result.responsesSeekerID = arrayOfSeekerResponses;
          result.save();
          res.json({"status":"succesffully added"});

        }else {
          return res.status(404).send();
        }
      },(e2)=>{
         return res.send(e2);
      });

    }else {
      return res.status(404).send();
    }
  },(e)=>{
    return res.send(e);
  });
};

exports.ADD_COMPANY_JOB_REQUEST_RESPONSE = function(req,res){
  console.log('inside');
  const jobReqID = req.body.jobReqID;
  const companyID = req.body.companyID;
  var text ='{"companyID":"'+companyID+'"}'
  var obj = JSON.parse(text);
  var flag = false;
  jobsRequestModel.findById(jobReqID).then((result)=>{
    if(result && result.status==="1")
    {
      companyModel.findById(companyID).then((result2)=>{
        if(result2 && result2.status === "1")
        {
          for(var i=0;i<result.responsesCompanyID.length;i++)
          {
            if(JSON.stringify(result.responsesCompanyID[i]) == '"'+obj.companyID+'"')
            {
              flag = true;
            }
          }
          if(flag){
            return res.status(404).json({"status":"response already added"});
          }
          var arrayOfCompanyResponses = result.responsesCompanyID;
          arrayOfCompanyResponses.push(companyID);
          result.responsesCompanyID = arrayOfCompanyResponses;
          result.save();
          res.json({"status":"succesffully added"});

        }else {
          return res.status(404).send();
        }
      },(e2)=>{
         return res.send(e2);
      });

    }else {
      return res.status(404).send();
    }
  },(e)=>{
    return res.send(e);
  });

};
exports.GET_POST_LIKES = function(req,res){
  const postID = req.params.PostID;
  likesUserObjectArray = [];
  postModel.findById(postID).then((result1)=>{
    if(result1 && result1.status ==="1")
    {
      likesCount = result1.likes.length;
      var temp = likesCount;
      for(var i=0;i<likesCount;i++)
      {
          userModel.findById(result1.likes[i]).then((result2)=>{
          likesUserObjectArray.push(result2);
          temp =temp-1;
          if(temp===0){
            return res.json({
              "likesCount":likesCount,
              "likesUserObjectArray":likesUserObjectArray
            });
          }

        },(e2)=>{
           return res.send(e2);

        });
      }


    }else{
      return res.status(404).json({"status":"post not found"});
    }
  },(e1)=>{
    return res.send(e1);
  });
};

exports.GET_USER_FEED = function(req, res){
  post_array=[];
  const userID = req.params.userID;
  postModel.find({'userID':userID}).then((result)=>{
    console.log(result);
  }, (error)=>{
    return res.send(error);
  });
};
