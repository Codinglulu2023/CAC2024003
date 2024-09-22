// utils/imageAnalysis.ts

declare global {
    interface Window {
      cv: OpenCV;
    }
  }
  
  interface OpenCV {
    imread: (imgElement: HTMLImageElement) => Mat;
    Mat: new () => Mat;
    COLOR_RGBA2GRAY: number;
    cvtColor: (src: Mat, dst: Mat, code: number, dstCn: number) => void;
    calcHist: (images: Mat[], channels: number[], mask: Mat | null, hist: Mat, histSize: number[], ranges: number[], accumulate: boolean) => void;
  }
  
  interface Mat {
    delete(): void;
    data32F: Float32Array;
  }
  
  // Function to analyze the image and save the result
  export const analyzeImageAndSaveResult = (imageElement: HTMLImageElement): string => {
    if (!window.cv || typeof window.cv.imread !== 'function') {
      console.error('OpenCV.js is not loaded or improperly loaded.');
      return 'mild'; // Default severity if OpenCV.js is not available
    }
  
    try {
      const src: Mat = window.cv.imread(imageElement); // Read the image from HTMLImageElement
      const gray: Mat = new window.cv.Mat(); // Create a matrix for the grayscale image
      window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY, 0); // Convert the image to grayscale
  
      // Calculate the brightness histogram of the image
      const hist: Mat = new window.cv.Mat();
      const mask: Mat | null = null;
      const histSize: number[] = [256]; // Number of bins
      const ranges: number[] = [0, 255]; // Pixel value range
      const channels: number[] = [0]; // Only one channel for the grayscale image
  
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
  