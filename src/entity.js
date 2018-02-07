/* global THREE Z_AXIS_NEG EPSILON theScene */
// =============================================================================
// ENTITY ======================================================================
// =============================================================================

function Entity( position ) {

  THREE.Object3D.call( this );

	this.type = 'Entity';
    
    var start = ( position !== undefined ) ? position : new THREE.Vector3( 0, 0, 0 );
    this.position.copy( start );
  
}
Entity.prototype = Object.create( THREE.Object3D.prototype );
Entity.prototype.constructor = Entity;






function Pip( position ) {

    Entity.call( this, position );

	var mesh = new THREE.Mesh( 
	    
        new THREE.BoxGeometry( 0.75, 0.75, 0.75 ),
        new THREE.MeshPhongMaterial( { 
            shading: THREE.FlatShading,
            color: 0xFFFFFF,
            specular: 0xAAAAAA,
            shininess: 60
        } )
	    
	);
	
	this.randomizeVerts( mesh );
	
	this.add( mesh );
	
	theScene.add( this );
  
}
Pip.prototype = Object.create( Entity.prototype );
Pip.prototype.constructor = Pip;

Pip.prototype.update = function () {

    this.rotation.set( this.rotation.x + 0.015, this.rotation.y + 0.02, this.rotation.z + 0.025, 'XYZ' );
    if ( this.rotation.x > ( Math.PI * 2 ) ) { this.rotation.x -= ( Math.PI * 2 ) }
    if ( this.rotation.y > ( Math.PI * 2 ) ) { this.rotation.y -= ( Math.PI * 2 ) }
    if ( this.rotation.z > ( Math.PI * 2 ) ) { this.rotation.z -= ( Math.PI * 2 ) }
    
    var scaling = ( ( Math.sin( this.rotation.z ) + 1 ) * 0.25 ) + 0.75;
    this.scale.set( scaling, scaling, scaling );
    
};

Pip.prototype.randomizeVerts = function( mesh ) {
  mesh.material.vertexColors = THREE.VertexColors;
  mesh.geometry.colorsNeedUpdate = true;
  
  for( var i = 0; i < mesh.geometry.vertices.length ; i++ ) {
    mesh.geometry.colors[i] = new THREE.Color( THREE.Math.random16(), THREE.Math.random16(), THREE.Math.random16() );
  }
  
  var faceIndices = [ 'a', 'b', 'c', 'd' ];
  
  for ( i = 0; i < mesh.geometry.faces.length; i++ ) {
    var face = mesh.geometry.faces[ i ];
    var numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
    for( var j = 0; j < numberOfSides; j++ ) {
      var vertexIndex = face[ faceIndices[ j ] ];
      face.vertexColors[ j ] = mesh.geometry.colors[ vertexIndex ];
    }
  }
  
};