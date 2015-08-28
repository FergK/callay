/* global THREE Z_AXIS_NEG theScene */

function Player () {

    this.size = new THREE.Vector3( 0.9, 0.9, 1.8 );
    this.position = new THREE.Vector3( 2, 1, 10 );
    this.rotation = new THREE.Euler( 0, 0, 0, 'ZYX' );
    this.quaternion = new THREE.Quaternion().setFromEuler( this.rotation );
    
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
    
    this.spinner = 0;
    
    this.ints = [];

}
Player.prototype.constructor = Player; 

Player.prototype.update = function () {
    
    
    // this.spinner += 0.5 * theTimeDelta;
    // this.position.x = Math.cos( this.spinner ) * 20;
    // this.position.y = Math.sin( this.spinner ) * 20;
    
    var rayOrigin = new THREE.Vector3( 0, 0, 10 ).add( this.position );
    
    this.raycaster.set( rayOrigin, Z_AXIS_NEG );
    this.intersects = this.raycaster.intersectObjects( theScene.children );
    
    // console.log( this.mesh.id );
    
    // for( var i = 0; i < this.intersects.length; i++ ) {
    //     if ( this.intersects[i].object.id === this.mesh.id ) {
    //         continue;
    //     } else {
    //         console.log( this.intersects[i].object.id );
    //         // this.position.z = this.intersects[0].point.z + ( this.size.z / 2 );
    //         break;
    //     }
    // }
    
    
    if ( this.intersects.length > 0 ) {
        this.position.z = this.intersects[0].point.z + ( this.size.z / 2 );
    }
    
    // this.mesh.position.copy( this.position );
    // this.mesh.rotation.set( 0, 0, this.rotation.z );
    this.quaternion.setFromEuler( this.rotation );
    
};

// Move ========================================================================
Player.prototype.move = function( moveVector ) {
    
    // moveVector.applyQuaternion( ROT_ZY );
    // moveVector.applyQuaternion( this.quaternion );
    
    // moveVector.multiplyScalar( this.moveSpeed * theTimeDelta );
    
    // this.position.add( moveVector );
    
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