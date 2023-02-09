export const loadImages = async (
  urls: string[],
  timeout = 5000
): Promise<HTMLImageElement[]> => {
  const loadWithTimeout = (
    src: string,
    t: number
  ): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      let timedOut = false;

      const timer = setTimeout(() => {
        timedOut = true;
        reject(new Error('Timed out'));
      }, timeout);

      const img = new Image();
      img.setAttribute('loading', 'lazy');
      img.onload = () => {
        if (!timedOut) {
          clearTimeout(timer);
          resolve(img);
        }
      };
      img.onerror = () => {
        if (!timedOut) {
          clearTimeout(timer);
          reject(new Error('Failed to load image'));
        }
      };
      img.src = src;
    });
  };

  const imagePromises = urls.map((url) => loadWithTimeout(url, timeout));

  // The following line will throw an error if any of the images fail to load.
  // If you want to handle individual image failures differently, you should catch
  // and handle errors inside the loadWithTimeout function, or inside the map function above.
  return Promise.all(imagePromises);
};
