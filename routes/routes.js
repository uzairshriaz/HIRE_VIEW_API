module.exports = function(app){
    var controller = require('../controller/controller');
    var controller2 = require('../controller/controller2');



    app.route('/createUser').post(controller.CREATE_USER);
    app.route('/createSeeker').post(controller.CREATE_SEEKER);
    app.route('/createCompany').post(controller.CREATE_COMPANY);
    app.route('/createPost').post(controller.CREATE_POST);
    app.route('/getUserById/:userID').get(controller.GET_USER_BY_ID);
    app.route('/removeUser/:userID').patch(controller.REMOVE_USER);
    app.route('/removePost/:postID').patch(controller.REMOVE_POST);
    app.route('/updateUser').post(controller.UPDATE_USER);
    app.route('/postById/:postID').get(controller.GET_POST_BY_ID);
    app.route('/removeSeeker/:seekerID').patch(controller.REMOVE_SEEKER);
    app.route('/getSeekerByID/:seekerID').get(controller.GET_SEEKER_BY_ID);
    app.route('/getCompanyByID/:companyID').get(controller.GET_COMPANY_BY_ID);
    app.route('/removeComapnyByID/:companyID').patch(controller.REMOVE_COMPANY_BY_ID);
    app.route('/updateCompany').patch(controller.UPDATE_COMPANY);
    app.route('/followUser/:followerID/:followingID').get(controller.FOLLOW_USER);
    app.route('/unfollowUser/:followerID/:followingID').get(controller.UNFOLLOW_USER);
    app.route('/likePost/:postID/:likerID').get(controller.LIKE_POST);
    app.route('/unlikePost/:postID/:likerID').get(controller.UNLIKE_POST);
    app.route('/createAnswer').post(controller.CREATE_ANSWER);
    app.route('/removeAnswer').patch(controller.REMOVE_ANSWER);
    app.route('/updateAnswer').patch(controller.UPDATE_ANSWER);
    app.route('/createJobRequest').post(controller.CREATE_JOB_REQUEST);
    app.route('/createJob').post(controller.CREATE_JOB);
    app.route('/addSeekerJobResponse').post(controller.ADD_SEEKER_JOB_RESPONSE);
    app.route('/addCompanyJobRequestResponse').post(controller.ADD_COMPANY_JOB_REQUEST_RESPONSE);
    app.route('/getPostLikes/:PostID').get(controller.GET_POST_LIKES);
    app.route('/logIn/:email/:password').get(controller.LOGIN);
    //app.route('/userFeed/:userID').get(controller.GET_USER_FEED);
    app.route('/getPostsByUserID/:userID').get(controller.GET_POST_BY_USER_ID);
    app.route('/getMyJobsRequests/:seekerID').get(controller2.GET_MY_JOBS_REQUEST);
    app.route('/getMyJobs/:companyID').get(controller2.GET_MY_JOBS);
    app.route('/getAllJobsByCompanyID/:companyID').get(controller2.GET_ALL_JOBS_BY_COMPANY_ID);
    app.route('/getAlljobsRequesBySeekerID/:seekerID').get(controller2.GET_ALL_JOBS_REQUEST_BY_SEEKER_ID);
  //  app.route('/getAllJobs').get(controller2.GET_ALL_JOBS);
  //  app.route('/getAlljobsRequests').get(controller2.GET_ALL_JOBS_REQUESTS);
    app.route('/saveImage').post(controller2.SAVE_IMAGE);
    app.route('/images/:imagePath').get(controller2.GET_IMAGE);
    app.route('/addExperience').post(controller2.ADD_EXPEREINCE);
    app.route('/addEducation').post(controller2.ADD_EDUCATION);
    app.route('/addSkills').post(controller2.ADD_SKILLS);
    app.route('/getAnswersByPostID/:postID').get(controller2.GET_ANSWERS_BY_POST_ID2);
    app.route('/searchUser/:text').get(controller2.SEARCH_USER);
    app.route('/getAlljobs').get(controller2.GET_ALL_JOBS2);
    app.route('/userFeed/:userID').get(controller2.GET_USER_FEED2);
    app.route('/verifyEmail').post(controller.VERIFY_EMAIL);
    app.route('/makePassword/:pass').get(controller.MAKE_PASSWORD);
    app.route('/getJobRequestByID/:jobRequestID').get(controller2.GET_JOB_REQUEST_BY_JOB_REQUEST_ID);
    app.route('/getResponsesByJobID/:jobID').get(controller2.GET_RESPONSES_BY_JOB_ID);
    app.route('/searchJob/:text').get(controller2.SEARCH_JOBS);
    app.route('/searchJobRequest/:text').get(controller2.SEARCH_JOB_REQUEST);
    app.route('/removeJob/:jobID').get(controller2.REMOVE_JOB);
    app.route('/removeJobRequest/:jobRequestID').get(controller2.REMOVE_JOB_REQUEST);
    app.route('/removeExperience/:seekerID/:expereinceID').get(controller2.REMOVE_EXPERIENCE);
    app.route('/removeEducation/:seekerID/:educationID').get(controller2.REMOVE_EDUCATION);
    app.route('/updateExperience').post(controller2.UPDATE_EXPEREINCE);
    app.route('/updateEducation').post(controller2.UPDATE_EDUCATION);
    app.route('/getAlljobsRequests').get(controller2.GET_ALL_JOBS_REQUESTS2);
    app.route('/getCompanyResponsesByjobRequestID/:jobReqID').get(controller2.GET_COMPANY_RESPONSES_BY_JOB_REQUEST_ID);
    app.route('/updatePassword').post(controller.UPDATE_PASSWORD);

}
