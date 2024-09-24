// utils/imageAnalysis.ts
import { loadOpenCv } from './opencvLoader';

export const analyzeImageAndSaveResult = async (imageElement: HTMLImageElement): Promise<string> => {
  try {
    // Wait for OpenCV.js to load
    await loadOpenCv();

    if (!window.cv || typeof window.cv.imread !== 'function') {
      console.error('OpenCV.js is not loaded or improperly loaded.');
      return 'mild'; // Default severity if OpenCV.js is not available
    }

    const src = window.cv.imread(imageElement); // Read the image from HTMLImageElement
    const gray = new window.cv.Mat(); // Create a matrix for the grayscale image
    window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY, 0); // Convert the image to grayscale

    // Calculate the brightness histogram of the image
    const hist = new window.cv.Mat();
    const mask: null = null;
    const histSize = [256]; // Number of bins
    const ranges = [0, 255]; // Pixel value range
    const channels = [0]; // Only one channel for the grayscale image

    window.cv.calcHist([gray], channels, mask, hist, histSize, ranges, false);

    // Calculate the number of bright pixels in the histogram
    let brightPixels = 0;
    for (let i = 200; i < 256; i++) { // Count the number of pixels with brightness above 200
      brightPixels += hist.data32F[i];
    }

    let severity: string;
    if (brightPixels > 1000) {
      severity = 'severe';
    } else if (brightPixels > 500) {
      severity = 'moderate';
    } else {
      severity = 'mild';
    }

    localStorage.setItem('injurySeverity', severity); // Save the result in localStorage

    // Release memory
    src.delete();
    gray.delete();
    hist.delete();

    return severity;
  } catch (error) {
    console.error('Image analysis failed:', error);
    return 'mild'; // Default severity in case of an error
  }
};
