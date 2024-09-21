"use client";

import React, { useState, useEffect } from 'react';
import { Form, Button, Upload, message, UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Image from "next/image";
import { useRouter } from 'next/navigation';

const { Dragger } = Upload;

export default function Home() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);

  // Clear localStorage and image state on page refresh
  useEffect(() => {
    const handlePageReload = () => {
      localStorage.removeItem('injuryImages');
      setImages([]);
    };

    window.addEventListener('beforeunload', handlePageReload);

    return () => {
      window.removeEventListener('beforeunload', handlePageReload);
    };
  }, []);

  // Load images from localStorage on initial render
  useEffect(() => {
    const storedImages = localStorage.getItem('injuryImages');
    if (storedImages) {
      setImages(JSON.parse(storedImages));
    }
  }, []);

  // Function to handle form submission
  const onFinish = () => {
    if (images.length > 0) {
      // Store the images for analysis
      localStorage.setItem('injuryImages', JSON.stringify(images));
      router.push('/injuryDiagnosisPage'); // Redirect to the next page
    } else {
      message.error("Please upload at least one image for analysis.");
    }
  };

  // Redirect to injury diagnosis page
  const handleDiagnosisRedirect = () => {
    router.push('/injuryDiagnosisPage');
  };

  // Function to handle clearing all images
  const handleClearImages = () => {
    setImages([]); // Clear images from state
    localStorage.removeItem('injuryImages'); // Remove images from localStorage
    message.success("All uploaded images have been cleared.");
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true, // Allow multiple files upload
    customRequest(option) {
      const { file, onSuccess } = option;
      const reader = new FileReader();
      reader.readAsDataURL(file as File); // Read file as Base64
      reader.onloadend = () => {
        const newImage = reader.result as string; // New uploaded image
        // Check for duplicate images
        if (!images.includes(newImage)) {
          const updatedImages = [...images, newImage];
          setImages(updatedImages); // Add new image to the array
          localStorage.setItem('injuryImages', JSON.stringify(updatedImages));
          onSuccess?.('ok'); // Simulate successful upload
          message.success(`${(file as File).name} uploaded successfully`);
        } else {
          message.warning("You cannot upload duplicate images.");
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

  // New function to handle analysis button click with error handling
  const handleAnalyze = () => {
    // Debug information to check the state
    console.log('Uploaded Images:', images); // Check the uploaded images

    // Check if no images are uploaded
    if (images.length === 0) {
      message.error('Please upload at least one image before analyzing.');
      return; // Stop execution, avoid redirect
    }

    // Call onFinish if images are uploaded
    onFinish();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-12 bg-gradient-to-r from-blue-200 via-teal-200 to-green-200">
      <main className="flex flex-col items-center justify-center w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg border-2 border-blue-100">
        <h1 className="text-6xl font-bold mb-6 text-center text-teal-700">
          Injury Detector
        </h1>
        <Image
          className="rounded-full shadow-lg"
          src="/20240919194536.png"
          alt="logo"
          width={400}
          height={400}
          priority
          onError={(e) => {
            console.error('Image load failed:', e);
          }}
        />
        <p className="text-lg text-center mt-6 mb-8 text-teal-800">
          The app does not provide professional medical advice, and the creator assumes no liability. Users are encouraged to consult healthcare providers for proper diagnosis.
        </p>

        {/* Display all uploaded images without selection option */}
        {images.length > 0 && (
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-4 text-center text-teal-700">Uploaded Images:</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={image} 
                    alt={`Uploaded image ${index + 1}`} 
                    className="w-24 h-24 object-cover rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105"
                  />
                </div>
              ))}
            </div>
            {/* Clear Images Button below thumbnails and centered */}
            <div className="text-center mt-4">
              <Button 
                type="primary" 
                onClick={handleClearImages} 
                className="bg-red-500 hover:bg-red-600 text-white text-lg font-semibold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
              >
                Clear Images
              </Button>
            </div>
          </div>
        )}

        <Form
          name="basic"
          autoComplete="off"
          className="w-full mt-8"
        >
          <Form.Item>
            <Dragger {...uploadProps} className="bg-gray-100 border-dashed rounded-lg p-8 transition-transform transform hover:scale-105">
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text text-teal-800">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint text-teal-600">
                Support for multiple uploads. Do not upload sensitive data.
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item className="text-center">
            <div className="flex gap-4 justify-center">
              <Button 
                type="primary" 
                onClick={handleAnalyze} // Use new function to handle button click
                className="bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
              >
                Analyze Uploaded Images
              </Button>
              <Button 
                type="default" 
                onClick={handleDiagnosisRedirect}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
              >
                Go to Diagnosis Questionnaires
              </Button>
            </div>
          </Form.Item>
        </Form>
      </main>

      <footer className="flex gap-6 flex-wrap items-center justify-center mt-8 text-teal-700 text-lg">
        <a
          className="flex items-center gap-2 hover:underline hover:text-blue-600"
          href="https://www.hopkinsmedicine.org/health/conditions-and-diseases/sports-injuries/preventing-sports-injuries#:~:text=Develop%20a%20fitness%20plan%20that,properly%20after%20exercise%20or%20sports."
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={20}
            height={20}
          />
          Preventing Sports Injuries
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:text-blue-600"
          href="https://www.cdc.gov/physical-activity-basics/about/index.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={20}
            height={20}
          />
          CDC Guidelines For Physical Fitness
        </a>
      </footer>
    </div>
  );
}
