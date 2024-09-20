import cv from '../lib/opencv.js'; 

/**
 * 分析图像中的伤口，并在画布上绘制轮廓。
 * @param {HTMLCanvasElement} canvasElement - 用于分析和显示结果的画布元素。
 * @returns {cv.MatVector} - 返回包含所有轮廓的 MatVector 对象。
 */
export function analyzeWound(canvasElement) {
  // 将 canvas 转换为 OpenCV Mat 对象
  const src = cv.imread(canvasElement);
  const dst = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  // 将图像转换为灰度图
  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);

  // 高斯模糊以减少噪声
  cv.GaussianBlur(dst, dst, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);

  // Canny 边缘检测
  cv.Canny(dst, dst, 50, 100, 3, false);

  // 查找轮廓
  cv.findContours(dst, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);

  // 绘制轮廓
  cv.drawContours(src, contours, -1, [0, 255, 0, 255], 2, cv.LINE_8, hierarchy, 100);

  // 将处理后的图像显示在画布上
  cv.imshow(canvasElement, src);

  // 释放内存
  src.delete();
  dst.delete();
  hierarchy.delete();

  return contours;
}

/**
 * 根据轮廓面积评估伤口的严重程度。
 * @param {cv.MatVector} contours - 包含所有轮廓的 MatVector 对象。
 * @returns {string} - 返回伤口严重程度：'mild', 'moderate' 或 'severe'。
 */
export function evaluateWoundSeverity(contours) {
  let totalArea = 0;

  // 计算所有轮廓的面积总和
  for (let i = 0; i < contours.size(); i++) {
    const contour = contours.get(i);
    const area = cv.contourArea(contour);
    totalArea += area;
  }

  // 根据面积大小判断伤口的严重程度
  if (totalArea < 500) {
    return 'mild'; 
  } else if (totalArea >= 500 && totalArea < 2000) {
    return 'moderate'; 
  } else {
    return 'severe'; 
  }
}
