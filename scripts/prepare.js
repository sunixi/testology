var fs = require('fs');
const path = require('path');

/**
 * Get config value
 *
 * @param {String} name
 * @param {Object} configs
 * @returns {String}
 */
function getConfigValue(name, configs) {
    return configs[name] || '${' + name + '}';
}

module.exports = function() {
    // read the application config
    var configs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../application.config.json'), 'utf8'));

    //-- generate chcp config file --//
    var data = {
        "update": "now",
        "content_url": getConfigValue('serverUrl', configs).concat('/ow_static/plugins/skmobileapp/src')
    };

    fs.writeFile(path.resolve(__dirname, '../cordova-hcp.json'), JSON.stringify(data));

    //-- generate xml config file --//
    var configTmplContent = fs.readFileSync(path.resolve(__dirname, '../config.tmpl.xml'), 'utf8');

    var configContent = configTmplContent.replace(/\$\{\w+\}/g, function(match) {
        return getConfigValue(match.substring(2, match.length - 1), configs);
    });

    fs.writeFileSync(path.resolve(__dirname, '../config.xml'), configContent, 'utf8');
}
