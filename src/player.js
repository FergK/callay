/* global THREE Z_AXIS_NEG Z_AXIS EPSILON theScene theTimeDelta theConfig */

function Player () {

    THREE.Object3D.call( this );

	this.type = 'Player';

    this.size = new THREE.Vector3( 0.9, 0.9, 1.8 );
    this.position.set( 2, 1, 100 );
    this.rotation.set( 0, 0, 0, 'ZYX' );
    
    // this.mesh = new THREE.Mesh(
    //     new THREE.SphereGeometry( 0.5, 32, 32 ),
    //     new THREE.MeshBasicMaterial( { color: 0x166eb6, wireframe: false, wrapAround: true } )
    // );
    // this.mesh.scale.set( this.size.x, this.size.y, this.size.z );
    // this.mesh.position.set( this.position.x, this.position.y, this.position.z );
    // this.mesh.rotation.set( this.rotation.x, this.rotation.y, this.rotation.z );
    
    // theScene.add( this.mesh );
    
    this.eyeOffset = this.size.z * 0.425; // distance above position
    
    this.moveSpeed = 15;
    
    this.raycaster = new THREE.Raycaster();
    this.intersects = {};

}

Player.prototype = Object.create( THREE.Object3D.prototype );
Player.prototype.constructor = Player; 

Player.prototype.update = function () {

    var rayOrigin = new THREE.Vector3( 0, 0, ( this.size.z / 2 ) + EPSILON ).add( this.position );
    
    this.raycaster.set( rayOrigin, Z_AXIS_NEG );
    this.intersects = this.raycaster.intersectObjects( theScene.children );
    
    if ( this.intersects.length > 0 ) {
        this.position.z = this.intersects[0].point.z + ( this.size.z / 2 );
    }
    
};

// Move ========================================================================
Player.prototype.move = function( moveVector ) {
    
    moveVector.applyAxisAngle( Z_AXIS, this.rotation.z );
    moveVector.multiplyScalar( this.moveSpeed * theTimeDelta );
    
    this.position.add( moveVector );

};

// mouseLook ===================================================================
// Accepts mouse movement event and changes it into rotation
Player.prototype.mouseLook = function ( event ) {

    var rotationVector = new THREE.Vector3(
        // Y movement in screenspace is X rotation in worldspace
        event.movementY * -0.05 * theTimeDelta * theConfig.mouse.lookSensitivity,

        0, // We don't want to use the Y worldspace rotation, it does weird stuff

        // X movement in screenspace is Z rotation in worldspace
        event.movementX * -0.05 * theTimeDelta * theConfig.mouse.lookSensitivity
    );

    // TODO use quaternions or eulers directly here
    this.rotation.setFromVector3( this.rotation.toVector3().add( rotationVector ), 'ZYX' );

    // Clamp up/down rotation so you can't go around backwards
    var min = -Math.PI / 2;
    var max = Math.PI / 2;
    if ( this.rotation.x < min ) {
        this.rotation.x = min;
    }
    if ( this.rotation.x > max ) {
        this.rotation.x = max;
    }

};