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
    app.route('/updateUser/:userID').patch(controller.UPDATE_USER);
    app.route('/postById/:postID').get(controller.GET_POST_BY_ID);
    app.route('/removeSeeker/:seekerID').patch(controller.REMOVE_SEEKER);
    app.route('/getSeekerByID/:seekerID').get(controller.GET_SEEKER_BY_ID);
    app.route('/getCompanyByID/:companyID').get(controller.GET_COMPANY_BY_ID);
    app.route('/removeComapnyByID/:companyID').patch(controller.REMOVE_COMPANY_BY_ID);
    app.route('/updateCompany').patch(controller.UPDATE_COMPANY);
    app.route('/followUser').patch(controller.FOLLOW_USER);
    app.route('/unfollowUser').patch(controller.UNFOLLOW_USER);
    app.route('/likePost').patch(controller.LIKE_POST);
    app.route('/unlikePost').patch(controller.UNLIKE_POST);
    app.route('/createAnswer').post(controller.CREATE_ANSWER);
    app.route('/removeAnswer').patch(controller.REMOVE_ANSWER);
    app.route('/updateAnswer').patch(controller.UPDATE_ANSWER);
    app.route('/createJobRequest').post(controller.CREATE_JOB_REQUEST);
    app.route('/createJob').post(controller.CREATE_JOB);
    app.route('/addSeekerJobResponse').patch(controller.ADD_SEEKER_JOB_RESPONSE);
    app.route('/addCompanyJobRequestResponse').patch(controller.ADD_COMPANY_JOB_REQUEST_RESPONSE);
    app.route('/getPostLikes/:PostID').get(controller.GET_POST_LIKES);
    app.route('/logIn/:email/:password').get(controller.LOGIN);
    app.route('/userFeed/:userID').get(controller.GET_USER_FEED);
    app.route('/getPostsByUserID/:userID').get(controller.GET_POST_BY_USER_ID);
    app.route('/getAllJobs').get(controller2.GET_ALL_JOBS);
    app.route('/getMyJobsRequests/:seekerID').get(controller2.GET_MY_JOBS_REQUEST);
    app.route('/getMyJobs/:companyID').get(controller2.GET_MY_JOBS);
    app.route('/getAllJobRequests').get(controller2.GET_ALL_JOB_REQUESTS);

}
