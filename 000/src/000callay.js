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

var theTimer = new THREE.Clock( false );
var theTimeDelta, theFrameRate;
var theTimeDeltaAverage = 0;
var theDate = new Date();
var theFrameCount = 0;

var theConfig = new Config();
var theScene = new THREE.Scene();
var theViewport = new Viewport( "viewport", theConfig.video.enableAntiAliasing, 0x000000 );
var theCamera = new IsoCamera();
// var theCamera = new FreeCamera();
// theCamera.camera.position.set( -10, -10, 2);
// theCamera.camera.rotation.z = -Math.PI / 4;
// theCamera.camera.rotation.x = Math.PI / 2;

var theWorldGeometry = new THREE.Geometry();

var heightMap = [];
var colorMap = [];
var mapSize = 15;
var halfMap = mapSize * 0.5;
var maxHeight = 3;

// var highcolor = new THREE.Color("rgb(255,128,128)");
// var lowcolor = new THREE.Color("rgb(0,128,255)");
// var edgecolor = new THREE.Color("rgb(253, 250, 201)");

// var highcolor = new THREE.Color("rgb(85,133,37)");
// var lowcolor = new THREE.Color("rgb(75, 58, 32)");
// var edgecolor = new THREE.Color("rgb(75, 58, 32)");

var highcolor = new THREE.Color("rgb(255,255,255)");
var lowcolor = new THREE.Color("rgb(50,50,50)");
lowcolor.r += THREE.Math.randFloat( 0, 0.1 );
lowcolor.g += THREE.Math.randFloat( 0, 0.1 );
lowcolor.b += THREE.Math.randFloat( 0, 0.1 );
var edgecolor = lowcolor;


for( var i = 0; i < mapSize; i++ ) {
    heightMap[i] = [];
    colorMap[i] = [];
    for( var j = 0; j < mapSize; j++ ) {
        heightMap[i][j] = THREE.Math.randFloat( 0, maxHeight );
        
        var scale = 1 - ( heightMap[i][j] / maxHeight );
        colorMap[i][j] = new THREE.Color().copy( highcolor ).lerp( lowcolor, scale );
        
        // colorMap[i][j].b = THREE.Math.random16();
        // colorMap[i][j] = new THREE.Color( THREE.Math.random16(), THREE.Math.random16(), THREE.Math.random16() );
        // if ( ( i % 4 == 0) && ( j % 4 == 0) ) { colorMap[i][j] = new THREE.Color("rgb(128,128,128)"); }
        
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

var theAnimationRequest;
function render() {
  theAnimationRequest = requestAnimationFrame( render );

  theTimeDelta = theTimer.getDelta();

  theTimeDeltaAverage = theTimeDeltaAverage * 0.95 + theTimeDelta * 0.05;
  theFrameRate = ( 1 / theTimeDeltaAverage ).toFixed(0);
  theFrameCount++;
  
  theCamera.update();
  
  theWorld.rotation.z += 0.005;
  if ( theWorld.rotation.z > ( Math.PI * 2 ) ) { theWorld.rotation.z = 0 };
  
  theViewport.renderer.render( theScene, theCamera.camera );

}

render();