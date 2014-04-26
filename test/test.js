/*global describe:false, it:false, before:false, after:false, afterEach:false*/

var app = require('../../../index'),
    kraken = require('kraken-js'),
    mail = require('krakenjs-mailer'),
    request = require('supertest'),
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
		request(mock)
			.get('/')
			.end(function(err, res){

				mail.send(res, 'notify', {	
					message: [
						{
							subject: 'Whennotify Movies',
							to: 'jzumbrun@gmail.com',
							data: {collection: [{title:'Hello', link: 'gmail.com'},{title: 'hi', link: 'what.com'}]},
						},
						{
							subject: 'Whennotify ZMovies',
							to: 'jzumbrun+z@gmail.com',
							data: {collection: [{title:'Helloz', link: 'z.com'},{title: 'hiz', link: 'whatz.com'}]},
						}
					]
				});

				done(err);
			});
	});

});