// utils/opencvLoader.ts

// OpenCV.js 类型定义
declare global {
  interface Window {
    cv: OpenCVInterface;
  }
}

// 定义 OpenCV 的基本接口
interface OpenCVInterface {
  imread: (imgElement: HTMLImageElement | string) => Mat;
  Mat: new () => Mat;
  MatVector: new () => MatVector;
  COLOR_RGBA2GRAY: number;
  cvtColor: (src: Mat, dst: Mat, code: number, dstCn?: number) => void;
  calcHist: (images: MatVector, channels: number[], mask: Mat | null, hist: Mat, histSize: number[], ranges: number[], accumulate?: boolean) => void;
  imshow: (canvasId: string, mat: Mat) => void;
  waitKey: (delay?: number) => number;
}

// 定义 Mat 接口
interface Mat {
  delete(): void;
  data32F: Float32Array;
}

interface MatVector {
  push_back(x: Mat): void;
}

// 定义 OpenCV 加载器的状态类型
type OpenCvLoadState = 'not-loaded' | 'loading' | 'loaded' | 'failed';

// 创建一个全局的加载状态来跟踪 OpenCV.js 的加载
let loadState: OpenCvLoadState = 'not-loaded';

// 函数，用于确认 OpenCV.js 是否完全加载并可用
const isOpenCvReady = (): boolean => {
  return window.cv && typeof window.cv.imread === 'function';
};

// 加载 OpenCV.js 的函数
export const loadOpenCv = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    // 如果 OpenCV 已经加载完成，则直接返回
    if (loadState === 'loaded' && isOpenCvReady()) {
      resolve();
      return;
    }

    // 如果 OpenCV 正在加载中，则等待加载完成后再返回
    if (loadState === 'loading') {
      const interval = setInterval(() => {
        if (loadState === 'loaded' && isOpenCvReady()) {
          clearInterval(interval);
          resolve();
        } else if (loadState === 'failed') {
          clearInterval(interval);
          reject(new Error('OpenCV.js failed to load.'));
        }
      }, 100);
      return;
    }

    // 否则，设置加载状态为 'loading'，并开始加载 OpenCV.js
    loadState = 'loading';

    // 创建脚本标签动态加载 OpenCV.js
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.x/opencv.js'; // OpenCV.js 的 URL
    script.async = true;

    // 处理加载成功事件
    script.onload = () => {
      // 检查 OpenCV.js 是否加载成功
      const checkReady = setInterval(() => {
        // 检查 OpenCV.js 的关键方法是否已经加载
        if (isOpenCvReady()) {
          clearInterval(checkReady);
          loadState = 'loaded'; // 设置加载状态为 'loaded'
          resolve(); // 解析 Promise
        }
      }, 100);
    };

    // 处理加载错误事件
    script.onerror = () => {
      loadState = 'failed'; // 设置加载状态为 'failed'
      reject(new Error('Failed to load OpenCV.js.')); // 拒绝 Promise
    };

    // 将脚本标签添加到文档头部
    document.head.appendChild(script);
  });
};

// 函数，用于确认 OpenCV.js 是否已经加载完毕
export const isOpenCvLoaded = (): boolean => {
  return loadState === 'loaded' && isOpenCvReady();
};
