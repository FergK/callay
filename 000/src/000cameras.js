/* global THREE theConfig theScene theViewport ORIGIN*/

// =============================================================================
// FIRST PERSON CAMERA =========================================================
// =============================================================================

function FirstPersonCamera ( target, eyeOffset ) {

    this.target = target;
    this.eyeOffset = eyeOffset;

    this.FOV = theConfig.gameplay.FOV;

    this.camera = new THREE.PerspectiveCamera(
        this.FOV, // Field of view
        theViewport.width / theViewport.height, // Aspect ratio
        0.01, // Near
        500 // Far
    );

    this.camera.rotation.order = 'ZYX';

    theScene.add( this.camera );

}
FirstPersonCamera.prototype.constructor = FirstPersonCamera;

// setFOV ======================================================================
// Sets the FOV of the camera to an given value
FirstPersonCamera.prototype.setFOV = function ( FOV ) {

    this.FOV = FOV;
    this.camera.fov = FOV;
    this.camera.aspect = theViewport.width / theViewport.height;
    this.camera.updateProjectionMatrix();

};

// update ======================================================================
// Called every frame
FirstPersonCamera.prototype.update = function() {

    this.camera.position.x = this.target.mesh.position.x;
    this.camera.position.y = this.target.mesh.position.y;
    this.camera.position.z = this.target.mesh.position.z + this.eyeOffset;

    this.camera.rotation.z = this.target.rotation.z;
    this.camera.rotation.x = this.target.rotation.x + (0.5 * Math.PI);

};

FirstPersonCamera.prototype.resize = function () {};



// =============================================================================
// FREE CAMERA =================================================================
// =============================================================================

function FreeCamera() {

    this.FOV = theConfig.gameplay.FOV;

    this.camera = new THREE.PerspectiveCamera(
        this.FOV, // Field of view
        theViewport.width / theViewport.height, // Aspect ratio
        0.01, // Near
        500 // Far
    );

    this.camera.rotation.order = 'ZYX';

    theScene.add(this.camera);

}
FreeCamera.prototype.constructor = FreeCamera;

FreeCamera.prototype.update = function () {};
FreeCamera.prototype.resize = function () {};

// mouseLook ===================================================================
// Accepts mouse movement event and changes it into rotation
FreeCamera.prototype.mouseLook = function ( event ) {

    var rotationVector = new THREE.Vector3(
        // Y movement in screenspace is X rotation in worldspace
        event.movementY * -0.0025 * theConfig.mouse.lookSensitivity,

        0, // We don't want to use the Y worldspace rotation, it does weird stuff

        // X movement in screenspace is Z rotation in worldspace
        event.movementX * -0.0025 * theConfig.mouse.lookSensitivity
    );

    this.camera.rotation.setFromVector3( this.camera.rotation.toVector3().add( rotationVector ), 'ZYX' );

    // Clamp up/down rotation so you can't go around backwards
    var min = 0;
    var max = Math.PI;
    if (this.camera.rotation.x < min) {
        this.camera.rotation.x = min;
    }
    if (this.camera.rotation.x > max) {
        this.camera.rotation.x = max;
    }

};


// setFOV ======================================================================
// Sets the FOV of the camera to an given value
FreeCamera.prototype.setFOV = function( FOV ) {

    this.FOV = FOV;
    this.camera.fov = FOV;
    this.camera.aspect = theViewport.width / theViewport.height;
    this.camera.updateProjectionMatrix();

};



// =============================================================================
// ISOMETRIC CAMERA ============================================================
// =============================================================================

function IsoCamera() {
    
    this.orthographicScale = 50;

    this.camera = new THREE.OrthographicCamera(
        -theViewport.width * ( 0.5 / this.orthographicScale ),  // Left
        theViewport.width * ( 0.5 / this.orthographicScale ),   // Right
        theViewport.height * ( 0.5 / this.orthographicScale ),  // Top
        -theViewport.height * ( 0.5 / this.orthographicScale ), // Bottom
        -1000, // Near
        1000   // Far
    );
    
    this.camera.position.set( 0, 0, 0 );
    this.camera.rotation.z = -Math.PI / 4;
    this.camera.rotation.x = Math.atan( 1 / Math.sqrt( 2 ) );

    this.camera.rotation.order = 'ZYX';

    theScene.add(this.camera);

}
IsoCamera.prototype.constructor = FreeCamera;

IsoCamera.prototype.update = function () {};

IsoCamera.prototype.resize = function ( width, height ) {
    
    this.camera.left = -width * ( 0.5 / this.orthographicScale );
    this.camera.right = width * ( 0.5 / this.orthographicScale );
    this.camera.top = height * ( 0.5 / this.orthographicScale );
    this.camera.bottom = -height * ( 0.5 / this.orthographicScale );
    this.camera.updateProjectionMatrix();
    
};