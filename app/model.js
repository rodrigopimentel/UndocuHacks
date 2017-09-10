// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a Report Schema. This will be the basis of how report data is stored in the db
var ReportSchema = new Schema({
  incident: {type: String, required: true},
  numOfAgents: {type: String, required: true},
  eventDescription: {type: String, required: false},
  detained: {type: String, required: true},
  numberOfDetained: {type: String, required: false},
  location: {type: [Number], required: true}, // [Long, Lat]
  lastUpvote: {type: Date, default: Date.now},
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
ReportSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if(!this.created_at) {
    this.created_at = now
  }
  next();
});

// Indexes this schema in geoJSON format (critical for running proximity searches)
ReportSchema.index({location: '2dsphere'});

// Exports the ReportSchema for use elsewhere. Sets the MongoDB collection to be used as: "scotch-report"
module.exports = mongoose.model('reports', ReportSchema);
