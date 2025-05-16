/**
 * Utility for preloading images to ensure they're in the browser cache
 * before they're needed for textures
 */

// List of all image assets that should be preloaded
const textureAssets = [
  'assets/atlas_rm_status_alive.png',
  'assets/atlas_rm_status_dead.png',
  'assets/atlas_rm_status_unknown.png',
  'assets/cockpit_cut_no_layer_cables.png',
  'assets/fly_eye.png',
  'assets/hud.jpg',
  'assets/icon_dead.png'
];

/**
 * Preloads all texture assets to ensure they're in browser cache
 * @returns Promise that resolves when all textures are loaded
 */
export function preloadTextures(): Promise<void[]> {
  return Promise.all(
    textureAssets.map(
      (src) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve();
          img.onerror = () => {
            console.error(`Failed to preload texture: ${src}`);
            // Resolve anyway to not block the app
            resolve();
          };
          img.src = src;
        })
    )
  );
}
