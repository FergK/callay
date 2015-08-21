// Callay v000
// Fergus Kelley - FergK.com

/* global THREE requestAnimationFrame theAnimationRequest Config Viewport FreeCamera IsoCamera*/

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
var theDate = new Date();
var theFrameCount = 0;

var theConfig = new Config();
var theScene = new THREE.Scene();
var theViewport = new Viewport( "viewport", theConfig.video.enableAntiAliasing, theConfig.world.clearColor );

// var theCamera = new OrthoCamera();

var theCamera = new FreeCamera();
theCamera.initialize();

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
theMouseControls.addButtonBind( 1, function(){ console.log("middle mouse") }, null, null, null, null );
theMouseControls.addButtonBind( 2, function(){ theMouseControls.requestPointerLock( theViewport.renderer.domElement ) }, null, null, null, null );
 
// theMouseControls.addMoveBind( function( event ){ pointInWorld( event ) } ); 
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
// theControls.removeEventListeners();

var theWorldGeometry = new THREE.Geometry();

var heightMap = [];
var colorMap = [];
var mapSize = 128;
var halfMap = mapSize * 0.5;
var maxHeight = 10;

var highcolor = new THREE.Color("rgb(255,128,128)"); // Red/blue
var lowcolor = new THREE.Color("rgb(0,128,255)");//rgb(130, 174, 243)");//
var edgecolor = new THREE.Color("rgb(255, 255, 255)");

// var highcolor = new THREE.Color("rgb(154, 181, 74)"); // Grass
// var lowcolor = new THREE.Color("rgb(69, 92, 0)");
// var edgecolor = new THREE.Color("rgb(255,255,255)");

// var highcolor = new THREE.Color("rgb(255, 0, 0)"); // RGB
// var lowcolor = new THREE.Color("rgb(0, 255, 00)");
// var edgecolor = new THREE.Color("rgb(0, 0, 255)");

// var highcolor = new THREE.Color("rgb(255,255,255)"); // Tinted greyscale
// var lowcolor = new THREE.Color("rgb(50,50,50)");
// lowcolor.r += THREE.Math.randFloat( 0, 0.1 );
// lowcolor.g += THREE.Math.randFloat( 0, 0.1 );
// lowcolor.b += THREE.Math.randFloat( 0, 0.1 );
// var edgecolor = lowcolor;



var pixelArraySize = mapSize * mapSize;
var data = new Float32Array( pixelArraySize );

var high = 0;
var low = Number.POSITIVE_INFINITY;

var perlin = new ImprovedNoise();
// var z = Math.random();
var z = Math.random() * 100;

for ( var octive = 2; octive <= 6; octive++ ) {
    for ( var i = 0; i < pixelArraySize; i++ ) {
      
        var x = i % mapSize;
        var y = ~~( i / mapSize );
        var scaling = Math.pow( 2, octive );
        
        data[i] += Math.abs( perlin.noise( x / scaling, y / scaling, z ) ) * ( scaling );
    
    }
}

for ( var i = 0; i < pixelArraySize; i++ ) {        
    if ( data[i] > high ) { high = data[i] }
    if ( data[i] < low ) { low = data[i] }
}

high -= low;

for ( var i = 0; i < pixelArraySize; i++ ) {
    data[i] -= low;
    data[i] /= high;
    data[i] *= maxHeight;
}



for( var i = 0; i < mapSize; i++ ) {
    heightMap[i] = [];
    colorMap[i] = [];
    for( var j = 0; j < mapSize; j++ ) {
        heightMap[i][j] = data[ ( i * mapSize ) + j ];
        
        var scale = 1 - ( heightMap[i][j] / maxHeight );
        colorMap[i][j] = new THREE.Color().copy( highcolor ).lerp( lowcolor, scale );
        
        // // Sidewalks
        // if ( ( i % 16 == 1) || ( i % 16 == 14) ) {
        //     colorMap[i][j] = new THREE.Color("rgb(255,255,255)"); //rgb(128,128,128)");
        // }
        // if ( ( j % 16 == 1) || ( j % 16 == 14) ) {
        //     colorMap[i][j] = new THREE.Color("rgb(255,255,255)"); //rgb(128,128,128)");
        // }
        
        // Roads
        // if ( ( i % 16 == 0) || ( i % 16 == 15) ) { 
        //     colorMap[i][j] = new THREE.Color("rgb(64,64,64)");
        // }
        // if ( ( j % 16 == 0) || ( j % 16 == 15) ) { 
        //     colorMap[i][j] = new THREE.Color("rgb(64,64,64)");
        // }
        
        // Edge color
        // if ( ( i == 1) || ( j == 1) || ( i == mapSize-2) || ( j == mapSize-2) ) { 
        //     colorMap[i][j] = new THREE.Color("rgb(255,255,255)");
        //     heightMap[i][j] += 0.001;
        // }
        
        // Edges
        if ( ( i == 0) || ( j == 0) || ( i == mapSize-1) || ( j == mapSize-1) ) { 
            // colorMap[i][j] = new THREE.Color(theConfig.world.clearColor);//"rgb(130, 174, 243)");
            // heightMap[i][j] += 5;
        } else {
            // if ( THREE.Math.randFloat( 0, 1 ) < 0.005 ) {
            //     colorMap[i][j] = new THREE.Color("rgb(50, 70, 27)");
            //     heightMap[i][j] += 1;
            // }
        }
        
    }
}

for( i = 0; i < mapSize; i++ ) {
    for( j = 0; j < mapSize; j++ ) {
        
        var sideColors = [ edgecolor, edgecolor, edgecolor, edgecolor ];
        var sideHeights = [];
        
        if ( i < (mapSize-1) ) { // N
            sideColors[0] = colorMap[i+1][j];
            sideHeights[0] = heightMap[i][j] - heightMap[i+1][j];
            if ( sideHeights[0] < 0 ) { sideHeights[0] = 0; }
        } else {
            sideHeights[0] = heightMap[i][j];
        }
        
        if ( j > 0 ) { // W
            sideColors[1] = colorMap[i][j-1];
            sideHeights[1] = heightMap[i][j] - heightMap[i][j-1];
            if ( sideHeights[1] < 0 ) { sideHeights[1] = 0; }
        } else {
            sideHeights[1] = heightMap[i][j];
        }
        
        if ( i > 0 ) { // S
            sideColors[2] = colorMap[i-1][j];
            sideHeights[2] = heightMap[i][j] - heightMap[i-1][j];
            if ( sideHeights[2] < 0 ) { sideHeights[2] = 0; }
        } else {
            sideHeights[2] = heightMap[i][j];
        }
        
        if ( j < (mapSize-1) ) { // E
            sideColors[3] = colorMap[i][j+1];
            sideHeights[3] = heightMap[i][j] - heightMap[i][j+1];
            if ( sideHeights[3] < 0 ) { sideHeights[3] = 0; }
        } else {
            sideHeights[3] = heightMap[i][j];
        }
        
        var sqgeo = new THREE.Geometry();
        
        sqgeo.vertices.push(
            new THREE.Vector3( -0.5, 0.5, 0 ),  // top NW 0
            new THREE.Vector3( -0.5, -0.5, 0 ), // top SW 1
            new THREE.Vector3( 0.5, -0.5, 0 ),  // top SE 2
            new THREE.Vector3( 0.5, 0.5, 0 ),   // top NE 3
            
            // North side
            new THREE.Vector3( 0.5, 0.5, -sideHeights[0] ),   // bottom NE 5
            new THREE.Vector3( -0.5, 0.5, -sideHeights[0] ),  // bottom NW 4
            
            // West side
            new THREE.Vector3( -0.5, 0.5, -sideHeights[1] ),  // bottom NW 6
            new THREE.Vector3( -0.5, -0.5, -sideHeights[1] ), // bottom SW 7
            
            // South Side
            new THREE.Vector3( -0.5, -0.5, -sideHeights[2] ), // bottom SW 8
            new THREE.Vector3( 0.5, -0.5, -sideHeights[2] ),  // bottom SE 9
            
            // East Side
            new THREE.Vector3( 0.5, -0.5, -sideHeights[3] ),   // bottom SE 10
            new THREE.Vector3( 0.5, 0.5, -sideHeights[3] )  // bottom NE 11
            
        );
        
        sqgeo.faces.push(
            new THREE.Face3( 0, 1, 2 ), // top 0
            new THREE.Face3( 0, 2, 3 ), // top 1
            
            new THREE.Face3( 3, 4, 5 ), // north 2
            new THREE.Face3( 0, 3, 5 ), // north 3
            
            new THREE.Face3( 0, 6, 7 ), // west 4
            new THREE.Face3( 1, 0, 7 ), // west 5
            
            new THREE.Face3( 1, 8, 9 ), // south 6
            new THREE.Face3( 2, 1, 9 ), // south 7
            
            new THREE.Face3( 2, 10, 11 ), // east 8
            new THREE.Face3( 3, 2, 11 ) // east 9
            
        );
        
        sqgeo.faces[0].vertexColors[0] = colorMap[i][j]; // Top
        sqgeo.faces[0].vertexColors[1] = colorMap[i][j];
        sqgeo.faces[0].vertexColors[2] = colorMap[i][j];
        
        sqgeo.faces[1].vertexColors[0] = colorMap[i][j];
        sqgeo.faces[1].vertexColors[1] = colorMap[i][j];
        sqgeo.faces[1].vertexColors[2] = colorMap[i][j];
        
        sqgeo.faces[2].vertexColors[0] = colorMap[i][j]; // North
        sqgeo.faces[2].vertexColors[1] = sideColors[0];
        sqgeo.faces[2].vertexColors[2] = sideColors[0];
        
        sqgeo.faces[3].vertexColors[0] = colorMap[i][j];
        sqgeo.faces[3].vertexColors[1] = colorMap[i][j];
        sqgeo.faces[3].vertexColors[2] = sideColors[0];
        
        sqgeo.faces[4].vertexColors[0] = colorMap[i][j]; // West
        sqgeo.faces[4].vertexColors[1] = sideColors[1];
        sqgeo.faces[4].vertexColors[2] = sideColors[1];
        
        sqgeo.faces[5].vertexColors[0] = colorMap[i][j];
        sqgeo.faces[5].vertexColors[1] = colorMap[i][j];
        sqgeo.faces[5].vertexColors[2] = sideColors[1];
        
        sqgeo.faces[6].vertexColors[0] = colorMap[i][j]; // South
        sqgeo.faces[6].vertexColors[1] = sideColors[2];
        sqgeo.faces[6].vertexColors[2] = sideColors[2];
        
        sqgeo.faces[7].vertexColors[0] = colorMap[i][j];
        sqgeo.faces[7].vertexColors[1] = colorMap[i][j];
        sqgeo.faces[7].vertexColors[2] = sideColors[2];
        
        sqgeo.faces[8].vertexColors[0] = colorMap[i][j]; // East
        sqgeo.faces[8].vertexColors[1] = sideColors[3];
        sqgeo.faces[8].vertexColors[2] = sideColors[3];
        
        sqgeo.faces[9].vertexColors[0] = colorMap[i][j];
        sqgeo.faces[9].vertexColors[1] = colorMap[i][j];
        sqgeo.faces[9].vertexColors[2] = sideColors[3];
        
        var block = new THREE.Mesh(
            sqgeo,

            new THREE.MeshBasicMaterial( {
                color: 0xFFFFFF,
                wireframe: false,
                shading: THREE.FlatShading,
                vertexColors: THREE.VertexColors
            } )
        );
        
        block.position.set( j - halfMap, i - halfMap, heightMap[i][j] );
        // theScene.add( block );
        
        // Code for combining world geometry for performance
        block.matrixAutoUpdate = false;
        block.updateMatrix();
        theWorldGeometry.merge( block.geometry, block.matrix, 1 );
        
    }
}

var theWorld = new THREE.Mesh(
    theWorldGeometry,
    new THREE.MeshBasicMaterial( {
        color: 0xFFFFFF,
        wireframe: false,
        shading: THREE.FlatShading,
        vertexColors: THREE.VertexColors
    } )
);
theScene.add( theWorld );

// var axisHelper = new THREE.AxisHelper( 50 );
// axisHelper.position.set( 0, 0, 3 );
// theScene.add( axisHelper );

var pointInWorld = function( event ) {
    var raycaster = new THREE.Raycaster();
    var normMouse = new THREE.Vector2();
    normMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	normMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;	
	
	raycaster.setFromCamera( normMouse, theCamera.camera );

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObject( theWorld );

    if ( intersects.length > 0 ) {
        console.log( "intersection");
        axisHelper.position.copy( intersects[0].point );
    } else {
        
        console.log( "nope");
    }
	
};

var theAnimationRequest;
theTimer.start();
function render() {
  theAnimationRequest = requestAnimationFrame( render );

  theTimeDelta = theTimer.getDelta();

  theTimeDeltaAverage = theTimeDeltaAverage * 0.95 + theTimeDelta * 0.05;
  theFrameRate = ( 1 / theTimeDeltaAverage ).toFixed(0);
  theFrameCount++;
  
  theControls.update();
  
  theCamera.update();
  
//   theWorld.rotation.z += 0.005;
//   if ( theWorld.rotation.z > ( Math.PI * 2 ) ) { theWorld.rotation.z = 0 };
  
  theViewport.renderer.render( theScene, theCamera.camera );

}

render();