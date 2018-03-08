var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    contact:{type:String,required:true},
    userName:{type:String,required:true},
    password:{type:String,required:true},
    userImage:{type:String,required:true},
    userType:{type:String,required:true},
    status:{type:String,required:true},
    following:[{type:Schema.Types.ObjectId,ref:"user"}],
    followers:[{type:Schema.Types.ObjectId,ref:"user"}]
});

var seekerSchema = new Schema({
    userID:{type:Schema.Types.ObjectId,ref:"user",required:true},
    age:{type:String,required:true},
    status:{type:String,required:true},
    postalAddress:{type:String,required:true},
    skills:[{type:String}],
    skills:[{type:String}],
    expereince:[{type:String}]

});

var companySchema = new Schema({
    userID:{type:Schema.Types.ObjectId,ref:"user",required:true},
    numberOfEmployees:{type:Number,min:0,required:true},
    dateFounded:{type:String,required:true},
    status:{type:String,required:true},
    portfolio:{type:String,required:true},
    typeOfCompany:{type:String,required:true},
    contact:{type:String,required:true},
    Address:{type:String,required:true}

});

var postSchema = new Schema({
    userID:{type:Schema.Types.ObjectId,ref:"user",required:true},
    content:{type:String,required:true},
    dateTimeCreated:{type:String,required:true},
    postType:{type:String,required:true},
    isReported:{type:Number,min:0,max:3,required:true},
    status:{type:String,required:true},
    likes:[{type:Schema.Types.ObjectId,ref:"user",required:true}]
});

var jobRequestSchema = new Schema({

    seekerID:{type:Schema.Types.ObjectId,ref:"seeker",required:true},
    title:{type:String,required:true},
    dateTimeCreated:{type:String,required:true},
    description:{type:String,required:true},
    jobType:{type:String,required:true},
    expectedSalaray:{type:String,required:true},
    preferredLocation:{type:String,required:true},
    status:{type:String,required:true},
    responsesCompanyID:[{type:Schema.Types.ObjectId,ref:"comapny"}],

});

var jobsSchema = new Schema({
    companyID:{type:Schema.Types.ObjectId,ref:"company",required:true},
    jobTitle:{type:String,required:true},
    dateTimeCreated:{type:String,required:true},
    description:{type:String,required:true},
    jobType:{type:String,required:true},
    salaray:{type:String,required:true},
    location:{type:String,required:true},
    requiredExpereice:{type:String,required:true},
    vacancies:{type:String,required:true},
    lastDateToApply:{type:String,required:true},
    status:{type:String,required:true},
    responsesSeekerID:[{type:Schema.Types.ObjectId,ref:"seeker"}],

});

var answersSchema = new Schema({
    postID:{type:Schema.Types.ObjectId,ref:"post",required:true},
    userID:{type:Schema.Types.ObjectId,ref:"user",required:true},
    content:{type:String,required:true},
    dateTimeCreated:{type:String,required:true},
    status:{type:String,required:true}

});
module.exports = mongoose.model('userModel',userSchema,'users');
module.exports = mongoose.model('seekerModel',seekerSchema,'seekers');
module.exports = mongoose.model('answerModel',answersSchema,'answers');
module.exports = mongoose.model('jobsModel',jobsSchema,'jobs');
module.exports = mongoose.model('jobsRequestModel',jobRequestSchema,'jobsRequest');
module.exports = mongoose.model('postModel',postSchema,'post');
module.exports = mongoose.model('companyModel',companySchema,'company');
