var settings = require('settings');
var settings_local = {};
try {settings_local = require('settings_local');} catch (err) {}

module.exports = settings_local || settings
