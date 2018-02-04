
var task = require('shell-task');

const path = require('path');

var staticDir = path.resolve(__dirname, '../../../../ow_static/plugins/skmobileapp')

module.exports = function() {
    var promise = new Promise(function (resolve, reject) {
        new task('cordova-hcp build')
        .then('rm -rf ' + staticDir)
        .run(function (err) {
            if (!err) {
                resolve();
            }

            reject(err);
        });
    });

    return promise;
}
