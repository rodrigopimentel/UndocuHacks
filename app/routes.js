// Dependencies
var mongoose        = require('mongoose');
var Report            = require('./model.js');


// Opens App Routes
module.exports = function(app) {

  // GET Routes
  // --------------------------------------------------------
  // Retrieve records for all reports in the db
  app.get('/reports', function(req, res){

    // Uses Mongoose schema to run the search (empty conditions)
    var query = Report.find({
      lastUpvote: {
        $gt: new Date(Date.now() - 10800000)
      }
    });
    query.exec(function(err, reports){
      if(err)
        res.send(err);

      // If no errors are found, it responds with a JSON of all reports
      res.json(reports);
    });
  });

  // POST Routes
  // --------------------------------------------------------
  // Provides method for saving new reports in the db
  app.post('/reports', function(req, res){

    // Creates a new Report based on the Mongoose schema and the post bo.dy
    var newreport = new Report(req.body);

    // New Report is saved in the db.
    newreport.save(function(err){
      if(err)
        res.send(err);

      // If no errors are found, it responds with a JSON of the new report
      res.json(req.body);
    });
  });

  app.post('/reports/:reportId/renew', function(req, res){

    // Creates a new Report based on the Mongoose schema and the post bo.dy
    Report.update({ _id: req.params.reportId }, {
      $set: { lastUpvote: Date.now() }
    }, function(err){
      if(err) res.send(err);

      // If no errors are found, it responds with a JSON of the new report
      res.send(true);
    });
  });
};
