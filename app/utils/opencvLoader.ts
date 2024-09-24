// utils/opencvLoader.ts

// 声明 OpenCV 全局接口
declare global {
  interface Window {
    cv: any;
  }
}

// 定义 OpenCV 加载器的状态类型
type OpenCvLoadState = 'not-loaded' | 'loading' | 'loaded' | 'failed';

// 创建一个全局的加载状态来跟踪 OpenCV.js 的加载
let loadState: OpenCvLoadState = 'not-loaded';

// 加载 OpenCV.js 的函数
export const loadOpenCv = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    // 如果 OpenCV 已经加载完成，则直接返回
    if (loadState === 'loaded') {
      resolve();
      return;
    }

    // 如果 OpenCV 正在加载中，则等待加载完成后再返回
    if (loadState === 'loading') {
      const interval = setInterval(() => {
        if (loadState === 'loaded') {
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
        if (window.cv && window.cv.imread) {
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
  return loadState === 'loaded';
};
