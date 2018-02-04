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
    var manifest = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/manifest.tmpl.json'), 'utf8'));
    manifest['play_store_key'] = configs['play_store_key'];
    fs.writeFileSync(path.resolve(__dirname, '../src/manifest.json'), JSON.stringify(manifest), 'utf8');

}
