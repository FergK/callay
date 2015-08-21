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
    
    this.gamepad = {};
    this.gamepad.axisDeadzone = 0.3;
    this.gamepad.analogDeadzone = 0.1;
    this.gamepad.buttonThreshold = 0.5;
    
    this.gameplay = {};
    this.gameplay.FOV = 65;
    
    this.mouse = {};
    this.mouse.lookSensitivity = 1;
    this.mouse.allowContextMenu = false;
    
    this.video = {};
    this.video.enableAntiAliasing = true;
    
    this.world = {};
    this.world.clearColor = 0x000000;//0x82aef3;
};