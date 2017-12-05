var request = require('request');

function getResources(req, res, next) {
    var port = req.headers.host.split(':')[1];
    var url = req.protocol + "://" + req.hostname + ":" + port;

    var query = req.query;
    var resources = Object.keys(query);
    var resourceIndex = 0;

    var callback = function(error) {
        if (error) {
            console.log(error);
            res.write('{' + error + '}}');
            res.end();

        } else if (resources.length > (resourceIndex + 1)) {
            res.write(',');
            resourceIndex = resourceIndex + 1;
            fetchDataFromSource();

        } else {
            res.write('}');
            res.end();
        }
    };

    res.setHeader("Content-Type", "application/json");

    res.on('error', function(error) {
        callback(error);
    });

    res.status(200);
    res.write('{');

    fetchDataFromSource();

    function fetchDataFromSource() {
        var uri = url + '/' + query[resources[resourceIndex]];
        var resourceStream = request({uri: uri, headers: req.headers, encoding: 'utf8'});

        resourceStream.on('response', function(response) {
            var contentTypeJSON = response.headers['content-type'].includes('application/json');
            var error = null;

            res.write('"' + resources[resourceIndex] + '":');

            if (!(response.statusCode === 200)) {
                error = new Error('Can not fetch data, status code - ' + response.statusCode);
                resourceStream.destroy(error);
                callback(error, null);

            } else if (!contentTypeJSON) {
                error = new Error('Can not fetch data, unexpected content-type');
                resourceStream.destroy(error);
                callback(error, null);

            } else {
                resourceStream.on('data', function(data) {
                    res.write(data);
                });

                resourceStream.on('end', function() {
                    callback(null);
                });
            }
        });

        resourceStream.on('error', function(err) {
            resourceStream.destroy(new Error(err));
            callback(err);
        });
    }
}

module.exports = getResources;