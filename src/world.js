/* global THREE ImprovedNoise theConfig */

// =============================================================================
// WORLD =======================================================================
// =============================================================================
// A class containing all the interacting elements of the game scene

function World() {
    
    // Some vocab
    // Cell - A 1x1 piece of geometry correspond to a value in the heightmap
    // Chunk - A square collection of cells
    
    this.seed = 0; // Math.random() * 100;
    
    this.chunkSize = 16;
    this.maxHeight = 32;
    this.minOctive = 1;
    this.maxOctive = 7;
    
    this.maxScale = 0;
    for ( var octive = this.minOctive; octive <= this.maxOctive; octive++ ) {
        var scaling = Math.pow( 2, octive );
        this.maxScale += scaling;
    }
    
    // Since the world can use negative x/y values and the noise function can't
    // we need to offset the origin for noise generation.
    // These are just temporary values
    this.noiseOffset = {};
    this.noiseOffset.x = 65536; 
    this.noiseOffset.y = 65536;
    
    this.smoothTerrain = true;
    
    this.color = {};
    this.color.midpoint = 0.3;
    
    // this.color.high = new THREE.Color("rgb(255, 255, 255)"); // Dream clouds
    // this.color.mid = new THREE.Color("rgb(255,128,128)"); 
    // this.color.low = new THREE.Color("rgb(0,128,255)");//rgb(130, 174, 243)");
    
    this.color.high = new THREE.Color("rgb(154, 181, 74)"); // Grass
    this.color.low = new THREE.Color("rgb(69, 92, 0)");
    this.color.mid = new THREE.Color().copy( this.color.high ).lerp( this.color.low, 0.2 );
    
    // this.color.high = new THREE.Color("rgb(255, 0, 0)"); // RGB
    // this.color.mid = new THREE.Color("rgb(0, 255, 0)");
    // this.color.low = new THREE.Color("rgb(0, 0, 255)");
    // this.color.midpoint = 0.3;
    
    // this.color.high = new THREE.Color("rgb(255,255,255)"); // Tinted greyscale
    // this.color.low = new THREE.Color("rgb(50,50,50)");
    // this.color.low.r += THREE.Math.randFloat( 0, 0.1 );
    // this.color.low.g += THREE.Math.randFloat( 0, 0.1 );
    // this.color.low.b += THREE.Math.randFloat( 0, 0.1 );
    // this.color.mid = new THREE.Color().copy( this.color.high ).lerp( this.color.low, 0.5 );
    
    this.noise = new ImprovedNoise();
    
    this.chunks = [];
    
    // var directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 0.5 );
    // directionalLight.position.set( 1, 0, 0 ).normalize();
    // theScene.add( directionalLight );
    
    // theScene.fog = new THREE.Fog( 0x000000, 75, 125 );
    
    var ambientLight = new THREE.AmbientLight( 0xFFFFFF );
	theScene.add( ambientLight );
    
}
World.prototype.constructor = World;


// buildChunk ==================================================================
World.prototype.buildChunk = function ( chunkX, chunkY ) {
    
    // var startTime = theTimer.getElapsedTime();
    // console.log("Building chunk " + chunkX + " " + chunkY );
    
    // Initialize heightMap and populate with properly sized empty arrays
    var heightMap = [];
    for( var i = -1; i <= this.chunkSize + 1; i++ ) {
        heightMap[i] = [];
        for( var j = -1; j < this.chunkSize + 1; j++ ) {
            heightMap[i][j] = 0;
        }
    }
    
    // Use the perlin noise to generate the raw noise
    for ( var octive = this.minOctive; octive <= this.maxOctive; octive+=1 ) {
        for ( i = -1; i < this.chunkSize + 1; i++ ) {
            for ( j = -1; j < this.chunkSize + 1; j++ ) {
                
                var scaling = Math.pow( 2, octive );
                var noiseX = ( i + this.noiseOffset.x + ( chunkY * this.chunkSize ) ) / scaling;
                var noiseY = ( j + this.noiseOffset.y + ( chunkX * this.chunkSize ) ) / scaling;
                heightMap[i][j] += ( Math.abs( this.noise.noise( noiseX, noiseY, this.seed ) ) * ( scaling ) );
                
            }
        }
    }
    
    // Normalize the values from 0 to maxheight
    // And while we're at it generate a colormap based on the heightmap
    var colorMap = [];
    for( i = -1; i <= this.chunkSize + 1; i++ ) {
        
        colorMap[i] = [];
        
        for( j = -1; j < this.chunkSize + 1; j++ ) {
            heightMap[i][j] *= ( this.maxHeight / this.maxScale );
            
            var scale = ( heightMap[i][j] / this.maxHeight );
            if ( scale > this.color.midpoint ) {
                colorMap[i][j] = new THREE.Color().copy( this.color.mid ).lerp( this.color.high, ( scale - this.color.midpoint ) * ( 1 / this.color.midpoint ) );
            } else {
                colorMap[i][j] = new THREE.Color().copy( this.color.low ).lerp( this.color.mid, scale * ( 1 / this.color.midpoint ) );
            }
            
        }
    }
    
    var newChunk = {};
    
    // newChunk.heightMap = heightMap;
    // newChunk.colorMap = colorMap;
    
    if ( this.smoothTerrain ) {
        newChunk.mesh = this.makeSmoothChunkGeometry( heightMap, colorMap, chunkX, chunkY );
    } else {
        newChunk.mesh = this.makeChunkGeometry( heightMap, colorMap, chunkX, chunkY );
    }
    
    theScene.add( newChunk.mesh );
    
    // console.log("Built chunk in " + ( theTimer.getElapsedTime() - startTime ) + "ms");
    return newChunk;
    
};

// buildChunkAndNeighbors ======================================================
World.prototype.buildChunkAndNeighbors = function( chunkX, chunkY, radius ) {
    
    for( var i = chunkX-radius; i <= chunkX+radius; i++ ) {
        
        if ( this.chunks[i] === undefined ) {
                this.chunks[i] = [];
        }
        
        for( var j = chunkY-radius; j <= chunkY+radius; j++ ) {
            if ( this.chunks[i][j] === undefined ) {
                this.chunks[i][j] = this.buildChunk( i, j );
            }
        }
        
    }
    
};

// buildChunksInView ===========================================================
// Use the cameras frustum to build all the chunks in view
World.prototype.buildChunksInView = function( camera, radius ) {
    
    var frustum = new THREE.Frustum();
    
    // From http://stackoverflow.com/questions/24877880/three-js-check-if-object-is-in-frustum
    frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse ) );
    
    var chunkX =  Math.round( camera.position.x / this.chunkSize );
    var chunkY =  Math.round( camera.position.y / this.chunkSize );

    for( var i = chunkX-radius; i <= chunkX+radius; i++ ) {
         for( var j = chunkY-radius; j <= chunkY+radius; j++ ) {

            // Convert from chunk coords to world coords
            var pos = new THREE.Vector3( i * this.chunkSize, j * this.chunkSize, 0 );
            
            if ( frustum.containsPoint( pos ) ) {
                if ( this.chunks[i] === undefined ) {
                    this.chunks[i] = [];
                }
                if ( this.chunks[i][j] === undefined ) {
                    this.chunks[i][j] = this.buildChunk( i, j );
                }
            }
        }
        
    }
    
};



World.prototype.makeSmoothChunkGeometry = function( heightMap, colorMap, chunkX, chunkY ) {
    
    var cornerMap = [];
    var cornerColors = [];
    for( var i = 0; i <= this.chunkSize; i++ ) {
        cornerMap[i] = [];
        cornerColors[i] = [];
        for( var j = 0; j <= this.chunkSize; j++ ) {
            
            cornerMap[i][j] = ( heightMap[i][j] + heightMap[i-1][j-1] ) / 2;
            cornerColors[i][j] = new THREE.Color().copy( colorMap[i][j] ).lerp( colorMap[i-1][j-1], 0.5 );

        }
    }
    
    // TODO Optimize this loop further. At the moment it does duplicate work by
    // creating overlapping vertices that are just merged later
    var chunkGeometry = new THREE.Geometry();
    for( i = 0; i < this.chunkSize; i++ ) {
        for( j = 0; j < this.chunkSize; j++ ) {
            
            var k = ( i * this.chunkSize ) + j;
            
            chunkGeometry.vertices.push(
                new THREE.Vector3( -0.5 + j,  0.5 + i, cornerMap[i+1][j] ),  // top NW 0
                new THREE.Vector3( -0.5 + j, -0.5 + i, cornerMap[i][j] ), // top SW 1
                new THREE.Vector3(  0.5 + j, -0.5 + i, cornerMap[i][j+1] ),  // top SE 2
                new THREE.Vector3(  0.5 + j,  0.5 + i, cornerMap[i+1][j+1] ) // top NE 3
            );
            
            chunkGeometry.faces.push(
                new THREE.Face3( (k*4), (k*4) + 1, (k*4) + 2 ),
                new THREE.Face3( (k*4), (k*4) + 2, (k*4) + 3 )
            );
            
            chunkGeometry.faces[(k*2)].vertexColors[0] = cornerColors[i+1][j];
            chunkGeometry.faces[(k*2)].vertexColors[1] = cornerColors[i][j];
            chunkGeometry.faces[(k*2)].vertexColors[2] = cornerColors[i][j+1];
            
            chunkGeometry.faces[(k*2)+1].vertexColors[0] = cornerColors[i+1][j];
            chunkGeometry.faces[(k*2)+1].vertexColors[1] = cornerColors[i][j+1];
            chunkGeometry.faces[(k*2)+1].vertexColors[2] = cornerColors[i+1][j+1];
            
        }
    }
    
    chunkGeometry.mergeVertices();
    chunkGeometry.computeFaceNormals();
    chunkGeometry.computeVertexNormals();
    
    var chunkMesh = new THREE.Mesh(
        chunkGeometry,
        new THREE.MeshLambertMaterial( {
            color: 0xFFFFFF,
            vertexColors: THREE.VertexColors,
            shading: THREE.FlatShading,
            wireframe: false,
            wrapAround: false,
            transparent: false,
            opacity: 0.75
        } )
    );
    
    chunkMesh.position.add( new THREE.Vector3( ( chunkX * this.chunkSize ), ( chunkY * this.chunkSize ), 0 ) );
    
    return chunkMesh;
    
};


World.prototype.makeChunkGeometry = function( heightMap, colorMap, chunkX, chunkY ) {
    
    var chunkGeometry = new THREE.Geometry();
    for( var i = 0; i < this.chunkSize; i++ ) {
        for( var j = 0; j < this.chunkSize; j++ ) {
        
        var sideColors = [];
        var sideHeights = [];
        
        sideColors[0] = colorMap[i+1][j]; //N
        sideHeights[0] = heightMap[i][j] - heightMap[i+1][j];
        
        sideColors[1] = colorMap[i][j-1]; // W
        sideHeights[1] = heightMap[i][j] - heightMap[i][j-1];
        
        sideColors[2] = colorMap[i-1][j]; // S
        sideHeights[2] = heightMap[i][j] - heightMap[i-1][j];
        
        sideColors[3] = colorMap[i][j+1]; // E
        sideHeights[3] = heightMap[i][j] - heightMap[i][j+1];
        
        for( var k = 0; k < 4; k++ ) {
            if ( sideHeights[k] < 0 ) { sideHeights[k] = 0; }
        }
        

        var unitGeometry = new THREE.Geometry();
        
        unitGeometry.vertices.push(
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
        
        unitGeometry.faces.push(
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
        
        unitGeometry.faces[0].vertexColors[0] = colorMap[i][j]; // Top
        unitGeometry.faces[0].vertexColors[1] = colorMap[i][j];
        unitGeometry.faces[0].vertexColors[2] = colorMap[i][j];
        
        unitGeometry.faces[1].vertexColors[0] = colorMap[i][j];
        unitGeometry.faces[1].vertexColors[1] = colorMap[i][j];
        unitGeometry.faces[1].vertexColors[2] = colorMap[i][j];
        
        unitGeometry.faces[2].vertexColors[0] = colorMap[i][j]; // North
        unitGeometry.faces[2].vertexColors[1] = sideColors[0];
        unitGeometry.faces[2].vertexColors[2] = sideColors[0];
        
        unitGeometry.faces[3].vertexColors[0] = colorMap[i][j];
        unitGeometry.faces[3].vertexColors[1] = colorMap[i][j];
        unitGeometry.faces[3].vertexColors[2] = sideColors[0];
        
        unitGeometry.faces[4].vertexColors[0] = colorMap[i][j]; // West
        unitGeometry.faces[4].vertexColors[1] = sideColors[1];
        unitGeometry.faces[4].vertexColors[2] = sideColors[1];
        
        unitGeometry.faces[5].vertexColors[0] = colorMap[i][j];
        unitGeometry.faces[5].vertexColors[1] = colorMap[i][j];
        unitGeometry.faces[5].vertexColors[2] = sideColors[1];
        
        unitGeometry.faces[6].vertexColors[0] = colorMap[i][j]; // South
        unitGeometry.faces[6].vertexColors[1] = sideColors[2];
        unitGeometry.faces[6].vertexColors[2] = sideColors[2];
        
        unitGeometry.faces[7].vertexColors[0] = colorMap[i][j];
        unitGeometry.faces[7].vertexColors[1] = colorMap[i][j];
        unitGeometry.faces[7].vertexColors[2] = sideColors[2];
        
        unitGeometry.faces[8].vertexColors[0] = colorMap[i][j]; // East
        unitGeometry.faces[8].vertexColors[1] = sideColors[3];
        unitGeometry.faces[8].vertexColors[2] = sideColors[3];
        
        unitGeometry.faces[9].vertexColors[0] = colorMap[i][j];
        unitGeometry.faces[9].vertexColors[1] = colorMap[i][j];
        unitGeometry.faces[9].vertexColors[2] = sideColors[3];
        
        unitGeometry.computeFaceNormals();
        
        var unitMesh = new THREE.Mesh(
            unitGeometry,

            new THREE.MeshBasicMaterial( {
                color: 0xFFFFFF,
                wireframe: true,
                shading: THREE.FlatShading,
                vertexColors: THREE.VertexColors
            } )
        );
        
        unitMesh.position.set( j - ( this.chunkSize / 2), i - ( this.chunkSize / 2), heightMap[i][j] );
        
        // Combine chunk geometry for performance
        unitMesh.matrixAutoUpdate = false;
        unitMesh.updateMatrix();
        chunkGeometry.merge( unitMesh.geometry, unitMesh.matrix, 1 );
        
        }
    }

    chunkGeometry.mergeVertices();
    chunkGeometry.computeFaceNormals();
    
    var chunkMesh = new THREE.Mesh(
        chunkGeometry,
        new THREE.MeshBasicMaterial( {
            color: 0xFFFFFF,
            wireframe: false,
            shading: THREE.FlatShading,
            vertexColors: THREE.VertexColors
        } )
    );
    
    chunkMesh.position.add( new THREE.Vector3( ( chunkX * this.chunkSize ), ( chunkY * this.chunkSize ), 0 ) );
    
    return chunkMesh;
    
};