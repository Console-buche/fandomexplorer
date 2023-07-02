export const asteroidRingVertexShader = `
uniform float uRadius;
varying vec2 vUv;
varying float d;
varying float vDepth;



void main() {
    vUv = uv;
    d = length(position.xy);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vDepth = gl_Position.z ;
}
`;

export const asteroidRingFragmentShader = `
uniform float uTime;
uniform float uRadius;
uniform float uAlpha;
uniform int isStatusSelected;
varying vec2 vUv;
varying float d;
varying float vDepth;



void main() {

       float depthOpacity =  1.- vDepth / 300.;



    vec3 color = vec3(0.5, 0.0, 0.8);


    float isActive = isStatusSelected == 1 ? 1. : 0.3;

    float distanceFromCenter = length(vUv - vec2(0.5)); 
    float opacity = smoothstep(0.8, 1.0, distanceFromCenter * 2.); 

    gl_FragColor = vec4(color,   min(depthOpacity * opacity, 1.) *isActive * uAlpha);
}
`;
