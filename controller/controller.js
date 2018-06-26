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
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
const jobResponseModel = mongoose.model('jobResponseModel');


exports.CREATE_USER=function(req,res){
    str1 = "seeker";
    str2 = "company";
    pass = req.body.password;
    //console.log(pass);
    var patternForPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;;
    var ress = pass.match( patternForPassword );
    if(!ress)
    {
      return res.json({"Error":"password not fulfilled all the rules"});
    }
    bcrypt.hash(pass,10,function(err,hash){
      pass = hash;
      console.log(pass);
      //generate Random string
      const secretToken = randomstring.generate({
          length: 4,
          charset: 'numeric'
      });


    var userObj = {
      "name": req.body.name,
      "email": req.body.email,
      "contact": req.body.contact,
      "userName": req.body.userName,
      "password": pass,
      "userImage": "new.png",
      "userType": req.body.userType,
      "status": "1",
      "confirmed":false,
      "secretToken":secretToken,
      "followers": [],
      "following": []
    };
    const newUser = new userModel(userObj);
    const usertype = req.body.userType;
    //console.log(req.body.email);
    userModel.find({$or:[{"email":req.body.email},{"userName":req.body.userName}]}).then((ressult)=>{
      //console.log(ressult);
      if (!ressult[0]){
        //console.log("niceee");
        newUser.save().then((result)=>{
          sendEmail(result.email,result.secretToken);
        //  console.log(usertype);
          if(usertype.toUpperCase() === str1.toUpperCase()){
            //seeker
            newObj = {
              "userID":result._id,
              "age":"0",
              "status":"1",
              "postalAddress":"0",
              "skills":"0",
              "education":[],
              "expereince":[]
            }
            const newSeeker = new seekerModel(newObj);
            console.log(newSeeker);
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
              "status":"1",
              "portfolio":"",
              "typeOfCompany":"",
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
      }
      else{
        res.json({"Error":"User already exist"});
      }
    }, (errror)=>{
      res.send("end wala error");
    });
    });
};

exports.LOGIN = function(req,res)
{
  const usertype = req.body.userType;

  userModel.findOne({'email': req.params.email}).then((result)=>
  {
    if(!result)
    {
      return res.json([]);
    }
    if(!result.confirmed){
      return res.json({"Error":"please confirm you email"});
    }

    //console.log(result);
    bcrypt.compare(req.params.password,result.password,function(err,ress)
    {
      if(!ress)
      {
          return res.json({"Error":"password not match"});
      }
      else
      {
        console.log("password matched");
        if(result.userType === "seeker" && result.status === "1")
        {
          //seeker
          seekerModel.findOne({"userID": result._id}).then((seekerResult)=>
          {
            var obj = [{
              "seekerID":seekerResult._id,
              "person":result,
              "age": seekerResult.age,
              "status": seekerResult.status,
              "postalAddress": seekerResult.postalAddress,
              "skills": seekerResult.skills,
              "education": seekerResult.education,
              "expereince": seekerResult.expereince,
            }];
            return res.send(obj);

          },(seekerError)=>{res.send(seekerError);});
        }
        else if(result.userType ==="company" && result.status ==="1")
        {
          //comapny
          companyModel.findOne({"userID": result._id}).then((companyResult)=>
          {
            var obj = [{
              "companyID":companyResult._id,
              "person":result,
              "numberOfEmployees": companyResult.numberOfEmployees,
              "dateFounded": companyResult.dateFounded,
              "status": companyResult.status,
              "portfolio": companyResult.portfolio,
              "typeOfCompany": companyResult.typeOfCompany,
              "contact": companyResult.contact,
              "Address": companyResult.Address
            }];
            return res.send(obj);

          },(companyError)=>{res.send(companyError);})
        }
        else {
          res.json([]);
        }

      }
    });
  },(resultError)=>{res.send(resultError)});
}

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
      return res.json({"status":200});
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
  const userID = req.body.person._id;
  var obj = req.body;
  console.log(obj);
  userModel.findByIdAndUpdate(userID,{$set:obj},{new:true}).then((result)=>{
    console.log(result);
    if(result.userType == "seeker"){
      //seeker
      seekerModel.findOne({"userID":result._id}).then((seekerResult)=>{
        var obj = [{
          "seekerID":seekerResult._id,
          "person":result,
          "age": seekerResult.age,
          "status": seekerResult.status,
          "postalAddress": seekerResult.postalAddress,
          "skills": seekerResult.skills,
          "education": seekerResult.education,
          "expereince": seekerResult.expereince,
        }];
        return res.send(obj);

      },(seekerError)=>{
        res.send(seekerError);
      });
    }
    else{
      //company
      companyModel.findOne({"userID":result._id}).then((companyResult)=>{
        var obj = [{
          "companyID":companyResult._id,
          "person":result,
          "numberOfEmployees": companyResult.numberOfEmployees,
          "dateFounded": companyResult.dateFounded,
          "status": companyResult.status,
          "portfolio": companyResult.portfolio,
          "typeOfCompany": companyResult.typeOfCompany,
          "contact": companyResult.contact,
          "Address":companyResult.Address
        }];

      },(companyError)=>{
        res.send(companyError);
      });
    }

  },(e)=>{
    res.send(e);
  });

};


exports.GET_USER_BY_ID=function(req,res){
  const id = req.params.userID;
    //var userID=0;
  userModel.findById(id).then((userResult)=>{
  //  console.log(userResult);
    if(userResult.userType == "company"){
      //company
      console.log("company");
      companyModel.find({"userID":id}).then((companyResult)=>{
        var obj = [{
          "companyID":companyResult[0]._id,
          "person":userResult,
          "numberOfEmployees":companyResult[0].numberOfEmployees,
          "dateFounded":companyResult[0].dateFounded,
          "status": companyResult[0].status,
          "portfolio": companyResult[0].portfolio,
          "typeOfCompany": companyResult[0].typeOfCompany,
          "contact": companyResult[0].contact,
          "Address": companyResult[0].Address
        }];
        res.send(obj);
      },(companyError)=>{
        return res.send(companyError);
      });
    }else {
      //seeker
      console.log("seeker");
      seekerModel.find({"userID":id}).then((seekerResult)=>{
        var obj = [{
          "seekerID":seekerResult[0]._id,
          "person":userResult,
          "age": seekerResult[0].age,
          "status": seekerResult[0].status,
          "postalAddress": seekerResult[0].postalAddress,
          "skills": seekerResult[0].skills,
          "education": seekerResult[0].education,
          "expereince": seekerResult[0].expereince,
        }];
        return res.send(obj);
      },(seekerError)=>{
        return res.send(seekerError);
      });
    }
  },(userError)=>{
    res.send(userError);
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
      userModel.findById(result.userID).then((userResult)=>{
        var obj = [{
          "seekerID":result._id,
          "person":userResult,
          "age": result.age,
          "status": result.status,
          "postalAddress": result.postalAddress,
          "skills": result.skills,
          "education": result.education,
          "expereince": result.expereince,
        }];
        return res.send(obj);

      },(userError)=>{
        res.send(userError);
      });

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
      userModel.findById(result.userID).then((userResult)=>{
        var obj = [{
          "companyID":result._id,
          "person":userResult,
          "numberOfEmployees": result.numberOfEmployees,
          "dateFounded": result.dateFounded,
          "status": result.status,
          "portfolio": result.portfolio,
          "typeOfCompany": result.typeOfCompany,
          "contact": result.contact,
          "Address": result.Address
        }];
        res.send(obj);
      },(userError)=>{
        return res.status(404).send(userError);
      });
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
  const followerID = req.params.followerID; // 1 na 2 ko follow krna
  const followingID = req.params.followingID;
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
  //console.log('unfollow');
  const followerID = req.params.followerID;
  const followingID = req.params.followingID;
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
            return res.status(200).send({"status":"UN-followed successfully"});
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
  const postID = req.params.postID;
  const likerID = req.params.likerID;
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
              return res.status(200).json({"status":"liked :) "});
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
  const postID = req.params.postID;
  const likerID = req.params.likerID;
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
         return res.status(200).json({"status":"unliked succesffully"});
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
    return res.json({'result':result});
  },(e)=>{
    res.send(e);
  });
};
exports.CREATE_JOB = function(req,res){
  console.log('create job ');
  const job = new jobsModel(req.body);
  job.save().then((result)=>{
    var obj = {
      "result":result
    }
    res.send(obj);
  },(e)=>{
    res.send(e);
  });
};
exports.ADD_SEEKER_JOB_RESPONSE=function(req,res){
  console.log('inside');
  const jobID = req.body.jobID;
  const userID = req.body.userID;
  const jobRequestID = req.body.jobRequestID;
  const coverLetter = req.body.coverLetter;
  arrayForJobResponses =[];

  var text = '{"userID":"'+userID+'"}'
  var obj = JSON.parse(text);
  var flag = false;
  //console.log(obj.userID);

  jobsModel.findById(jobID).then((jobsResult)=>{
    arrayForJobResponses = jobsResult.responsesSeekerID;
     //console.log(typeof(JSON.stringify(arrayForJobResponses[i].userID)));
    for(var i=0;i<arrayForJobResponses.length;i++)
    {
      //console.log(JSON.stringify(arrayForJobResponses[i].userID));
      if(JSON.stringify(arrayForJobResponses[i].userID) == '"'+obj.userID+'"'){
        flag = true;
        break;
      }
    }
    if(flag){
      return res.json({"error":"already added response"});
    }
    else{
    //console.log(userID);
    var objj = {
      "userID":userID,
      "jobRequestID":jobRequestID,
      "coverLetter":coverLetter

    };
    //console.log(objj);
    var newResponseModel = new jobResponseModel(objj);
    console.log(newResponseModel);
    //console.log(newResponseModel);
    jobsResult.responsesSeekerID.push(newResponseModel);
    jobsResult.save();
    res.json({"result":"added succesffully"});
    }

  },(jobsError)=>{
    res.send(jobsError);
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
  const userID = req.params.userID;

  arrayforPosts = [];

  //console.log(userID);
  userModel.find({$and:[{'_id':userID},{'status':'1'}]}).then((user)=>{
    //console.log(user);
    arrayforFollowingPeople = user[0].following;
  //  console.log(arrayforFollowingPeople);

    postModel.find({$and:[{'userID':user[0]._id},{'status':'1'}]}).then((posts)=>{

      for(var i=0 ;i<posts.length;i++)
      {
        arrayofLikesID = posts[i].likes;
        if(arrayofLikesID.indexOf(userID)> -1)
        {

        }
        var obj = {
          "userType":user[0].userType,
          "name":user[0].name,
          "userImage":user[0].userImage,
          "likes":posts[i].likes,
          "likesCount":posts[i].likes.length,
          "_id":posts[i]._id,
          "userID":posts[i].userID,
          "content":posts[i].content,
          "dateTimeCreated":posts[i].dateTimeCreated,
          "postType":posts[i].postType,
          "isReported":posts[i].isReported,
          "status":posts[i].status,
          "userObject":user[0]
        }
        arrayforPosts.push(obj);
      }

      getFollowingPosts(arrayforFollowingPeople,function (){
        //console.log(arrayforPosts);
        setTimeout(function() {
          res.send(arrayforPosts);
        }, 3000);

      });

    },(e2)=>{
      res.send(e2);
    });

  },(e)=>{
    res.send(e);
  });

};

function getPostsOfEachFollowing(item, doneCallback){
  userModel.find({$and:[{'_id':item},{'status':'1'}]}).then((user2)=>
  {
      postModel.find({$and:[{'userID':user2[0]._id},{'status':'1'}]}).then((posts2)=>
      {
        //console.log(posts2);
        for(var y = 0; y < posts2.length; y++)
        {
          var obj = {
            "userType":user2[0].userType,
            "name":user2[0].name,
            "userImage":user2[0].userImage,
            "likes":posts2[y].likes,
            "likesCount":posts2[y].likes.length,
            "_id":posts2[y]._id,
            "userID":posts2[y].userID,
            "content":posts2[y].content,
            "dateTimeCreated":posts2[y].dateTimeCreated,
            "postType":posts2[y].postType,
            "isReported":posts2[y].isReported,
            "status":posts2[y].status,
            "userObject":user2[0]
          }
          arrayforPosts.push(obj);
        }
      },(e4)=>{
        res.send(e4);
      });
  },
  (e9)=>{ res.send(e9); })
  .then(()=>
  {
  //  console.log(arrayforPosts);
    return doneCallback(null); //ye line chalye ge to async.each ke call back chalye ge
  }
  ,(errr)=>
  {
  });
}

function getFollowingPosts(arrayforFollowingPeople,callback1){

  async.each(arrayforFollowingPeople,getPostsOfEachFollowing,function(err){
    if(!err){
      callback1();
    }

  });

}

exports.GET_POST_BY_USER_ID =function(req,res){
  arrayforPosts = [];
  const userID = req.params.userID;
  userModel.findById(userID).then((result)=>{
    postModel.find({$and:[{'userID':result._id},{'status':'1'}]}).then((result1)=>{
      //console.log(result1);
      var count = result1.length;
      for(var i=0 ;i<result1.length;i++)
      {
        var obj = {
          "userType":result.userType,
          "name":result.name,
          "userImage":result.userImage,
          "likes":result1[i].likes,
          "likesCount":result1[i].likes.length,
          "_id":result1[i]._id,
          "userID":result1[i].userID,
          "content":result1[i].content,
          "dateTimeCreated":result1[i].dateTimeCreated,
          "postType":result1[i].postType,
          "isReported":result1[i].isReported,
          "status":result1[i].status,
          "userObject":result

        }
        arrayforPosts.push(obj);
        count--;

      }
      if(count === 0){
        res.send(arrayforPosts);
      }

    },(e1)=>{

      res.send(e1);
    });
    //console.log(result);
  },(e)=>{
    res.send(e);
  });
};
exports.VERIFY_EMAIL = function(req,res){
    console.log(req.body);
  const email =  req.body.email;

  const secretToken = req.body.secretToken;
  userModel.findOne({"email":email,"secretToken":secretToken}).then((userResult)=>{
    if(userResult){
      userResult.secretToken ="null";
      userResult.confirmed = true;
      userResult.save().then((saveResult)=>{res.send(saveResult)},(saveError)=>{res.send(saveError)});
    }else{
      return res.json({"error":"No user Found"});
    }
  },(userError)=>{res.send(userError);});
}
function sendEmail(email,code){
  var transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
            user: 'bssef15alabs@gmail.com',
            pass: 'uzair547'
        }
    });
    //sending the email
    const mailOptions = {
      from: 'hire_view@yahoo.com', // sender address
      to: email, // list of receivers
      subject: 'HireView - Email Verification', // Subject line
      html: '<p><b>Thank you for signing up on our platform.<br>Your email verification code is : </b>'+code+'</p>'// plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
     if(err)
       return
     else
       return
   });

}
exports.MAKE_PASSWORD=function(req,res)
{
  const pass = req.params.pass;
  bcrypt.hash(pass,10,function(err,hash){
    res.send(hash);
  });

}

exports.UPDATE_PASSWORD = function(req,res){
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  //console.log(email);
  userModel.findOne({"email":email}).then((userResult)=>{
    if(password == "NA"){
      userResult.name = name;
      userResult.save();
       return res.send({"status":"updated Successfully"});
    }
    bcrypt.hash(password,10,function(err,hash){
      userResult.password = hash;
      userResult.name = name;
      userResult.save();
      res.send({"status":"updated Successfully"});
    });
  },(userError)=>{
    res.send(userError);
  });
}
