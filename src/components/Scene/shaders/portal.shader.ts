export const vertexShaderPortal = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShaderPortal = `
precision mediump float;

vec2 hash(vec2 p)
{
    mat2 m = mat2(15.32, 83.43, 117.38, 289.59);
    return fract(sin(m * p) * 46783.289);
}

float voronoi(vec2 p)
{
    vec2 g = floor(p);
    vec2 f = fract(p);
    float distanceFromPointToCloestFeaturePoint = 1.0;
    
    for (int y = -1; y <= 1; ++y)
    {
        for (int x = -1; x <= 1; ++x)
        {
            vec2 latticePoint = vec2(float(x), float(y));
            float h = distance(latticePoint + hash(g + latticePoint), f);
            distanceFromPointToCloestFeaturePoint = min(distanceFromPointToCloestFeaturePoint, h);
        }
    }
    
    return 1.0 - sin(distanceFromPointToCloestFeaturePoint);
}

float texture(vec2 uv)
{
    float t = voronoi(uv * 8.0);
    t *= 1.0 - length(uv * 2.0);
    return t;
}

float fbm(vec2 uv)
{
    float sum = 0.0;
    float amp = 1.0;
    
    for (int i = 0; i < 4; ++i)
    {
        sum += texture(uv) * amp;
        uv += uv;
        amp *= 0.8;
    }
    
    return sum;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (fragCoord.xy / iResolution.xy) * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    float t = pow(fbm(uv * 0.3), 2.0);
    fragColor = vec4(vec3(t * 2.0, t * 4.0, t * 8.0), 1.0);
}`;
