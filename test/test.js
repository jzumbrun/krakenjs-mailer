/*global describe:false, it:false, before:false, after:false, afterEach:false*/

var app = require('../../../index'),
    kraken = require('kraken-js'),
    mail = require('krakenjs-mailer')(app),
    assert = require('assert');

describe('KrakenJs Mailer', function () {

    var mock;

    beforeEach(function (done) {
        kraken.create(app).listen(function (err, server) {
            mock = server;
            done(err);
        });
    });


    afterEach(function (done) {
        mock.close(done);
    });


	it('should return output when the configs are correct', function (done) {
		
		mail.send({
			test : true,
			template: '',
			message: [
				{
					subject: 'Whennotify Movies',
					to: 'test@gmail.com',
					data: {collection: [{title:'Hello', link: 'gmail.com'},{title: 'hi', link: 'what.com'}]},
				},
				{
					subject: 'Whennotify Movies1',
					to: 'test+1@gmail.com',
					data: {collection: [{title:'Hello1', link: '1.com'},{title: 'hi1', link: 'what1.com'}]},
				}
			]
		});

	});

});