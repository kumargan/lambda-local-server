var express = require('express');
var router = express.Router();
var child_process = require('child_process');
var path = require('path');
var fs = require('fs');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/html', function(req, res, next) {
  //res.sendFile('resources/legacy_time.html', {root: __dirname })
  res.sendFile(path.join(__dirname,'..','resources/legacy_time.html'));
});


router.get('/v1/s', function(req, res, next) {
  executeLambda(req, res, next);
});


function executeLambda(req, res, next){

	var event = {
 	'body-json': {},
  		params: {
	    	path: {},
	    	querystring: {
		      c: req.query.c,
		      rr : req.query.rr,
		      cid : req.query.cid,
		      q : req.query.q
	    	},
	    	"header":{
  				"Cookie":req.headers.cookie
  			}
  		},
  		context:{
  			"resource-path":req._parsedUrl.pathname.replace('/v1','')
  		}
	};
	console.log(req._parsedUrl.pathname);

	fs.writeFile('event.json', JSON.stringify(event), function (err) {
  		if (err) console.log(err);
  		else console.log('Saved!');

  		child_process.exec('lambda-local -l resources/index.js -h handler -v 1 -e event.json -E \'{"kinesisStreamName":"ecp-session-track-dev","alsoWriteEventsToCloudwatch":"true"}\'', function(error, stdout, stderr){
			console.log("error",error);
			console.log("stdout",JSON.parse(stdout.replace('info','')).body);
			console.log("stderr",stderr);
			res.send(JSON.parse(stdout.replace('info','')).body);
		});
	});

	

}

module.exports = router;
