var assert = require('assert');
var chai = require('chai');
var chaiHttp = require('chai-http');
var testApp = require('./server/server');
var server = testApp.app;
var users = testApp.users;
var countries = testApp.countries;
var customers = testApp.customers;

chai.should();
chai.use(chaiHttp);

describe('Get all resources step by step', function() {
    it('should fetch all users', function(done) {
        chai.request(server)
            .get('/api/users')
            .end(function(err, res) {
                res.should.have.status(200);
                assert(res.body, users);

                done();
            })
    });

    it('should fetch all customers', function(done) {
        chai.request(server)
            .get('/api/customers')
            .end(function(err, res) {
                res.should.have.status(200);
                assert(res.body, customers);

                done();
            })
    });

    it('should fetch all countries', function(done) {
        chai.request(server)
            .get('/api/countries')
            .end(function(err, res) {
                res.should.have.status(200);
                assert(res.body, countries);

                done();
            })
    });
});

describe('Get resource by id', function() {
    it('should fetch customer by id', function(done) {
        chai.request(server)
            .get('/api/customers/23')
            .end(function(err, res) {
                res.should.have.status(200);
                assert(res.body, {id: '23', name: 'customer 23'});

                done();
            })
    });
});

describe('Get all resources at once', function() {
    it('should fetch all resources', function(done) {
        var url = '/api/resources?users=api/users&customer=api/customers/23&countries=api/countries';
        chai.request(server)
            .get(url)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');

                assert(res.body.users, users);
                assert(res.body.countries, countries);
                assert(res.body.customer, {id: '23', name: 'customer 23'});

                done();
            })
    });
});