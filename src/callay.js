// Callay
// https://github.com/FergK/callay
// Fergus Kelley - FergK.com

/* global
THREE requestAnimationFrame theAnimationRequest 
Config Viewport FirstPersonCamera FreeCamera OrthoCamera Controls KeyboardControls MouseControls GamepadControls World Player
*/

const CALLAY_VERSION = "002";
document.title = "Callay v" + CALLAY_VERSION;

// Definining reusable global constants
const ORIGIN = new THREE.Vector3( 0, 0, 0 );
const X_AXIS = new THREE.Vector3( 1, 0, 0 );
const Y_AXIS = new THREE.Vector3( 0, 1, 0 );
const Z_AXIS = new THREE.Vector3( 0, 0, 1 );
const X_AXIS_NEG = new THREE.Vector3( -1, 0, 0 );
const Y_AXIS_NEG = new THREE.Vector3( 0, -1, 0 );
const Z_AXIS_NEG = new THREE.Vector3( 0, 0, -1 );
const ROT_XY = new THREE.Quaternion().setFromUnitVectors( X_AXIS, Y_AXIS );
const ROT_XZ = new THREE.Quaternion().setFromUnitVectors( X_AXIS, Z_AXIS );
const ROT_YX = new THREE.Quaternion().setFromUnitVectors( Y_AXIS, X_AXIS );
const ROT_YZ = new THREE.Quaternion().setFromUnitVectors( Y_AXIS, Z_AXIS );
const ROT_ZX = new THREE.Quaternion().setFromUnitVectors( Z_AXIS, X_AXIS );
const ROT_ZY = new THREE.Quaternion().setFromUnitVectors( Z_AXIS, Y_AXIS );
const BLACK = new THREE.Color( 0x000000 );
const EPSILON = 0.0001

var theTimer = new THREE.Clock( true );
var theTimeDelta, theFrameRate;
var theTimeDeltaAverage = 0;
var theFrameCount = 0;

var theConfig = new Config();
var theScene = new THREE.Scene();
var theViewport = new Viewport( "viewport", theConfig.video.enableAntiAliasing, theConfig.viewport.clearColor );

// World =======================================================================

var theWorld = new World();
theWorld.buildChunkAndNeighbors( 0, 0, 1 );

// console.log( theWorld.chunks[0][0] );

// var axisHelper = new THREE.AxisHelper( 2 );
// axisHelper.position.set( 0, 0, 3 );
// theScene.add( axisHelper );

var thePlayer = new Player();

// var anEntity = new Entity( new THREE.Vector3(0, -5, 10 ) );
// var aPip = new Pip( new THREE.Vector3( -5, 0, 5 ) );


// Cameras =====================================================================

// var theCamera = new OrthoCamera();

// var theCamera = new FreeCamera();
// theCamera.initialize();

var theCamera = new FirstPersonCamera( thePlayer, thePlayer.eyeOffset );

// console.log( theCamera.camera );

// Controls ====================================================================

var pointInWorld = function( event ) {
    var raycaster = new THREE.Raycaster();
    var normMouse = new THREE.Vector2( 0, 0 );
//     normMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
// 	normMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;	
	
	raycaster.setFromCamera( normMouse, theCamera.camera );

	var intersects = raycaster.intersectObjects( theScene.children );

    if ( intersects.length > 0 ) {
        // axisHelper.position.copy( intersects[0].point );
        // axisHelper.quaternion.setFromUnitVectors( Z_AXIS, intersects[ 0 ].face.normal );
        intersects[0].face.vertexColors[0].copy( BLACK );
        intersects[0].face.vertexColors[1].copy( BLACK );
        intersects[0].face.vertexColors[2].copy( BLACK );
        intersects[0].object.geometry.colorsNeedUpdate = true;
        // console.log( intersects[0].object );
    }
	
};

// var theKeyboardControls = new KeyboardControls();
// theKeyboardControls.addKeyBind( 'w', null, null, function(){ theCamera.move( new THREE.Vector3().copy( Y_AXIS ) ) }, null, null );
// theKeyboardControls.addKeyBind( 'a', null, null, function(){ theCamera.move( new THREE.Vector3().copy( X_AXIS_NEG ) ) }, null, null );
// theKeyboardControls.addKeyBind( 's', null, null, function(){ theCamera.move( new THREE.Vector3().copy( Y_AXIS_NEG ) ) }, null, null );
// theKeyboardControls.addKeyBind( 'd', null, null, function(){ theCamera.move( new THREE.Vector3().copy( X_AXIS ) ) }, null, null );
// theKeyboardControls.addKeyBind( 'r', null, null, function(){ theCamera.move( new THREE.Vector3().copy( Z_AXIS ) ) }, null, null );
// theKeyboardControls.addKeyBind( 'f', null, null, function(){ theCamera.move( new THREE.Vector3().copy( Z_AXIS_NEG ) ) }, null, null );
// theKeyboardControls.addKeyBind( 'q', null, null, function(){ theCamera.turn( -1 ) }, null, null );
// theKeyboardControls.addKeyBind( 'e', null, null, function(){ theCamera.turn( 1 ) }, null, null );
// theKeyboardControls.addKeyBind( 'x', function(){ theCamera.initialize() }, null, null,  null, null );

// var theMouseControls = new MouseControls();
// theMouseControls.addButtonBind( 2, function(){ theMouseControls.requestPointerLock( theViewport.renderer.domElement ) }, null, null, null, null );
// theMouseControls.addWheelBind( function( event ){ theCamera.zoom( event.deltaY / Math.abs( event.deltaY ) ) } );
// theMouseControls.addPointerBind( function( event ){ theCamera.mouseLook( event ) } );

var theGamepadControls = new GamepadControls();
theGamepadControls.addAxisBind( 0, function( value ){ theCamera.move( new THREE.Vector3( value, 0, 0 ) ) } );
theGamepadControls.addAxisBind( 1, function( value ){ theCamera.move( new THREE.Vector3( 0, -value, 0 ) ) } );
theGamepadControls.addAxisBind( 2, function( value ){ theCamera.turn( value ) } );
theGamepadControls.addAxisBind( 3, function( value ){ theCamera.tilt( value ) } );
theGamepadControls.addButtonBind( 0, function(){ theCamera.initialize() }, null, null, null, null );
theGamepadControls.addAnalogBind( 6, function( value ){ theCamera.zoom( value ) } );
theGamepadControls.addAnalogBind( 7, function( value ){ theCamera.zoom( -value ) } );

var theKeyboardControls = new KeyboardControls();
theKeyboardControls.addKeyBind( 'w', null, null, function(){ thePlayer.move( new THREE.Vector3().copy( Y_AXIS ) ) }, null, null );
theKeyboardControls.addKeyBind( 'a', null, null, function(){ thePlayer.move( new THREE.Vector3().copy( X_AXIS_NEG ) ) }, null, null );
theKeyboardControls.addKeyBind( 's', null, null, function(){ thePlayer.move( new THREE.Vector3().copy( Y_AXIS_NEG ) ) }, null, null );
theKeyboardControls.addKeyBind( 'd', null, null, function(){ thePlayer.move( new THREE.Vector3().copy( X_AXIS ) ) }, null, null );

var theMouseControls = new MouseControls();
theMouseControls.addButtonBind( 2, function(){ theMouseControls.requestPointerLock( theViewport.renderer.domElement ) }, null, null, null, null );
theMouseControls.addPointerBind( function( event ){ thePlayer.mouseLook( event ) } );
// theMouseControls.addPointerBind( function( event ){ thePlayer.mouseLook( event ); pointInWorld(); } );

var theControls = new Controls( theKeyboardControls, theMouseControls, theGamepadControls );

var theAnimationRequest;
function render() {
    theAnimationRequest = requestAnimationFrame( render );
    
    theTimeDelta = theTimer.getDelta();
    
    theTimeDeltaAverage = theTimeDeltaAverage * 0.95 + theTimeDelta * 0.05;
    theFrameRate = ( 1 / theTimeDeltaAverage ).toFixed(0);
    theFrameCount++;
    
    theWorld.buildChunkAndNeighbors( Math.round( theCamera.camera.position.x / theWorld.chunkSize ), Math.round( theCamera.camera.position.y / theWorld.chunkSize ), 7 );
    theWorld.buildChunksInView( theCamera.camera, 9 );
    
    // aPip.update();
    
    thePlayer.update();
    
    theControls.update();
    
    theCamera.update();
    
    theViewport.renderer.render( theScene, theCamera.camera );

}

render();