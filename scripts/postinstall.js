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

var fs = require('fs'),
path = require('path');

/**
 * PostInstall
 * Install the required folder/files
 */
function PostInstall(){
	var self = this;
	
	self.root = path.resolve('.');
	self.config = self.root + '/config/mail.json';
	self.template_dir = self.root + '/public/templates/mails';

	var __construct = function(){
	};

	/**
	 * Create Config
	 * Create the config file
	 */
	self.createConfig = function(){
		fs.exists(self.config, function (exists) {
			if(exists){
				console.log('Could not make default mail config file: ' + self.config + ' file already exists');
			} else {

				var json = ['{',
							'	"create": {',
							'		"service": "Gmail",',
							'		"auth": {',
							'			"user": "user@gmail.com",',
							'			"pass": "password"',
							'		}',
							'	},',
							'	"message": {',
							'		"from": "Your Company Name <user@gmail.com>",',
							'		"subject": "Super Sweet Default Subject!"',
							'	}',
							'}'].join('\n');

				fs.writeFile(self.config, json, function (err) {
					if (err) return console.log(err);
				});
			}
		});
	};

	/**
	 * Create Mail Dir
	 * Create the directory for the mail templates
	 */
	self.createMailDir = function(){
		fs.mkdir(self.template_dir, function(error){
			if(error){
				console.log(error + '. Make sure ' + self.template_dir + ' exists');
			}
		});
	};

	__construct();

}

var post_install = new PostInstall();

post_install.createConfig();
post_install.createMailDir();