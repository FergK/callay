// Callay
// https://github.com/FergK/callay
// Fergus Kelley - FergK.com

/* global THREE requestAnimationFrame theAnimationRequest  Config Viewport FreeCamera OrthoCamera KeyboardControls MouseControls GamepadControls Controls*/

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

var theTimer = new THREE.Clock( false );
var theTimeDelta, theFrameRate;
var theTimeDeltaAverage = 0;
var theFrameCount = 0;

var theConfig = new Config();
var theScene = new THREE.Scene();
var theViewport = new Viewport( "viewport", theConfig.video.enableAntiAliasing, theConfig.viewport.clearColor );


// Cameras =====================================================================

// var theCamera = new OrthoCamera();

var theCamera = new FreeCamera();
theCamera.initialize();


// Controls ====================================================================

var theKeyboardControls = new KeyboardControls();
theKeyboardControls.addKeyBind( 'w', null, null, function(){ theCamera.move( new THREE.Vector3().copy( Y_AXIS ) ) }, null, null );
theKeyboardControls.addKeyBind( 'a', null, null, function(){ theCamera.move( new THREE.Vector3().copy( X_AXIS_NEG ) ) }, null, null );
theKeyboardControls.addKeyBind( 's', null, null, function(){ theCamera.move( new THREE.Vector3().copy( Y_AXIS_NEG ) ) }, null, null );
theKeyboardControls.addKeyBind( 'd', null, null, function(){ theCamera.move( new THREE.Vector3().copy( X_AXIS ) ) }, null, null );
theKeyboardControls.addKeyBind( 'r', null, null, function(){ theCamera.move( new THREE.Vector3().copy( Z_AXIS ) ) }, null, null );
theKeyboardControls.addKeyBind( 'f', null, null, function(){ theCamera.move( new THREE.Vector3().copy( Z_AXIS_NEG ) ) }, null, null );
theKeyboardControls.addKeyBind( 'q', null, null, function(){ theCamera.turn( -1 ) }, null, null );
theKeyboardControls.addKeyBind( 'e', null, null, function(){ theCamera.turn( 1 ) }, null, null );
theKeyboardControls.addKeyBind( 'x', function(){ theCamera.initialize() }, null, null,  null, null );

var theMouseControls = new MouseControls();
// theMouseControls.addButtonBind( 0, pointInWorld, null, null, null, null );
// theMouseControls.addButtonBind( 1, function(){ console.log("middle mouse") }, null, null, null, null );
theMouseControls.addButtonBind( 2, function(){ theMouseControls.requestPointerLock( theViewport.renderer.domElement ) }, null, null, null, null );
theMouseControls.addMoveBind( function( event ){ pointInWorld( event ) } ); 
theMouseControls.addWheelBind( function( event ){ theCamera.zoom( event.deltaY / Math.abs( event.deltaY ) ) } );
theMouseControls.addPointerBind( function( event ){ theCamera.mouseLook( event ) } );

var theGamepadControls = new GamepadControls();
theGamepadControls.addAxisBind( 0, function( value ){ theCamera.move( new THREE.Vector3( value, 0, 0 ) ) } );
theGamepadControls.addAxisBind( 1, function( value ){ theCamera.move( new THREE.Vector3( 0, -value, 0 ) ) } );
theGamepadControls.addAxisBind( 2, function( value ){ theCamera.turn( value ) } );
theGamepadControls.addAxisBind( 3, function( value ){ theCamera.tilt( value ) } );
theGamepadControls.addButtonBind( 0, function(){ theCamera.initialize() }, null, null, null, null );
theGamepadControls.addAnalogBind( 6, function( value ){ theCamera.zoom( value ) } );
theGamepadControls.addAnalogBind( 7, function( value ){ theCamera.zoom( -value ) } );

var theControls = new Controls( theKeyboardControls, theMouseControls, theGamepadControls );

var theWorld = new World();
theWorld.buildChunkAndNeighbors( 0, 0, 7 );

var axisHelper = new THREE.AxisHelper( 50 );
axisHelper.position.set( 0, 0, 3 );
theScene.add( axisHelper );

var pointInWorld = function( event ) {
//     var raycaster = new THREE.Raycaster();
//     var normMouse = new THREE.Vector2();
//     normMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
// 	normMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;	
	
// 	raycaster.setFromCamera( normMouse, theCamera.camera );

// 	var intersects = raycaster.intersectObjects( theScene.children );

//     if ( intersects.length > 0 ) {
//         axisHelper.position.copy( intersects[0].point );
//         axisHelper.quaternion.setFromUnitVectors( Z_AXIS, intersects[ 0 ].face.normal );
//     }
	
};

var theAnimationRequest;
theTimer.start();
function render() {
    theAnimationRequest = requestAnimationFrame( render );
    
    theTimeDelta = theTimer.getDelta();
    
    theTimeDeltaAverage = theTimeDeltaAverage * 0.95 + theTimeDelta * 0.05;
    theFrameRate = ( 1 / theTimeDeltaAverage ).toFixed(0);
    theFrameCount++;
    
    theWorld.buildChunkAndNeighbors( Math.round( theCamera.camera.position.x / theWorld.chunkSize ), Math.round( theCamera.camera.position.y / theWorld.chunkSize ), 2 );
    
    theControls.update();
    
    theCamera.update();
    
    //   theWorld.rotation.z += 0.005;
    //   if ( theWorld.rotation.z > ( Math.PI * 2 ) ) { theWorld.rotation.z = 0 };
    
    theViewport.renderer.render( theScene, theCamera.camera );

}

render();

// https://preview.c9.io/fergk/callay/001/001index.html?_c9_id=livepreview0&_c9_host=https://ide.c9.io