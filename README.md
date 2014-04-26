# KrakenJs Mailer

KrakenJs, Nodemailer, and Dust Integration.

## Purpose
KrakenJs Mailer allows the developer to utilize nodemailer's emailing system with KrakensJs's integrated dust templating
system. This integration allows a simple one method control for sending emails in KrakenJs's framework

## Getting Started

1. Install the KrakenJs Mailer via 
    ```
    npm install krakenjs-mailer --save
    ```

2. Enter in your SMPT details in config/mail.json
3. Add the require to the top of your controller (notice the passing of app) under the module.exports call
    ```
    module.exports = function (app) {
        var mail = require('krakenjs-mailer')(app);
    ```

4. Create the send call in your controller:
    ```
    mail.send({
    	template: 'your-email-message',	
    	message: {
    		to: 'frank@foo.com',
    		data: {name:'Frank Foo'}
    	}
    });
    ```
5. Profit

*Example: Full Controller*

```
// controllers/mail.js
module.exports = function (app) {
	var mail = require('krakenjs-mailer')(app);

    app.get('/mail', function (req, res) {
    
    	mail.send({
    		template: 'your-email-message',	
    		message: {
    			to: 'frank@foo.com',
    			data: {name:'Frank Foo'}
    		}
    	});
    
    	res.end();
    });
};
```

## File and Directory structure

- **/config/mail.js** - Default configuration
- **/public/templates/mail/** - Email templates

## Customization

KrakenJs Mailer is more of a "plugin" to KrakenJs.
Thus 
```
var mail = require('krakenjs-mailer')(app)
```
has the app passed in.
This allows the most flexible access to KrackenJs without creating middleware, etc.

### Config

config/mail.json contains the default configurations for Nodemailer and krakenjs-mailer including the config options for Nodemailer's message and create options. The message default will extend with every custom message option that is sent through the module

*Example:*

```
{	
	"create": {
		"service": "Gmail",
		"auth": {
			"user": "you@gmail.com",
			"pass": "securepassword"
		}
	},
	"message": {
		"from": "Your Comapany <you@yourcompany.com>",
		"subject": "Your Company Message"
	}
}
```

### Send

The only public method is send(options). However the options param will allow overrides of nodemailer's message and create options.

#### Options Param (required)
```
{
	template: ''        // (required) the name or path of the template (mail/ will be prefixed when no directories are detected)
	message : {         // (required) will extend from message in config/mail.json
		data : {}/[],   // (required) literal or array that is passed to dust template
                        // an array will iterate through the data, apply the template, and send each message individually
		* : {}          // (optional) all other options availiable passed to nodemailer's message options
	}, 
	create : {}         // (optional) will extend from create in config/mail.json and passed to nodemailer's create options
}
```
*Example An Single Message:*

```
mail.send({
	template: 'notify',	
	message: {
		subject: 'Messaging Frank Foo',
		to: 'frank@foo.com',
		data: {name:'Frank Foo'}
	}
});
```

*Example An Array of Messages:*
```
mail.send({
	template: 'notify',
	message: [
		{
			subject: 'Messaging Frank Foo',
			to: 'frank@foo.com',
			data: {name:'Frank Foo'}
		},
		{
			subject: 'Messaging Brad Bar',
			to: 'brad@bar.com',
			data: {name:'Brad Bar'},
		}
	]
});
```


# Questions and Contributing to KrakenJs Mailer

Bugs and new features should be submitted using [Github issues](https://github.com/jzumbrun/krakenjs-mailer/issues/new).

## FAQ

### Can I use another templating system other than KrackenJs's Dust?
Technically, yes. However the templating system must NOT cache as multiple messages must be unique.

### Can I use another mailer other than Nodemailer?
No. It probably never will be. Thus the name krankenjs-mailer. It is a name merge of KrakenJs and Nodemailer.

### Can I use another mail protocol other than SMPT?
No not at this time. But you can contribute to add that option.