var request = require('request');

function getResources(req, res, next) {
    var port = req.headers.host.split(':')[1];
    var url = req.protocol + "://" + req.hostname + ":" + port;

    var query = req.query;
    var resources = Object.keys(query);
    var resourceIndex = 0;

    const callback = function(error) {
        if (error) {
            console.log(error);
            res.status(500);
            res.write('Internal server error');
            res.destroy();
            res.removeListener("close");
            res.end();
        } else if (resources.length > (resourceIndex + 1)) {
            res.write(',');
            resourceIndex = resourceIndex + 1;
            fetchDataFromSource();
        } else {
            res.status(200);
            res.write('}');
            res.end();
        }
    };

    res.setHeader("Content-Type", "application/json");

    res.on('error', function(error) {
        callback(error);
    });

    res.write('{');

    fetchDataFromSource();

    function fetchDataFromSource() {
        res.write(resources[resourceIndex] + ":");

        var uri = url + '/' + query[resources[resourceIndex]];
        console.log(uri);
        var resourceStream = request({uri: uri, headers: req.headers, encoding: 'utf8'});

        resourceStream.on('data', function(data) {
            res.write(data);
        });

        resourceStream.on('end', function() {
            callback(null);
        });

        resourceStream.on('error', function(err) {
            resourceStream.destroy();
            callback(err);
        });
    }
}

module.exports = getResources;