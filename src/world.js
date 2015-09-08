/* global THREE ImprovedNoise SimplexNoise theConfig theScene*/

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
    this.maxHeight = 40;
    this.minOctive = 5;
    this.maxOctive = 8;
    
    this.maxScale = 0;
    for ( var octive = this.minOctive; octive <= this.maxOctive; octive++ ) {
        var scaling = Math.pow( 2, octive );
        this.maxScale += scaling;
    }
    
    // Since the world can use negative x/y values and the noise function can't
    // we need to offset the origin for noise generation.
    // These are just temporary values
    this.noiseOffset = {};
    this.noiseOffset.x = 0;//524288; 
    this.noiseOffset.y = 0;//524288;
    
    this.smoothTerrain = true;
    
    this.color = {};
    this.color.midpoint = 0.4;
    
    this.color.high = new THREE.Color("rgb(255, 255, 255)"); // Dream clouds
    this.color.mid = new THREE.Color("rgb(255,128,128)"); 
    this.color.low = new THREE.Color("rgb(0,128,255)");//rgb(130, 174, 243)");
    this.color.midpoint = 0.6;
    
    // this.color.high = new THREE.Color("rgb(154, 181, 74)"); // Grass
    // this.color.low = new THREE.Color("rgb(69, 92, 0)");
    // this.color.mid = new THREE.Color().copy( this.color.high ).lerp( this.color.low, 0.2 );
    
    // this.color.high = new THREE.Color("rgb(255, 0, 0)"); // RGB
    // this.color.mid = new THREE.Color("rgb(0, 255, 0)");
    // this.color.low = new THREE.Color("rgb(0, 0, 255)");
    // this.color.midpoint = 0.3;
    
    // this.color.high = new THREE.Color("rgb(255,255,255)"); // Tinted greyscale
    // this.color.low = new THREE.Color("rgb(255,255,255)");
    // // this.color.low.r += THREE.Math.randFloat( 0, 0.1 );
    // // this.color.low.g += THREE.Math.randFloat( 0, 0.1 );
    // // this.color.low.b += THREE.Math.randFloat( 0, 0.1 );
    // this.color.mid = new THREE.Color().copy( this.color.high ).lerp( this.color.low, 0.5 );
    
    this.simplex = new SimplexNoise();
    
    this.chunks = [];
    this.buildList = [];
    
    this.entities = {};
    
    var directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 0.75 );
    directionalLight.position.set( 1, 1, 1 );
    theScene.add( directionalLight );
    
    // var directionalLight = new THREE.DirectionalLight( 0x0000FF, 1 );
    // directionalLight.position.set( -1, -1, 0 );
    // theScene.add( directionalLight );
    
    theScene.fog = new THREE.Fog( 0x000000, 200, 250 );
    
    // var ambientLight = new THREE.AmbientLight( 0xFFFFFF );
    var ambientLight = new THREE.AmbientLight( 0x444444 );
	theScene.add( ambientLight );
    
}
World.prototype.constructor = World;


// buildChunk ==================================================================
World.prototype.buildChunk = function ( chunkX, chunkY ) {
    
    // console.log("Building chunk " + chunkX + " " + chunkY );
    var start = -1;
    var end = this.chunkSize + 2;
    
    // Initialize heightMap and populate with properly sized empty arrays
    var heightMap = [];
    for( var x = start; x <= end; x++ ) {
        heightMap[x] = [];
        for( var y = start; y < end; y++ ) {
            heightMap[x][y] = 0;
        }
    }
    
    // Use the perlin noise to generate the raw noise
    var scaling, noiseX, noiseY;
    for ( var octive = this.minOctive; octive <= this.maxOctive; octive+=1 ) {
        for ( x = start; x < end; x++ ) {
            for ( y = start; y < end; y++ ) {
                
                scaling = Math.pow( 2, octive );
                noiseX = ( x + this.noiseOffset.x + ( chunkX * this.chunkSize ) ) / scaling;
                noiseY = ( y + this.noiseOffset.y + ( chunkY * this.chunkSize ) ) / scaling;
                // heightMap[i][j] += ( Math.abs( this.perlin.noise( noiseX, noiseY, this.seed ) ) * ( scaling ) );
                heightMap[x][y] += ( ( this.simplex.noise2D( noiseX, noiseY ) + 1 ) * scaling / 2 );
                
            }
        }
    }
    
    // Normalize the values from 0 to maxheight
    // And while we're at it generate a colormap based on the heightmap
    var colorMap = [];
    for( x = start; x <= end; x++ ) {
        
        colorMap[x] = [];
        
        for( y = start; y < end; y++ ) {
            heightMap[x][y] *= ( this.maxHeight / this.maxScale );
            
            var scale = ( heightMap[x][y] / this.maxHeight );
            if ( scale > this.color.midpoint ) {
                colorMap[x][y] = new THREE.Color().copy( this.color.mid ).lerp( this.color.high, ( scale - this.color.midpoint ) * ( 1 / this.color.midpoint ) );
            } else {
                colorMap[x][y] = new THREE.Color().copy( this.color.low ).lerp( this.color.mid, scale * ( 1 / this.color.midpoint ) );
            }
            
        }
    }
    
    var newChunk = {};
    
    if ( this.smoothTerrain ) {
        newChunk.mesh = this.makeSmoothChunkGeometry( heightMap, colorMap, chunkX, chunkY );
    } else {
        newChunk.mesh = this.makeChunkGeometry( heightMap, colorMap, chunkX, chunkY );
    }
    
    theScene.add( newChunk.mesh );

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

    var pos = new THREE.Vector3();
    // var sphere = new THREE.Sphere();
    // var sphereRadius = 16;
    
    for( var i = chunkX-radius; i <= chunkX+radius; i++ ) {
         for( var j = chunkY-radius; j <= chunkY+radius; j++ ) {

            // Convert from chunk coords to world coords
            pos.set( i * this.chunkSize, j * this.chunkSize, 0 );
            // sphere.set( pos, sphereRadius );
            
            if ( frustum.containsPoint( pos ) ) {
            // if ( frustum.intersectsSphere( sphere ) ) {
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

// manageChunks ================================================================
// Adds and removes chunks from the scene as necessary
World.prototype.manageChunks = function( camera, sceneRadius, neighborRadius, viewRadius ) {
    
    var centerChunkX = Math.round( camera.position.x / this.chunkSize );
    var centerChunkY = Math.round( camera.position.y / this.chunkSize );
    // console.log( "centerChunkX: " + centerChunkX );
    
    // Loop around clockwise
    // for( var loop = 1; loop <= neighborRadius; loop++ ) {
    //     // console.log( "loop: " + loop );
    //     var dX = 1;
    //     var dY = 0;
    //     var x = centerChunkX + -loop + 1;
    //     var y = centerChunkY + loop;
    //     var side = loop * 2;
    //     var turns = 0;
    //     for( var chunk = 1; chunk <= ( loop * 8 ); chunk++ ) {
    //         // console.log( "chunk: " + chunk );
    //         // console.log( "x: " + x );
    //         // this.buildList.push( { x:x, y:y } );
            
    //         if ( this.chunks[x] === undefined ) {
    //             this.chunks[x] = [];
    //         }
    //         if ( this.chunks[x][y] === undefined ) {
    //             this.chunks[x][y] = this.buildChunk( x, y );
    //         }
            
    //         if ( chunk % side === 0 ) {
    //             turns++;
                
    //             if ( turns === 1 ) {
    //                 dX = 0;
    //                 dY = -1;
    //             } else if ( turns === 2 ) {
    //                 dX = -1;
    //                 dY = 0;
    //             } else if ( turns === 3 ) {
    //                 dX = 0;
    //                 dY = 1;
    //             }
    //         }
    //         x += dX;
    //         y += dY;
    //     }
    // }
    
    // var chunksBuilt = 0;
    
    // // while ( true ) {
    // while ( chunksBuilt < 1 ) {
        
    //     if ( this.buildList.length > 0 ) {
            
    //         var nextChunk = this.buildList.shift();
            
    //         if ( this.chunks[nextChunk.x] === undefined ) {
    //             this.chunks[nextChunk.x] = [];
    //         }
            
    //         if ( this.chunks[nextChunk.x][nextChunk.y] === undefined ) {
    //             // console.log( this.chunks[nextChunk.x][nextChunk.y] );
    //             this.chunks[nextChunk.x][nextChunk.y] = this.buildChunk( nextChunk.x, nextChunk.y );
    //             // console.log( this.chunks[nextChunk.x][nextChunk.y] );
    //         }
            
    //         chunksBuilt++;
    //     } else {
    //         break;
    //     }
    // }
    
    this.buildChunkAndNeighbors( centerChunkX, centerChunkY, neighborRadius );
    this.buildChunksInView( camera, viewRadius );
    
};


World.prototype.makeSmoothChunkGeometry = function( heightMap, colorMap, chunkX, chunkY ) {
    
    var chunkGeometry = new THREE.Geometry();
    var face = 0;
    var vert = 0;
    var vertexNormals = [];
    for( var i = 0; i <= this.chunkSize; i++ ) {
        for( var j = 0; j <= this.chunkSize; j++ ) {

            chunkGeometry.vertices.push(
                new THREE.Vector3( i, j, heightMap[i][j] )
            );
            vertexNormals.push( new THREE.Vector3() );

            if ( ( i > 0 ) && ( j > 0 ) ) {
                
                chunkGeometry.faces.push(
                    new THREE.Face3( vert, vert - this.chunkSize - 2, vert - 1 ),
                    new THREE.Face3( vert, vert - this.chunkSize - 1, vert - this.chunkSize - 2 )
                );
                
                // Add the vertex colors
                chunkGeometry.faces[face].vertexColors = [
                    colorMap[i][j], 
                    colorMap[i-1][j-1],
                    colorMap[i][j-1]
                ];
                
                chunkGeometry.faces[face+1].vertexColors = [
                    colorMap[i][j],
                    colorMap[i-1][j],
                    colorMap[i-1][j-1]
                ];
                
                // Generate the face normals
                for ( var f = face; f <= face+1; f++ ) {
        
        			var vA = chunkGeometry.vertices[ chunkGeometry.faces[f].a ];
        			var vB = chunkGeometry.vertices[ chunkGeometry.faces[f].b ];
        			var vC = chunkGeometry.vertices[ chunkGeometry.faces[f].c ];
        
        			var cb = new THREE.Vector3().subVectors( vC, vB );
        			var ab = new THREE.Vector3().subVectors( vA, vB );
        			cb.cross( ab );
        			cb.normalize();
        			chunkGeometry.faces[f].normal.copy( cb );
        			
        			vertexNormals[ chunkGeometry.faces[f].a ].add( cb );
        			vertexNormals[ chunkGeometry.faces[f].b ].add( cb );
        			vertexNormals[ chunkGeometry.faces[f].c ].add( cb );
        
        		}
                
                face += 2;
            }
            
            vert++;
        }
    }
    
    // Fix the edge vertex normals to prevent lighting errors
    vert = 0;
    var tf = new THREE.Plane();
    var a = new THREE.Vector3();
    var b = new THREE.Vector3();
    var c = new THREE.Vector3();
    for( i = 0; i <= this.chunkSize; i++ ) {
        for( j = 0; j <= this.chunkSize; j++ ) {
            
            if ( ( i === 0 ) && ( j === 0 ) ) { // CHECK
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i, j+1, heightMap[i][j+1] ),
                    c.set( i-1, j, heightMap[i-1][j] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i-1, j, heightMap[i-1][j] ),
                    c.set( i-1, j-1, heightMap[i-1][j-1] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i-1, j-1, heightMap[i-1][j-1] ),
                    c.set( i, j-1, heightMap[i][j-1] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i, j-1, heightMap[i][j-1] ),
                    c.set( i+1, j, heightMap[i+1][j] )
                );
                vertexNormals[ vert ].add( tf.normal );
                
            } else if ( ( i === 0 ) && ( j === this.chunkSize ) ) { // CHECK ?!?!?!?!?!
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i, j+1, heightMap[i][j+1] ),
                    c.set( i-1, j, heightMap[i-1][j] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i-1, j, heightMap[i-1][j] ),
                    c.set( i-1, j-1, heightMap[i-1][j-1] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i-1, j-1, heightMap[i-1][j-1] ),
                    c.set( i, j-1, heightMap[i][j-1] )
                );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i+1, j+1, heightMap[i+1][j+1] ),
                    c.set( i, j+1, heightMap[i][j+1] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i+1, j, heightMap[i+1][j] ),
                    c.set( i+1, j+1, heightMap[i+1][j+1] )
                );
                vertexNormals[ vert ].add( tf.normal );
                
            } else if ( ( i === this.chunkSize ) && ( j === this.chunkSize ) ) { // CHECK!
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i+1, j+1, heightMap[i+1][j+1] ),
                    c.set( i, j+1, heightMap[i][j+1] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i+1, j, heightMap[i+1][j] ),
                    c.set( i+1, j+1, heightMap[i+1][j+1] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i, j-1, heightMap[i][j-1] ),
                    c.set( i+1, j, heightMap[i+1][j] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i, j+1, heightMap[i][j+1] ),
                    c.set( i-1, j, heightMap[i-1][j] )
                );
                vertexNormals[ vert ].add( tf.normal );
                
            } else if ( ( i === this.chunkSize ) && ( j === 0 ) ) {
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i+1, j+1, heightMap[i+1][j+1] ),
                    c.set( i, j+1, heightMap[i][j+1] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i+1, j, heightMap[i+1][j] ),
                    c.set( i+1, j+1, heightMap[i+1][j+1] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i, j-1, heightMap[i][j-1] ),
                    c.set( i+1, j, heightMap[i+1][j] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i-1, j, heightMap[i-1][j] ),
                    c.set( i-1, j-1, heightMap[i-1][j-1] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i-1, j-1, heightMap[i-1][j-1] ),
                    c.set( i, j-1, heightMap[i][j-1] )
                );
                vertexNormals[ vert ].add( tf.normal );
            
                
            } else if ( ( i === 0 ) ) { // CHECK!
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i, j+1, heightMap[i][j+1] ),
                    c.set( i-1, j, heightMap[i-1][j] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i-1, j, heightMap[i-1][j] ),
                    c.set( i-1, j-1, heightMap[i-1][j-1] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i-1, j-1, heightMap[i-1][j-1] ),
                    c.set( i, j-1, heightMap[i][j-1] )
                );
                vertexNormals[ vert ].add( tf.normal );
                
            } else if ( i === this.chunkSize ) { // CHECK!
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i+1, j+1, heightMap[i+1][j+1] ),
                    c.set( i, j+1, heightMap[i][j+1] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i+1, j, heightMap[i+1][j] ),
                    c.set( i+1, j+1, heightMap[i+1][j+1] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i, j-1, heightMap[i][j-1] ),
                    c.set( i+1, j, heightMap[i+1][j] )
                );
                vertexNormals[ vert ].add( tf.normal );
                
            } else if ( j === 0 ) { // CHECK!
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i-1, j, heightMap[i-1][j] ),
                    c.set( i-1, j-1, heightMap[i-1][j-1] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i-1, j-1, heightMap[i-1][j-1] ),
                    c.set( i, j-1, heightMap[i][j-1] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i, j-1, heightMap[i][j-1] ),
                    c.set( i+1, j, heightMap[i+1][j] )
                );
                vertexNormals[ vert ].add( tf.normal );
                
            } else if ( j === this.chunkSize ) { // CHECK!
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i, j+1, heightMap[i][j+1] ),
                    c.set( i-1, j, heightMap[i-1][j] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i+1, j+1, heightMap[i+1][j+1] ),
                    c.set( i, j+1, heightMap[i][j+1] )
                );
                vertexNormals[ vert ].add( tf.normal );
                tf.setFromCoplanarPoints(
                    a.set( i, j, heightMap[i][j] ),
                    b.set( i+1, j, heightMap[i+1][j] ),
                    c.set( i+1, j+1, heightMap[i+1][j+1] )
                );
                vertexNormals[ vert ].add( tf.normal );
            }
            
            vert++;
        }
    }
    
    // Apply the vertex normals
    for ( var f = 0; f < chunkGeometry.faces.length; f++ ) {
        face = chunkGeometry.faces[ f ];
//         face.vertexNormals[ 0 ] = vertexNormals[ face.a ].normalize().clone();
// 		face.vertexNormals[ 1 ] = vertexNormals[ face.b ].normalize().clone();
// 		face.vertexNormals[ 2 ] = vertexNormals[ face.c ].normalize().clone();
        face.vertexNormals[ 0 ] = vertexNormals[ face.a ];
		face.vertexNormals[ 1 ] = vertexNormals[ face.b ];
		face.vertexNormals[ 2 ] = vertexNormals[ face.c ];
    }
    
    chunkGeometry.computeBoundingSphere();
    
    var chunkMesh = new THREE.Mesh(
        chunkGeometry,
        // new THREE.MeshBasicMaterial( {
        new THREE.MeshLambertMaterial( {
            color: 0xFFFFFF,
            vertexColors: THREE.VertexColors,
            // shading: THREE.FlatShading,
            shading: THREE.SmoothShading,
            wireframe: false,
            wrapAround: false,
            transparent: false,
            opacity: 0.75
        } )
    );
    
    chunkMesh.position.add( new THREE.Vector3( ( chunkX * this.chunkSize ), ( chunkY * this.chunkSize ), 0 ) );
    
    // var faceNormHelper = new THREE.FaceNormalsHelper( chunkMesh, 2, 0xff00ff, 1 );
    // theScene.add( faceNormHelper );
    // var vertNormHelper = new THREE.VertexNormalsHelper( chunkMesh, 2, 0xff00ff, 1 );
    // theScene.add( vertNormHelper );
    
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