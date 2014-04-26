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
	kraken = require('kraken-js');

/**
 * Mailer
 * Merge config defaults and send single or multiple mails
 *
 * @param (object) express app
 */
function Mailer(app){
	var self = this;

	self.res = {};
	self.options = {};
	
	var __construct = function(){
		self.setRes();
	};

	/**
	 * Set Res
	 */
	self.setRes = function(){
		if(_.isUndefined(app.response)){
			self.res = app;
		}else{
			self.res = app.response.app;
		}
	};

	/**
	 * Set Defaults
	 * Prep the config defaults, send the message
	 *
	 * @param (literal) options
	 * @return (object) smtpTransport
	 */
	self.setDefaults = function(options){

		self.options = options;

		// defaults
		self.options.create = _.defaults(config.create, self.options.create);

		// always force messages to be an array for convenience
		if(!_.isArray(self.options.message)){
			self.options.message = [self.options.message];
		}

		// add mail if no parent dir is listed
		if(self.options.template.split('/').length){
			self.options.template = 'mail/' + self.options.template;
		}

	}

	/**
	 * Transport
	 * Loops through messages applying the template, then send mail
	 *
	 * @return (object) smtpTransport
	 */
	self.transport = function(){

		var smtpTransport = nodemailer.createTransport("SMTP", self.options.create);

		// we will always loop even on one message
		_.each(self.options.message, function(message, index){

			message = _.assign(_.clone(config.message), message);

			// render the dust template and set the output to the message html
			self.res.render(self.options.template, message.data, function(err, out){
				message.html = out;

				// send mail with defined transport object
				if(!self.options.test){
					smtpTransport.sendMail(message, function(error, response){
						if(error){ console.log(error);
						}else{ console.log("Message sent: " + response.message);}
						
						// shut down the connection pool on the last messages
						if(self.options.message.length === 0){
							smtpTransport.close();
						}
					});
				}

			});
		});

		return smtpTransport;

	};

	/**
	 * Send
	 * Send the message using SMTP
	 *
	 * @param (literal) options
	 * @return (object) smtpTransport
	 */
	self.send = function(options){

		self.setDefaults(options);
		return self.transport();
	};

	__construct();

}

/**
 * Mailer
 *
 * @param (app) express app
 */
module.exports = function(app){
	return new Mailer(app);
};