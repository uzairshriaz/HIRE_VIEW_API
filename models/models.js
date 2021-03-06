var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var educationSchema = new Schema({
    tenureStart:{type:String,required:true},
    tenureEnd:{type:String,required:true},
    degreeName:{type:String,required:true},
    institueName:{type:String,required:true}
});
var experineceSchema = new Schema({
    tenureStart:{type:String,required:true},
    tenureEnd:{type:String,required:true},
    designation:{type:String,required:true},
    companyName:{type:String,required:true}
});


var userSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    contact:{type:String,required:true},
    userName:{type:String,required:true},
    password:{type:String,required:true},
    userImage:{type:String,required:true},
    userType:{type:String,required:true},
    status:{type:String,required:true},
    confirmed:{ type: Boolean, default: false,required:true},
    secretToken:{type:String},
    following:[{type:Schema.Types.ObjectId,ref:"user"}],
    followers:[{type:Schema.Types.ObjectId,ref:"user"}]
});

var seekerSchema = new Schema({
    userID:{type:Schema.Types.ObjectId,ref:"user",required:true},
    age:{type:String,required:true},
    status:{type:String,required:true},
    postalAddress:{type:String,required:true},
    skills:[{type:String}],
    education:[educationSchema],
    expereince:[experineceSchema]

});

var companySchema = new Schema({
    userID:{type:Schema.Types.ObjectId,ref:"user",required:true},
    numberOfEmployees:{type:Number,min:0,required:true},
    dateFounded:{type:String,required:true},
    status:{type:String,required:true},
    portfolio:{type:String},
    typeOfCompany:{type:String},
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

var jobResponseSchema = new Schema({
    userID: {type:Schema.Types.ObjectId,ref:"user"},
    jobRequestID :{type:Schema.Types.ObjectId,ref:"jobRequest"},
    coverLetter:{type:String},
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
    responsesSeekerID:[jobResponseSchema],

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
module.exports = mongoose.model('educationModel',educationSchema,'education');
module.exports = mongoose.model('expereinceModel',experineceSchema,'experinece');
module.exports = mongoose.model('jobResponseModel',jobResponseSchema,'jobResponse');
