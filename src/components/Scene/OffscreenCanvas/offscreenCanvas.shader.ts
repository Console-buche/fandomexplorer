export const vertexShaderAtlas = `
varying vec2 vUv;
attribute float tileIndex;
uniform int elementsCount;
uniform float radius;
uniform int currentElementId;
varying float vTileIndex;
attribute vec3 lePos;
attribute float leIsSelected;
attribute float speed;
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
    
  // Calculate the model matrix with rotation and translation
  mat4 modelMatrix = mat4(
    vec4(up, 0.0),
    vec4(cross(up, direction), 0.0),
    vec4(-direction, 0.0),
    vec4(pos, 1.0)
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

varying float vDepth;
varying float vTileIndex;
varying vec2 vUv;

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

    // Add a sci-fi border on the selected element

    float y = vUv.y;
    float x = vUv.x;



float borderSize = 0.15; // adjust this to change border width
float borderDepth = 0.05; // adjust this to change border depth

float hollow = (
    (y > (0.5 + 0.5 - borderDepth) || y < (0.5 - 0.5 + borderDepth) || x > (0.5 + 0.5 - borderDepth) || x < (0.5 - 0.5 + borderDepth)) &&
    !((x < (0.5 - 0.5 + 2.0 * borderSize) && y < (0.5 - 0.5 + 2.0 * borderSize) && x > (0.5 - 0.5 + borderSize) && y > (0.5 - 0.5 + borderSize)) ||
      (x > (0.5 + 0.5 - 2.0 * borderSize) && y < (0.5 - 0.5 + 2.0 * borderSize) && x < (0.5 + 0.5 - borderSize) && y > (0.5 - 0.5 + borderSize)) ||
      (x < (0.5 - 0.5 + 2.0 * borderSize) && y > (0.5 + 0.5 - 2.0 * borderSize) && x > (0.5 - 0.5 + borderSize) && y < (0.5 + 0.5 - borderSize)) ||
      (x > (0.5 + 0.5 - 2.0 * borderSize) && y > (0.5 + 0.5 - 2.0 * borderSize) && x < (0.5 + 0.5 - borderSize) && y < (0.5 + 0.5 - borderSize)) ||
      (x > (0.5 - 0.5 + 2.0 * borderSize) && x < (0.5 + 0.5 - 2.0 * borderSize)) || 
      (y > (0.5 - 0.5 + 2.0 * borderSize) && y < (0.5 + 0.5 - 2.0 * borderSize)))
) ? 0. : 1.;






  float lateralOpacity = 1.;
  // float lateralOpacity = smoothstep(fadeWidth, 0.0, distanceFromCenter);

  if (hollow == 0. && vIsSelected == 1.) {

    gl_FragColor = vec4(0.3, 0.3, 0.3, depthOpacity * lateralOpacity);

  } else {
    
    
    float halfBorderSize = vIsSelected == 1. ? 0.075 : 0.;
    // float halfBorderSize = borderSize / 1.5;
    
    gl_FragColor = vec4(vec3(color) * 1.1, depthOpacity * lateralOpacity);

    if (vUv.y < halfBorderSize || vUv.y > 1.0 - halfBorderSize || vUv.x > 1.-halfBorderSize || vUv.x < halfBorderSize) {
      gl_FragColor = vec4(0.);
    }
    
  }

  // TODO HERE : implement a per image anim/shape, more natural/organic

  // if ((sin(uTime + vTileIndex / 100. ) + 1.) / 2. < vUv.y && vIsSelected == 0. ) {
  //   discard;
  // }
}
`;
