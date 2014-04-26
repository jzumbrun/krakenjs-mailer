/*────────────────────────────────────────────────────────────────────────*\
│  Copyright (C) 2014 }else{ elseblock.com                                 │
│                                ,,                                        │
│              mq.            `7MM                        ,pm              │
│                Mb             MM                      6M                 │
│                YM    .gP"Ya   MM  ,pP"Ybd  .gP"Ya     M9                 │
│                `"b._,M'   Yb  MM  8I   `" ,M'   Yb _.d"'                 │
│                ,qd"'8M""""""  MM  `YMMMa. 8M"""""" `"bp.                 │
│                6M   YM.    ,  MM  L.   I8 YM.    ,    Mb                 │
│                M9    `Mbmmd'.JMML.M9mmmP'  `Mbmmd'    YM                 │
│              md'                                        `bm              │
│                                                                          │
│  Licensed under the The MIT License (MIT);                               │
│  You may not use this file except in compliance with (MIT).              │
│  License located at http://opensource.org/licenses/MIT                   │
\*────────────────────────────────────────────────────────────────────────*/
'use strict';

var nodemailer = require('nodemailer'),
	_ = require('lodash'),
	config = require('../../../config/mail'),
	mailer = {
		res:{},
		name: '',
		options: {}
	};

/**
 * Set Defaults
 * Prep the config defaults, send the message
 *
 * @param (object) express response
 * @param (string) name
 * @param (literal) options
 * @return (object) smtpTransport
 */
function setDefaults(res, name, options){

	mailer.res = res;
	mailer.name = name;
	mailer.options = options;

	// defaults
	mailer.options.create = _.defaults(config.create, mailer.options.create);

	// always force messages to be an array for convenience
	if(!_.isArray(mailer.options.message)){
		mailer.options.message = [mailer.options.message];
	}

	// add mail if no parent dir is listed
	if(mailer.name.split('/').length){
		mailer.name = 'mail/' + mailer.name;
	}

}

/**
 * Transport
 * Loops through messages applying the template, then send mail
 *
 * @return (object) smtpTransport
 */
function transport(){

	var smtpTransport = nodemailer.createTransport("SMTP", mailer.options.create);

	// we will always loop even on one message
	_.each(mailer.options.message, function(message, index){

		message = _.assign(_.clone(config.message), message);

		// render the dust template and set the output to the message html
		mailer.res.render(mailer.name, message.data, function(err, out){
			message.html = out;

			//send mail with defined transport object
			smtpTransport.sendMail(message, function(error, response){
				if(error){ console.log(error);
				}else{ console.log("Message sent: " + response.message);}
				
				// shut down the connection pool on the last messages
				if(mailer.options.message.length === 0){
					smtpTransport.close();
				}
			});
		});
	});

	return smtpTransport;

}

/**
 * Send
 * Send the message using SMTP
 *
 * @param (object) express response
 * @param (string) name
 * @param (literal) options
 * @return (object) smtpTransport
 */
exports.send = function(res, name, options){
	setDefaults(res, name, options);
	return transport();
};