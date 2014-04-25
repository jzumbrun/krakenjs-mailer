# KrakenJs Mailer

KrakenJs, Nodemailer, and Dust Integration.

## Purpose
KrakenJs Mailer allows the developer to utilize nodemailer's emailing system with KrakensJs's integrated dust templating
system. This integration allows a simple one method control to sending emails in KrakenJs's framework


## Getting Started

Enter in your SMPT details in config/mail.json

```
var mail = require('krakenjs-mailer');
```
in your controller.
Then call:

```
mail.send(res, 'your-email-message', {	
	message: {
		to: 'frank@foo.com',
		data: {name:'Frank Foo'}
	}
});
```

*Example: Full Controller*

```
app.get('/mail', function (req, res) {

	mail.send(res, 'your-email-message', {	
		message: {
			to: 'frank@foo.com',
			data: {name:'Frank Foo'}
		}
	});

		res.end();
});
```

## File and Directory structure

- **/config/mail.js** - Default configuration
- **/public/templates/mail/** - Email templates

## Customization

### Config

config/mail.json contains the default configurations for nodemailer and krakenjs-mailer including the config options for nodemailer's message and create options. The message default will extend with every custom message option that is sent through the module

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

The only public method is send(). However the third param will allow overrides of nodemailer's message and create options.

#### Parameters
res: {} 				// (required) the node respose object
name: '' 				// (required) the name or path of the template (mail/ will be prefixed when no derectories are detected)
options: 				// (required) the options for the 
	message : {			// (required) will extend from message in config/mail.json
		data : {}/[],	// (required) literal or array that is passed to dust template
						// an array will iterate through the data, apply the template, and send each message individually
		* : {}			// (optional) all other options availiable passed to nodemailer message options
	}, 
	create : {}			// (optional) will extend from create in config/mail.json and passed to nodemailer create options

*Example An Single Message:*

```
mail.send(res, 'notify', {	
	message: {
		subject: 'Messaging Frank Foo',
		to: 'frank@foo.com',
		data: {name:'Frank Foo'}
	}
});
```

*Example An Array of Messages:*
```
mail.send(res, 'notify', {	
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


# Contributing to the KrakenJs Mailer

Bugs and new features should be submitted using [Github issues](https://github.com/jzumbrun/krakenjs-mailer/issues/new).

## FAQ

### Can I use another templating system other than KrackenJs's Dust?
Technically, yes. However the templating system must NOT cache as multiple messages must be unique.

### Can I use another mailer other than nodemailer?
No not at this time. It probably never will be.

### Can I use another mail protocol other than SMPT?
No not at this time. But you can contribute to add that option.