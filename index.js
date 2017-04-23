var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var winston = require('winston');

// var auth = require('./auth.js');
// var channels = require('./channels.js');
// var constants = require('./constants.js');
var db = require('./db.js');
// var messages = require('./messages.js');
// var users = require('./users.js');

var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

db.initialize();

winston.level = process.env.LOG_LEVEL;
winston.info('Winston initialized with log level %s', winston.level);

app.get('/', function(req, res) {
  res.send('Hello World!')
});

// app.get('/oauth', function(req, res) {
//   winston.verbose('Received /oauth request from ' + req.ip);
//
//   var error = req.query.error;
//   var slackCode = req.query.code;
//
//   if (error != null || slackCode == null) {
//     winston.verbose('User declined oauth authorization.');
//     res.sendStatus(200);
//     return;
//   }
//
//   auth.handleOauth(slackCode);
//   res.sendStatus(200);
//
// });
//
// app.post('/slack', function(req, res) {
//
//   winston.verbose('Event received');
//
//   if (req.body.type === 'url_verification') {
//     winston.verbose('Incoming request for url_verification');
//     var challenge = req.body.challenge;
//     var token = req.body.token;
//     if (token === constants.SLACK_TOKEN) {
//       winston.verbose('Sent response to url_verification request. Looks good');
//       res.set('Content-Type', 'application/x-www-form-urlencoded');
//       res.send(challenge);
//     }
//     else {
//       winston.warn('Request for url_verification has invalid token. IP address is ' + req.ip);
//     }
//   }
//   else if (req.body.type === 'event_callback') {
//
//     if (req.body.event.type === 'message' && req.body.event.subtype != 'message_deleted' && req.body.event.subtype != 'message_changed' && req.body.event.subtype != 'channel_join' && !req.body.event.bot_id) {
//
//       if (typeof req.body.event.user === "undefined") {
//         winston.warn('UNDEFINED!!!');
//         winston.warn(req.body);
//       }
//
//       messages.processMessage(req.body.event, req.body.team_id);
//     }
//   }
//   else {
//     // ...
//   }
//   res.sendStatus(200);
// });
//
// app.post('/add_user', function(req, res) {
//   if (req.body.text == null || req.body.channel_name == null) {
//     winston.verbose('Received empty add_user request');
//     res.sendStatus(200);
//     return;
//   }
//
//   console.log('Received add_user request for user ' + req.body.text + ' on channel ' + req.body.channel_name);
//   console.log(req.body);
//   users.addUser(req.body.text, req.body.channel_id, req.body.team_id, function(result) {
//     if (result) {
//       res.send('User ' + req.body.text + ' can now post in this channel');
//     }
//     else {
//       res.send('Cannot find the user');
//     }
//   });
// });
//
// app.post('/remove_user', function(req, res) {
//   if (req.body.text == null || req.body.channel_name == null) {
//     winston.verbose('Received empty remove_user request');
//     res.sendStatus(200);
//     return;
//   }
//
//   console.log('Received remove_user request for user ' + req.body.text + ' on channel ' + req.body.channel_name);
//   console.log(req.body);
//   users.removeUser(req.body.text, req.body.channel_id, req.body.team_id, function(result) {
//     if (result) {
//       res.send('User ' + req.body.text + ' cannot post anymore in this channel');
//     }
//     else {
//       res.send('Cannot find the user');
//     }
//   });
// });
//
// app.post('/add_usergroup', function(req, res) {
//   if (req.body.text == null || req.body.channel_name == null) {
//     winston.verbose('Received empty add_usergroup request');
//     res.sendStatus(200);
//     return;
//   }
//
//   console.log('Received add_usergroup request for usergroup ' + req.body.text + ' on channel ' + req.body.channel_name);
//   console.log(req.body);
//   users.addUsergroup(req.body.text, req.body.channel_id, req.body.team_id, function(result) {
//     if (result == null) {
//       res.send('Cannot find the usergroup ' + req.body.text);
//     }
//     else if (result == 0) {
//       res.send('All memebers of the usergroup are already allowed to post');
//     }
//     else {
//       res.send(result + ' additional members are now allowed to post');
//     }
//   });
// });
//
// app.post('/remove_usergroup', function(req, res) {
//   if (req.body.text == null || req.body.channel_name == null) {
//     winston.verbose('Received empty remove_usergroup request');
//     res.sendStatus(200);
//     return;
//   }
//
//   console.log('Received remove_usergroup request for usergroup ' + req.body.text + ' on channel ' + req.body.channel_name);
//   console.log(req.body);
//   users.removeUsergroup(req.body.text, req.body.channel_id, req.body.team_id, function(result) {
//     if (result == null) {
//       res.send('Cannot find the usergroup ' + req.body.text);
//     }
//     else if (result == 0) {
//       res.send('There were no members in this group that were allowed to post');
//     }
//     else {
//       res.send(result + ' users are not allowed to post in this channel any more');
//     }
//   });
// });
//
// app.post('/enable_restricted_mode', function(req, res) {
//   if (req.body.channel_name == null) {
//     winston.verbose('Received empty enable_restricted_mode request');
//     res.sendStatus(200);
//     return;
//   }
//
//   console.log('Received enable_restricted_mode request for channel ' + req.body.channel_name);
//   console.log(req.body);
//
//   channels.addChannel(req.body.channel_id, req.body.team_id, function(status) {
//     if (status) {
//       res.send("This channel is now restricted");
//     }
//     else {
//       res.send("This channel is already restricted");
//     }
//   });
//
// });
//
// app.post('/disable_restricted_mode', function(req, res) {
//   if (req.body.channel_name == null) {
//     winston.verbose('Received empty disable_restricted_mode request');
//     res.sendStatus(200);
//     return;
//   }
//
//   console.log('Received disable_restricted_mode request for channel ' + req.body.channel_name);
//   console.log(req.body);
//   channels.removeChannel(req.body.channel_id, req.body.team_id, function(status) {
//     if (status) {
//       res.send("Everyone can now post in this channel");
//     }
//     else {
//       res.send("There were problems making this channel public. Please try again later");
//     }
//   });
// });

app.listen(app.get('port'), function() {
  winston.info('Node app is running on port', app.get('port'));
  winston.info('#################################################################################');
});
