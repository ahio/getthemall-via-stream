# getthemall-via-stream
[![Build Status](https://travis-ci.org/ahio/getthemall-via-stream.svg?branch=master)](https://travis-ci.org/ahio/getthemall-via-stream)

Small express middleware to help you fetch JSON data from multiple resources.

# Installation
```
npm install git+https://github.com/ahio/getthemall-via-stream.git --save
```
# Usage
Suppose you have an API
```
app.get('/api/users', function(req, res) {
    //send users
});

app.get('/api/countries', function(req, res) {
    //send countries
});

app.get('/api/customers/:customerId', function(req, res) {
    //find customer by id and send
});
```
Instead of doing 3 or 5 or more ajax requests in order to get resources, you can simply get all resources at once
```
import getResources from 'getthemall-via-stream'; //ES6
var getResources = require('getthemall-via-stream'); //ES5

...
app.get('api/resources', getResources);

//GET api/resources?users=api/users&customer=api/customers/30&countries=api/countries
//result - {users: [...], customer: {}, countries: [...]}
```
