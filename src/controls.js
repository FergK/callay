/* global theConfig */
// =============================================================================
// KEYCODES ====================================================================
// =============================================================================
// An index of all the keycodes usable for input

var keycodes = {};

keycodes['backspace'] = 8;
keycodes['tab'] = 9;

keycodes['enter'] = 13;

keycodes['shift'] = 16;
keycodes['ctrl'] = 17;
keycodes['alt'] = 18;

keycodes['pause'] = 19;

keycodes['capslock'] = 20;
keycodes['escape'] = 27;

keycodes['space'] = 32;

keycodes['pageup'] = 33;
keycodes['pagedown'] = 34;
keycodes['end'] = 35;
keycodes['home'] = 36;

keycodes['left'] = 37;
keycodes['up'] = 38;
keycodes['right'] = 39;
keycodes['down'] = 40;

keycodes['insert'] = 45;
keycodes['delete'] = 46;

keycodes['0'] = 48;
keycodes['1'] = 49;
keycodes['2'] = 50;
keycodes['3'] = 51;
keycodes['4'] = 52;
keycodes['5'] = 53;
keycodes['6'] = 54;
keycodes['7'] = 55;
keycodes['8'] = 56;
keycodes['9'] = 57;

keycodes['a'] = 65;
keycodes['b'] = 66;
keycodes['c'] = 67;
keycodes['d'] = 68;
keycodes['e'] = 69;
keycodes['f'] = 70;
keycodes['g'] = 71;
keycodes['h'] = 72;
keycodes['i'] = 73;
keycodes['j'] = 74;
keycodes['k'] = 75;
keycodes['l'] = 76;
keycodes['m'] = 77;
keycodes['n'] = 78;
keycodes['o'] = 79;
keycodes['p'] = 80;
keycodes['q'] = 81;
keycodes['r'] = 82;
keycodes['s'] = 83;
keycodes['t'] = 84;
keycodes['u'] = 85;
keycodes['v'] = 86;
keycodes['w'] = 87;
keycodes['x'] = 88;
keycodes['y'] = 89;
keycodes['z'] = 90;

keycodes['meta'] = 91;
keycodes['metaright'] = 92; // Unsure if supported in any browsers

keycodes['select'] = 93;

keycodes['num0'] = 96;
keycodes['num1'] = 97;
keycodes['num2'] = 98;
keycodes['num3'] = 99;
keycodes['num4'] = 100;
keycodes['num5'] = 101;
keycodes['num6'] = 102;
keycodes['num7'] = 103;
keycodes['num8'] = 104;
keycodes['num9'] = 105;

keycodes['nummult'] = 106;
keycodes['numadd'] = 107;
keycodes['numsub'] = 109;
keycodes['numdec'] = 110;
keycodes['numdiv'] = 111;

keycodes['f1'] = 112;
keycodes['f2'] = 113;
keycodes['f3'] = 114;
keycodes['f4'] = 115;
keycodes['f5'] = 116;
keycodes['f6'] = 117;
keycodes['f7'] = 118;
keycodes['f8'] = 119;
keycodes['f9'] = 120;
keycodes['f10'] = 121;
keycodes['f11'] = 122;
keycodes['f12'] = 123;

keycodes['numlock'] = 144;
keycodes['scrolllock'] = 145;

keycodes[';'] = 186;
keycodes['='] = 187;
keycodes[','] = 188;
keycodes['-'] = 189;
keycodes['.'] = 190;
keycodes['/'] = 191;
keycodes['`'] = 192;

keycodes['['] = 219;
keycodes['\\'] = 220;
keycodes[']'] = 221;
keycodes['\''] = 222;

// =============================================================================
// Gamepad Codes ===============================================================
// =============================================================================
// An index of all the gamepad buttons 

var padbuttons = {};
padbuttons['FACE_1'] = 0;
padbuttons['FACE_1'] = 0;
padbuttons['a'] = 0;
padbuttons['FACE_2'] = 1;
padbuttons['b'] = 1;
padbuttons['FACE_3'] = 2;
padbuttons['x'] = 2;
padbuttons['FACE_4'] = 3;
padbuttons['y'] = 3;
padbuttons['LEFT_SHOULDER'] = 4;
padbuttons['lb'] = 4;
padbuttons['RIGHT_SHOULDER'] = 5;
padbuttons['rb'] = 5;
padbuttons['LEFT_SHOULDER_BOTTOM'] = 6;
padbuttons['lt'] = 6;
padbuttons['RIGHT_SHOULDER_BOTTOM'] = 7;
padbuttons['rt'] = 7;
padbuttons['SELECT'] = 8;
padbuttons['select'] = 8;
padbuttons['START'] = 9;
padbuttons['start'] = 9;
padbuttons['LEFT_ANALOGUE_STICK'] = 10;
padbuttons['ls'] = 10;
padbuttons['RIGHT_ANALOGUE_STICK'] = 11;
padbuttons['rs'] = 11;
padbuttons['PAD_TOP'] = 12;
padbuttons['dpadup'] = 12;
padbuttons['PAD_BOTTOM'] = 13;
padbuttons['dpaddown'] = 13;
padbuttons['PAD_LEFT'] = 14;
padbuttons['dpadleft'] = 14;
padbuttons['PAD_RIGHT'] = 15;
padbuttons['dpadright'] = 15;

var padaxes = {};
padaxes['lx'] = 0;
padaxes['ly'] = 1;
padaxes['rx'] = 2;
padaxes['ry'] = 3;


// =============================================================================
// CONTROLS ====================================================================
// =============================================================================
// Master class for all user input: keyboard, mouse, and hopefully gamepad

function Controls( keyboard, mouse, gamepad ) {

    this.keyboard = ( keyboard !== undefined ) ? keyboard : null;
    this.mouse = ( mouse !== undefined ) ? mouse : null;
    this.gamepad = ( gamepad !== undefined ) ? gamepad : null;
    
    this.pointerLockElement = null;
    
    this.addEventListeners();

}
Controls.prototype.constructor = Controls;

// update ======================================================================
// Called each frame.
Controls.prototype.update = function() {

    if ( this.keyboard !== null ) { this.keyboard.update(); }
    if ( this.mouse !== null ) { this.mouse.update(); }
    if ( this.gamepad !== null ) { this.gamepad.update(); }

};

// addEventListeners ===========================================================
// Get the events from the browser
Controls.prototype.addEventListeners = function() {

    if ( this.keyboard !== null ) { this.keyboard.addEventListeners(); }
    if ( this.mouse !== null ) { this.mouse.addEventListeners(); }
    if ( this.gamepad !== null ) { this.gamepad.addEventListeners(); }

};

// removeEventListeners ========================================================
// Disable getting the events from the browser
Controls.prototype.removeEventListeners = function() {

    if ( this.keyboard !== null ) { this.keyboard.removeEventListeners(); }
    if ( this.mouse !== null ) { this.mouse.removeEventListeners(); }
    if ( this.gamepad !== null ) { this.gamepad.removeEventListeners(); }

};

// =============================================================================
// GamepadControls =============================================================
// =============================================================================
// Only supports one gamepad for the time being.

function GamepadControls() {
  
    this.axisBinds = {}; // List of bound functions for axis movement
    this.buttonBinds = {}; // List of buttonBind objects for gamepad button presses
    this.analogButtonBinds = {}; // List of bound functions for analog buttons
    
    this.axisDeadzone = ( theConfig.gamepad.axisDeadzone === undefined ) ? 0.3 : theConfig.gamepad.axisDeadzone;
    this.analogDeadzone = ( theConfig.gamepad.analogDeadzone === undefined ) ? 0.1 : theConfig.gamepad.analogDeadzone;
    this.buttonThreshold = ( theConfig.gamepad.buttonThreshold === undefined ) ? 0.5 : theConfig.gamepad.buttonThreshold;
    
    this.gamepads = navigator.getGamepads(); // A list of all connected gamepads
    
    // console.log( this.gamepads );

}
GamepadControls.prototype.constructor = GamepadControls;

// addEventListeners / removeEventListeners  ===================================
// Mozilla uses connect and disconnect event, chrome doesn't
// So we'll just poll for connected gamepads and not worry about events for now
GamepadControls.prototype.addEventListeners = function() {};
GamepadControls.prototype.removeEventListeners = function() {};

// update ======================================================================
// Called each frame. Used necessary for eachframe, whileup, and whiledown bindings
GamepadControls.prototype.update = function() {
    
    // this.gamepads = navigator.getGamepads();
    // // console.log( this.gamepads );

    // // Find the first connected gamepad, if any
    // for( var i = 0; i < 4; i++ ) {
    //     if ( this.gamepads[i] !== undefined ) {
    //         this.gamepad = this.gamepads[i];
    //         break;
    //     }
    // }
    
    // // If no gamepad is connected, we can't do anything.
    // if ( i >= 4 ) { return false; }
    
    // // Handle the axes
    // for( i = 0; i < this.gamepad.axes.length; i++ ) {
    //     // console.log( this.gamepad.axes );
    //     var value = this.gamepad.axes[i];
        
    //     // Implement the deadzone and scale the result from 0 - 1.0
    //     if ( ( value > -this.axisDeadzone ) && ( value < this.axisDeadzone ) ) {
    //         value = 0;
    //     } else if ( value > this.axisDeadzone ) {
    //         value = ( value - this.axisDeadzone ) * ( 1 / ( 1 - this.axisDeadzone) );
    //     } else if ( value < -this.axisDeadzone ) {
    //         value = ( value + this.axisDeadzone ) * ( 1 / ( 1 - this.axisDeadzone) );
    //     }
        
    //     if ( this.axisBinds[i] !== undefined ) {
    //         // console.log( value );
    //         this.axisBinds[i]( value );
    //     }
    // }
    
    // // Handle the analog buttons
    // for ( var button in this.analogButtonBinds ) {
        
    //     value = this.gamepad.buttons[button].value;
        
    //     // Implement the deadzone and scale the result from 0 - 1.0
    //     if ( ( value > -this.analogDeadzone ) && ( value < this.analogDeadzone ) ) {
    //         value = 0;
    //     } else if ( value > this.analogDeadzone ) {
    //         value = ( value - this.analogDeadzone ) * ( 1 / ( 1 - this.analogDeadzone) );
    //     } else if ( value < -this.analogDeadzone ) {
    //         value = ( value + this.analogDeadzone ) * ( 1 / ( 1 - this.analogDeadzone) );
    //     }
        
    //     if ( this.analogButtonBinds[button] !== undefined ) {
    //         this.analogButtonBinds[button]( value );
    //     }
        
    // }
    
    // // Loop through each of the button binds
    // // It will know it if is pressed or not and what functions to call.
    // for ( var button in this.buttonBinds ) {
    //     this.buttonBinds[button].update( this.gamepad.buttons[button].value, this.buttonThreshold );
    // }

};

// addAxisBind / clearAxisBind =================================================
GamepadControls.prototype.addAxisBind = function( axis, onMove ) {
    this.axisBinds[axis] = onMove;
};
GamepadControls.prototype.clearAxisBind = function( axis ) {
    delete this.axisBinds[axis];
};

// addAnalogBind / clearAnalogBind =============================================
GamepadControls.prototype.addAnalogBind = function( button, onMove ) {
    this.analogButtonBinds[button] = onMove;
};
GamepadControls.prototype.clearAnalogBind = function( button ) {
    delete this.analogButtonBinds[button];
};

// addButtonBind ===============================================================
// Links a set of functions to a specific mouse button
GamepadControls.prototype.addButtonBind = function( buttonNum, onDown, onUp, whileDown, whileUp, eachFrame ) {
    this.buttonBinds[buttonNum] = new ButtonBind( onDown, onUp, whileDown, whileUp, eachFrame );
};

// clearButtonBind =============================================================
// Removes any bound functions from a specific button
GamepadControls.prototype.clearButtonBind = function( buttonNum ) {
    
    if ( this.buttonBinds[buttonNum] === undefined ) {
        console.warn( "Could not unbind gamepad button" + buttonNum + "." );
        return false;
    } else {
        delete this.buttonBinds[buttonNum];
        return true;
    }
};

// =============================================================================
// ButtonBind ==================================================================
// =============================================================================

function ButtonBind( onDown, onUp, whileDown, whileUp, eachFrame ) {

    this.onDown = ( onDown !== undefined ) ? onDown : null;
    this.onUp = ( onUp !== undefined ) ? onUp : null;
    this.whileDown = ( whileDown !== undefined ) ? whileDown : null;
    this.whileUp = ( whileUp !== undefined ) ? whileUp : null;
    this.eachFrame = ( eachFrame !== undefined ) ? eachFrame : null;

    this.pressed = false;
    this.repeated = false;

}
ButtonBind.prototype.constructor = KeyBind;

// update ======================================================================
// Unlike a keyboard key, the gamepad does not use events,
// so it has to track its own changing state
ButtonBind.prototype.update = function( value, threshold ) {

    if ( this.eachFrame !== null ) {
        this.eachFrame();
    }
    
    this.pressed = ( value >= threshold );

    if ( ( ! this.repeated ) && ( this.pressed ) && ( this.onDown !== null ) ){
        // The button was pressed this frame
        this.onDown();
        
    } 

    if ( ( this.repeated ) && ( this.pressed ) && ( this.whileDown !== null ) ) {
        // The button was pressed previously and is now being held down
        this.whileDown();
    }
    
    if ( ( this.repeated ) && ( ! this.pressed ) && ( this.onUp !== null ) ) {
        // The button was released this frame
        this.onUp();
    }

    if ( ( this.whileUp !== null ) && ( ! this.pressed ) ) {
        this.whileUp();
    }

    this.repeated = this.pressed;

};


// =============================================================================
// MouseControls ===============================================================
// =============================================================================

function MouseControls() {
  
    this.mouseButtonBinds = {}; // List of keyBind objects for mouse button presses
    
    this.moveBind = null;
    this.wheelBind = null;
    this.pointerBind = null;
    
    this.pointerLockElement = null;
    
    this.allowContextMenu = false;
    this.toggleAllowContextMenu( theConfig.mouse.allowContextMenu );
  
}
MouseControls.prototype.constructor = MouseControls;

// addEventListeners / removeEventListeners  ===================================
MouseControls.prototype.addEventListeners = function() {
    
    this.mouseDownListener = this.onMouseDown.bind( this );
    this.mouseUpListener = this.onMouseUp.bind( this);
    this.mouseMoveListener = this.onMouseMove.bind( this );
    this.mouseWheelListener = this.onMouseWheel.bind( this );
    this.pointerLockChangeListener = this.onPointerLockChange.bind( this );

    document.addEventListener( 'mousedown', this.mouseDownListener, false );
    document.addEventListener( 'mouseup', this.mouseUpListener, false );
    document.addEventListener( 'mousemove', this.mouseMoveListener, false );
    document.addEventListener( 'wheel', this.mouseWheelListener, false );
    
    document.addEventListener( 'pointerlockchange', this.pointerLockChangeListener, false );

};

MouseControls.prototype.removeEventListeners = function() {
    
    document.removeEventListener( 'mousedown', this.mouseDownListener, false );
    document.removeEventListener( 'mouseup', this.mouseUpListener, false );
    document.removeEventListener( 'mousemove', this.mouseMoveListener, false );
    document.removeEventListener( 'wheel', this.mouseWheelListener, false );
    
    document.removeEventListener( 'contextmenu', this.contextMenuListener, false );
    
    document.removeEventListener( 'pointerlockchange', this.pointerLockChangeListener, false );
    
};


// Pointer Lock ================================================================
MouseControls.prototype.requestPointerLock = function( element ) {

    // TODO Get working in firefox
    // element.requestPointerLock = element.requestPointerLock ||
    //     element.mozRequestPointerLock ||
    //     element.webkitRequestPointerLock;
    
    element.requestPointerLock();
};

MouseControls.prototype.exitPointerLock = function() {
    document.exitPointerLock();
};

MouseControls.prototype.onPointerLockChange = function( event ) {
    
    // TODO Get working in firefox
    // this.pointerLockElement = document.pointerLockElement || 
    //     document.mozPointerLockElement ||
    //     document.webkitPointerLockElement;
    
    this.pointerLockElement = document.pointerLockElement;
        
};

// toggleAllowContextMenu ======================================================
// Enables or disables the display of the context menu on right click
// If passed with no parameter, toggleAllowContextMenu is toggled to the opposite
MouseControls.prototype.toggleAllowContextMenu = function( allow ) {
    
    this.allowContextMenu = ( allow !== undefined ) ? allow : ! this.allowContextMenu;
    
    if ( ! this.allowContextMenu ) {
        this.contextMenuListener = function ( event ) { event.preventDefault() };
        document.addEventListener( 'contextmenu', this.contextMenuListener, false );
    } else {
        document.removeEventListener( 'contextmenu', this.contextMenuListener, false );
    }
    
};

// addButtonBind ===============================================================
// Links a set of functions to a specific mouse button
MouseControls.prototype.addButtonBind = function( buttonNum, onDown, onUp, whileDown, whileUp, eachFrame ) {
    
    this.mouseButtonBinds[buttonNum] = new KeyBind( onDown, onUp, whileDown, whileUp, eachFrame );
  
};

// clearButtonBind ==========================================================
// Removes any bound functions from a specific button
MouseControls.prototype.clearButtonBind = function( buttonNum ) {
    
    if ( this.mouseButtonBinds[buttonNum] === undefined ) {
        console.warn( "Could not unbind mouse button" + buttonNum + "." );
        return false;
    } else {
        delete this.mouseButtonBinds[buttonNum];
        return true;
    }
};

// addMoveBind / clearMoveBind =================================================
MouseControls.prototype.addMoveBind = function( onMove ) {
    this.moveBind = onMove;
};
MouseControls.prototype.clearMoveBind = function() {
    this.moveBind = null;
};

// addWheelBind / clearWheelBind ===============================================
MouseControls.prototype.addWheelBind = function( onScroll ) {
    this.wheelBind = onScroll;
};
MouseControls.prototype.clearWheelBind = function() {
    this.wheelBind = null;
};

// addPointerBind / clearPointerBind ===========================================
MouseControls.prototype.addPointerBind = function( onPointerMove ) {
    this.pointerBind = onPointerMove;
};
MouseControls.prototype.clearPointerBind = function() {
    this.pointerBind = null;
};

// update ======================================================================
// Called each frame. Used necessary for eachframe, whileup, and whiledown bindings
MouseControls.prototype.update = function() {

    for ( var buttonCode in this.mouseButtonBinds ) {
        // Loop through each of the keybinds
        // It will know it if is pressed or not and what functions to call.
        this.mouseButtonBinds[buttonCode].update();
    }

};

// onMouseDown =================================================================
// Triggered on any mouse button being pressed
MouseControls.prototype.onMouseDown = function( event ) {

    if ( this.mouseButtonBinds[event.button] !== undefined ) {
        this.mouseButtonBinds[event.button].onKeyDown();
    }
   
};

// onMouseUp ===================================================================
// Triggered on any mouse button being released
MouseControls.prototype.onMouseUp = function( event ) {
  
    if ( this.mouseButtonBinds[event.button] !== undefined ) {
        this.mouseButtonBinds[event.button].onKeyUp();
    }
  
};

// onMouseMove =================================================================
MouseControls.prototype.onMouseMove = function( event ) {
  
    if ( ( this.pointerLockElement !== null ) && ( this.pointerBind !== null ) ) {
        this.pointerBind( event );
    } else if ( this.moveBind !== null ) {
        this.moveBind( event );
    }
  
};

// onMouseWheel ================================================================
MouseControls.prototype.onMouseWheel = function( event ) {

    if ( this.wheelBind !== null ) {
        this.wheelBind( event );
    }
  
};


// =============================================================================
// KeyboardControls ============================================================
// =============================================================================

function KeyboardControls() {

    this.keyBinds = {}; // List of KeyBind objects.
  
}
KeyboardControls.prototype.constructor = KeyboardControls;

KeyboardControls.prototype.addEventListeners = function() {
    
    this.keyDownListener = this.onKeyDown.bind( this );
    this.keyUpListener = this.onKeyUp.bind( this );
    this.visibilityChangeListener = this.onChangeVisibility.bind( this );
    
    document.addEventListener( 'keydown', this.keyDownListener, false );
    document.addEventListener( 'keyup', this.keyUpListener, false );
    document.addEventListener( 'visibilitychange', this.visibilityChangeListener, false );

};

KeyboardControls.prototype.removeEventListeners = function() {
    
    document.removeEventListener( 'keydown', this.keyDownListener, false );
    document.removeEventListener( 'keyup', this.keyUpListener, false );
    document.removeEventListener( 'visibilitychange', this.visibilityChangeListener, false );

};

// getKeyCode =================================================================
// Uses the keycode lookup table to find the keycode for a given named key
KeyboardControls.prototype.getKeyCode = function( keyName ) {
    var keyCode = keycodes[keyName];
    
    if ( keyCode === undefined ) {
        console.warn( "Key named '" + keyName + "' not found." );
        return undefined;
    } else {
        return keyCode;
    }
};

// addKeyBind ==================================================================
// Links a set of functions to a specific key
KeyboardControls.prototype.addKeyBind = function( keyName, onDown, onUp, whileDown, whileUp, eachFrame ) {
    
    var keyCode = this.getKeyCode( keyName );
    
    if ( keyCode !== undefined ) {
        this.keyBinds[keyCode] = new KeyBind( onDown, onUp, whileDown, whileUp, eachFrame );
        return true;
    } else {
        console.warn( "Could not bind key." );
        return false;
    }
  
};

// clearKeyBind ==================================================================
// Removes any bound functions from a specific key
KeyboardControls.prototype.clearKeyBind = function( keyName ) {
    
    var keyCode = this.getKeyCode( keyName );
    
    if ( ( keyCode === undefined ) || ( this.keyBinds[keyCode] === undefined ) ) {
        console.warn( "Could not unbind key." );
        return false;
    } else {
        delete this.keyBinds[keyCode];
        return true;
    }
    
};

// update ======================================================================
// Called each frame. Used necessary for eachframe, whileup, and whiledown bindings
KeyboardControls.prototype.update = function() {

    for ( var keyCode in this.keyBinds ) {
        // Loop through each of the keybinds
        // It will know it if is pressed or not and what functions to call.
        this.keyBinds[keyCode].update();
    }

};

// onKeyDown ===================================================================
// Triggered on any key being pressed
KeyboardControls.prototype.onKeyDown = function( event ) {
  
    // This stops the browser from performing any action when this key is pressed
    // if you want certain actions to still occur, exclude them here.
    if (
        ( event.keyCode === keycodes['shift'] ) ||
        ( event.keyCode === keycodes['ctrl'] ) ||
        ( event.keyCode === keycodes['alt'] ) ||
        ( event.keyCode === keycodes['escape'] ) ||
        ( event.keyCode === keycodes['j'] ) ||
        ( event.keyCode === keycodes['f5'] ) ||
        ( event.keyCode === keycodes['f11'] ) 
    ) {
        // Do nothing
    } else {
        event.preventDefault();
    }
    
    if ( this.keyBinds[event.keyCode] !== undefined ) {
        this.keyBinds[event.keyCode].onKeyDown();
    }
   
};

// onKeyUp =====================================================================
// Triggered on any key being released
KeyboardControls.prototype.onKeyUp = function( event ) {
  
    if ( this.keyBinds[event.keyCode] !== undefined ) {
        this.keyBinds[event.keyCode].onKeyUp();
    }
  
};

// onChangeVisibility ==========================================================
// Triggered by a change in focus to browser window.
// Loops through each key in the this.keys array and runs the onKeyUp function
// for each key that is currently pressed. This prevents the annoying situation
// where if the window loses focus while a key is held down it stays "held down"
// in the code until the actual key is pressed again.
KeyboardControls.prototype.onChangeVisibility = function( event ) {
  
    if ( !document.hidden ) { 
         // Didn't lose focus, don't do anything
        return;
    }
    
    for ( var keyCode in this.keyBinds ) {
        // Loop through each of the keybinds
        // It will know it if is pressed or not and what functions to call.
        this.keyBinds[keyCode].onKeyUp();
    }
  
};

// =============================================================================
// KEYBIND =====================================================================
// =============================================================================

function KeyBind( onDown, onUp, whileDown, whileUp, eachFrame ) {

    this.onDown = ( onDown !== undefined ) ? onDown : null;
    this.onUp = ( onUp !== undefined ) ? onUp : null;
    this.whileDown = ( whileDown !== undefined ) ? whileDown : null;
    this.whileUp = ( whileUp !== undefined ) ? whileUp : null;
    this.eachFrame = ( eachFrame !== undefined ) ? eachFrame : null;

    this.pressed = false;

}
KeyBind.prototype.constructor = KeyBind;

// update ======================================================================
// Called each frame. Checks to see if it's inputs are met and if so, calls the
// appropriate functions.
KeyBind.prototype.update = function() {

    if ( this.eachFrame !== null ) {
        this.eachFrame();
    }

    if ( ( this.whileDown !== null ) && ( this.pressed ) ) {
        this.whileDown();
    }

    if ( ( this.whileUp !== null ) && ( ! this.pressed ) ) {
        this.whileUp();
    }

};

// onKeyDown ================================================================
// Called on the keyDown event. Checks to see if it's inputs are met and if so,
// calls the appropriate functions.
KeyBind.prototype.onKeyDown = function() {

    if ( ( this.onDown !== null ) && ( ! this.pressed ) ) {
        this.onDown();
    }
    
    this.pressed = true;
    
};


// onKeyUp ==================================================================
// Called on the keyUp event. Checks to see if it's inputs are met and if so,
// calls the appropriate functions.
KeyBind.prototype.onKeyUp = function() {

    if ( ( this.onUp !== null ) && ( this.pressed ) ) {
        this.onUp();
    }
    
    this.pressed = false;

};