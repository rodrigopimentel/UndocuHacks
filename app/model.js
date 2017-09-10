// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a User Schema. This will be the basis of how user data is stored in the db
var UserSchema = new Schema({
    incident: {type: String, required: true},
    numOfAgents: {type: Number, required: true},
    eventDescription: {type: String, required: false},
    detained: {type: String, required: true},
    numberOfDetained: {type: String, required: false},
    location: {type: [Number], required: true}, // [Long, Lat]
    htmlverified: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
UserSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Indexes this schema in geoJSON format (critical for running proximity searches)
UserSchema.index({location: '2dsphere'});

// Exports the UserSchema for use elsewhere. Sets the MongoDB collection to be used as: "scotch-user"
module.exports = mongoose.model('scotch-user', UserSchema);
