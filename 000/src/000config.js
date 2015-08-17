/* global THREE */

// =============================================================================
// CONFIG =======================================================================
// =============================================================================
// Class for saving and restoring configuration values

var Config = function() {
  
  this.resetToDefaults();

};
Config.prototype.constructor = Config;

Config.prototype.resetToDefaults = function() {
  this.mouse = {};
  this.mouse.lookSensitivity = 1;
  
  this.gameplay = {};
  this.gameplay.FOV = 65;
  
  this.video = {};
  this.video.enableAntiAliasing = true;
};