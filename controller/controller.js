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
    const newUser = new userModel(req.body);
    newUser.save(function(error){
        res.json({user:"created Successfully"});
    });
};

exports.CREATE_SEEKER=function(req,res){
    const newSeeker = new seekerModel(req.body);
    newSeeker.save(function(error){
        res.json({seeker:"created Successfully"});
    });
};

exports.CREATE_COMPANY=function(req,res){
    const newCompany = new companyModel(req.body);
    newCompany.save(function(error){
        res.json({company:"created Successfully"});
    });

};

exports.CREATE_POST=function(req,res){
    const newPost = new postModel(req.body);
    newPost.save(function(error){
        res.json({post:"created Successfully"});
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
      res.status(404).send();
    }
  },(e)=>{
    res.status(400).send(e);
  });

};

exports.REMOVE_POST=(req,res)=>{
  const postID = req.params.postID;

  postModel.findById(postID).then((result)=>{
    if(result && result.status === "1")
    {
      result.status = "0";
      result.save();
      res.json({"status":"updated Successfully"});

    }else {
      res.status(404).send();
    }
  },(e)=>{
    res.status(400).send(e);
  });

};

exports.UPDATE_USER=(req,res)=>{
  const userID = req.params.userID;
  var obj = req.body;
  userModel.findByIdAndUpdate(userID,{$set:obj},{new:true}).then((result)=>{
    res.json({status:"updated Successfully"});

  },(e)=>{
    res.status(400).send(e);
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
    res.status(400).send(e);
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
      res.status(400).send(e);
    });
};


exports.UPDATE_POST = function(req,res){
  console.log('inside');
  const id = req.body._id;
  console.log(id);
  postModel.findByIdAndUpdate(id,{$set:req.body},{new:true}).then((result)=>{
    res.json({"status":"updatd Successfully"});
  },(e)=>{
    res.status(404).send(e);
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
       return res.status(404).send(e);
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
    return res.status(404).send(e);
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
      return res.status(404).send(e);
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
      return res.status(404).send(e);
  });
};

exports.UPDATE_COMPANY = function(req,res){
  const id = req.body._id;
  companyModel.findByIdAndUpdate(id,{$set:req.body},{new:true}).then((result)=>{
      return res.json({"status":"updated succesffully"});

  },(e)=>{
      return res.status(404).send(e);
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
          return res.status(404).send();
      });
    }
    else {
      return res.status(404).send();
    }
  },(e1)=>{
      return res.status(404).send();
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
