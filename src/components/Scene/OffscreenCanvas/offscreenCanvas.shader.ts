export const vertexShaderAtlas = `
attribute float tileIndex;
uniform int elementsCount;
uniform float radius;
uniform int currentElementId;
uniform float uTime; // new uniform for time

attribute vec3 lePos;
attribute float leIsSelected;
attribute float speed;
attribute float leAnimDisplacement;

varying vec2 vUv;
varying float vTileIndex;
varying float vIsSelected;
varying float vDepth;


attribute float animationProgress;

void main() {
  vUv = uv;
  vTileIndex = tileIndex;
  vIsSelected = leIsSelected;
  
  vec3 pos = lePos;
  
  // Calculate the direction vector as the normalized position
  vec3 direction = normalize(pos);
  
  // Calculate the up vector by rotating the direction vector 90 degrees around the Y axis
  vec3 up = vec3(direction.z, 0.0, -direction.x) * -1.;

  // Scale factor based on leIsSelected
  vec3 scale = vec3(1.0) * leAnimDisplacement; // Adjust the scaling factor as desired

  // Set z displacement for selected element
  float displaceSelectedZ = leAnimDisplacement;
  
  // Calculate the model matrix with scaling, rotation, translation, and local z-axis movement
  mat4 modelMatrix = mat4(
    vec4(scale.x * up, 0.0),
    vec4(scale.y * cross(up, direction), 0.0),
    vec4(-scale.z * direction, 0.0),
    vec4(pos +  direction * displaceSelectedZ, 1.0) // Move along the local z-axis if selected
  );

  vec4 glPosition = projectionMatrix * modelViewMatrix * modelMatrix * vec4(position, 1.0);
  vDepth = glPosition.z;
  
  // Transform the vertex position by the model matrix
  gl_Position = glPosition;
}

`;

export const fragmentShaderAtlas = `
uniform sampler2D textureAtlas;
uniform vec2 resolution;
uniform float textureWidth;
uniform float textureHeight;
uniform float uTime; // new uniform for time
varying float vIsSelected;
uniform vec3 camPosition;

varying float vDepth;
varying float vTileIndex;
varying vec2 vUv;



// PORTAL

vec2 hash( vec2 p ) {
            mat2 m = mat2( 15.32, 83.43, 117.38, 289.59 );
            return fract( sin( m * p) * 46783.289 );
        }

        float voronoi( vec2 p ) {
            vec2 g = floor( p );
            vec2 f = fract( p );
            float distanceFromPointToCloestFeaturePoint = 1.0;

            for( int y = -1; y <= 1; ++y ) {
                for( int x = -1; x <= 1; ++x ) {
                    vec2 latticePoint = vec2( x, y );
                    float h = distance( latticePoint + hash( g + latticePoint), f );
                    distanceFromPointToCloestFeaturePoint = min( distanceFromPointToCloestFeaturePoint, h ); 
                }
            }
            return 1.0 - sin(distanceFromPointToCloestFeaturePoint);
        }

        float texture(vec2 uv) {
            float t = voronoi( uv * 8.0 + vec2(uTime) );
            t *= 1.0 - length(uv * 2.0);
            return t;
        }

        float fbm( vec2 uv ) {
            float sum = 0.00;
            float amp = 1.0;

            for( int i = 0; i < 4; ++i ) {
                sum += texture( uv ) * amp;
                uv += uv;
                amp *= 0.8;
            }
            return sum;
        }

        vec4 portaled(vec2 vUv) {
        
            float t = pow( fbm( vUv * 0.3 ), 2.0);
            return vec4( vec3( t * 2.0, t * 4.0, t * 8.0 ), 1.0 );
        }

// END OF PORTAL

float squareShape(vec2 uv, float size) {
    float left = 0.5 - size / 2.0;
    float right = 0.5 + size / 2.0;
    
    if (uv.x < left && uv.x > right && uv.y < left && uv.y > right) {
        return 1.0;
    } else {
        return 0.0;
    }
}


void main() {
  vec2 atlasPosition = vec2(mod(vTileIndex, textureWidth), floor(vTileIndex / textureWidth));
  vec2 uv = (atlasPosition + vUv) / vec2(textureWidth, textureHeight);
  vec4 color = texture2D(textureAtlas, uv);

 
    // Control opacity based on depth and on lateral distance from center
    float depthOpacity =   600. / vDepth  * 600. / vDepth - 3.75 ;

    // float depthOpacity = 3.-vDepth / 140.;
    float depthThreshhold = 3.-vDepth / 20.;
    float center = resolution.x / 2.0;
    float distanceFromCenter = depthThreshhold < 0. ? 0. : abs(gl_FragCoord.x - center);
    float fadeWidth = resolution.x * 0.49;  // Adjust the fade width as desired


    float lateralOpacity = 1.;

    // Apply custom tone mapping to balance out the global tone mapping applied for glowing 
    vec3 toneMappedColor = pow(color.rgb, vec3(1.5));

    
    gl_FragColor = vec4(toneMappedColor, max(0., min(1., depthOpacity * lateralOpacity))  ) ;


    // TODO HERE : implement a per image anim/shape, more natural/organic

    // if ((sin(uTime + vTileIndex / 100. ) + 1.) / 2. < vUv.y && vIsSelected == 0. ) {
    //   discard;
   // }
}
`;
