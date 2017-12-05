var express = require('express');
var app = express();
var port = 3000;
var getResources = require('../../middleware');

var users = generateData('user', 1000);
var customers = generateData('customer', 500);
var countries = generateData('country', 30);

function generateData(resource, count) {
    var res = [];

    for(var i = 0; i < count; i++) {
        res.push({ id: (i + 1).toString(), name: resource + ' ' + (i + 1)});
    }

    return res;
}

app.get('/api/users', function(req, res) {
    res.status(200).json(users);
});

app.get('/api/customers', function(req, res) {
    res.status(200).json(customers);
});

app.get('/api/customers/:customerId', function(req, res) {
    var customerId = req.params.customerId;
    var customer = customers.filter(function(customer) {
        return customer.id === customerId;
    })[0];

    res.status(200).json(customer || []);
});

app.get('/api/countries', function(req, res) {
    res.status(200).json(countries);
});

app.get('/api/resources', getResources);

app.listen(port, function() {
    console.log('test server started on port 3000');
});

module.exports = {
    app: app,
    users: users,
    countries: countries,
    customers: customers
};