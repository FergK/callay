/* global THREE theCamera */

// =============================================================================
// VIEWPORT ====================================================================
// =============================================================================
// Contains a Three.js renderer and element

function Viewport( id, enableAntiAliasing, clearColor ) {

  this.id = id;
  this.width, this.height;
  
  this.enableAntiAliasing = enableAntiAliasing;

  this.renderer = new THREE.WebGLRenderer( {
    antialias: this.enableAntiAliasing,
    maxLights: 10
  } );

  this.resize( window.innerWidth, window.innerHeight );
  
  this.renderer.setClearColor( clearColor, 1);

  $( "#viewport" ).append( this.renderer.domElement );
  this.renderer.domElement.id = this.id;
  
  this.setupEventHandlers();

}
Viewport.prototype.constructor = Viewport;

// resize ======================================================================
// Called when the window is resized, use the setsize function and resets
// the threejs camera's properties to match the new size
Viewport.prototype.resize = function( width, height ) {
  
  this.width = width;
  this.height = height;
  
  this.renderer.setSize( this.width, this.height );
  
  if ( theCamera !== undefined ) {
    theCamera.resize( width, height );
  }
  
};

// setupEventHandlers ==========================================================
// Get the events from the browser
Viewport.prototype.setupEventHandlers = function() {

  // By default when you use 'this' with an event, 'this' is the document, not
  // the object, so the using self is a work around so that 'this' will actually
  // refer to this object, not the document
  var self = this;

  window.addEventListener(
    'resize',
    function () { self.resize( window.innerWidth, window.innerHeight ); },
    false 
  );

};