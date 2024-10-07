"use client";

import React, { useState, useEffect } from 'react';
import { Form, Button, Upload, message, UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { analyzeImageAndSaveResult } from '../utils/imageAnalysis'; // Adjust the path as necessary

const { Dragger } = Upload;

const ImageAnalysis = () => {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // Clear localStorage and image state on page refresh
  useEffect(() => {
    const handlePageReload = () => {
      localStorage.removeItem('injuryImages');
      localStorage.removeItem('injurySeverity');
      setImages([]);
    };

    window.addEventListener('beforeunload', handlePageReload);

    return () => {
      window.removeEventListener('beforeunload', handlePageReload);
    };
  }, []);

  // Load images and analysis result from localStorage on initial render
  useEffect(() => {
    const storedImages = localStorage.getItem('injuryImages');
    const severity = localStorage.getItem('injurySeverity');

    if (storedImages) {
      setImages(JSON.parse(storedImages));
    }

    if (severity) {
      setAnalysisResult(severity);
    }
  }, []);

  // Function to handle form submission
  const onFinish = async () => {
    if (images.length > 0) {
      // Store the images for analysis
      localStorage.setItem('injuryImages', JSON.stringify(images));
      try {
        const severity = await analyzeImageAndSaveResult("imageInput"); // Analyze the image
        localStorage.setItem('injurySeverity', severity); // Save the result to localStorage
        setAnalysisResult(severity);
        message.success('Analysis completed.');
      } catch (error) {
        message.error("Failed to analyze the image.");
      }
    } else {
      message.error("Please upload an image for analysis.");
    }
  };

  // Function to handle clearing the image
  const handleClearImages = () => {
    setImages([]); // Clear images from state
    localStorage.removeItem('injuryImages'); // Remove images from localStorage
    localStorage.removeItem('injurySeverity'); // Remove severity result from localStorage
    setAnalysisResult(null); // Clear the analysis result
    message.success("Uploaded image has been cleared.");
  };

  // Redirect to recommendations page
  const handleCheckRecommendations = () => {
    router.push('/recommendations');
  };

  // Redirect to home page
  const handleGoBackToHome = () => {
    localStorage.removeItem('injuryImages');
    localStorage.removeItem('injurySeverity');
    localStorage.removeItem('injuryDiagnosisData');
    router.push('/');
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false, // Disable multiple files upload
    customRequest(option) {
      const { file, onSuccess } = option;
      const reader = new FileReader();
      reader.readAsDataURL(file as File); // Read file as Base64
      reader.onloadend = () => {
        const newImage = reader.result as string; // New uploaded image
        // Check if an image is already uploaded
        if (images.length === 0) {
          setImages([newImage]); // Only add the new image
          localStorage.setItem('injuryImages', JSON.stringify([newImage]));
          onSuccess?.('ok'); // Simulate successful upload
          message.success(`${(file as File).name} uploaded successfully`);
        } else {
          message.warning("You can only upload one image. Please clear the existing image first.");
        }
      };
    },
    onChange(info) {
      const { status } = info.file;
      if (status === 'error') {
        message.error(`${info.file.name} upload failed.`);
      }
    },
    showUploadList: false, // Hide upload list
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-16 pb-24 gap-16 bg-gradient-to-r from-blue-200 via-teal-200 to-green-200">
      <main className="flex flex-col items-center justify-center w-full max-w-4xl p-12 bg-white rounded-lg shadow-lg border-2 border-blue-100">
        <h1 className="text-8xl font-bold mb-6 text-center text-teal-700">
          Image Analyzer
        </h1>

        {/* Display uploaded image if exists */}
        {images.length > 0 && (
          <div className="w-full">
            <h3 className="text-2xl font-semibold mb-4 text-center text-teal-700">Uploaded Image:</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="relative group">
                <img
                  id="imageInput"
                  src={images[0]}
                  alt="Uploaded image"
                  className="w-40 h-40 object-cover rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105"
                />
              </div>
            </div>
            {/* Clear Image Button below thumbnail and centered */}
            <div className="text-center mt-4">
              <Button
                type="primary"
                onClick={handleClearImages}
                className="bg-red-500 hover:bg-red-600 text-white text-2xl font-semibold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
              >
                Clear Image
              </Button>
            </div>
          </div>
        )}

        <Form name="basic" autoComplete="off" className="w-full mt-8">
          <Form.Item>
            <Dragger {...uploadProps} className="bg-gray-100 border-dashed rounded-lg p-8 shadow-lg transition-transform transform hover:scale-105">
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text text-teal-800 text-2xl">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint text-teal-600 text-2xl">
                You can only upload one image. Do not upload sensitive data.
              </p>
            </Dragger>
          </Form.Item>

          {/* Buttons vertically aligned with gap and max width */}
          <Form.Item className="flex flex-col items-center w-full">
            <Button
              type="primary"
              onClick={onFinish}
              className="bg-teal-600 hover:bg-teal-700 text-white text-2xl font-semibold py-5 w-full max-w-2xl rounded-lg shadow-lg transform hover:scale-105 transition-transform"
            >
              Analyze Uploaded Image
            </Button>
            <Button 
              type="default" 
              onClick={handleGoBackToHome}
              className="bg-pink-500 hover:bg-pink-600 text-white text-2xl font-semibold py-5 w-full max-w-2xl rounded-lg shadow-lg transform hover:scale-105 transition-transform mt-6" // Added mt-6 to create space between buttons
            >
              Go Back to Home
            </Button>
          </Form.Item>
        </Form>

        {/* Check Recommendations Button */}
        {analysisResult && (
          <div className="text-center mt-8">
            <h2 className="text-2xl font-semibold text-teal-800 mb-4">Your injury is: <span className="text-teal-600">{analysisResult}</span>. Please check recommendations below.</h2>
            <Button
              type="dashed"
              onClick={handleCheckRecommendations}
              className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:bg-gradient-to-r hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white text-2xl font-semibold py-5 w-full max-w-2xl rounded-lg shadow-lg transform hover:scale-105 transition-transform"
            >
              Check Recommendations
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ImageAnalysis;
