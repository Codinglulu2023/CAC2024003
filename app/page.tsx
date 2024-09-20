"use client";

import React, { useState, useEffect } from 'react';
import { Form, Button, Upload, message, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Image from "next/image";
import { useRouter } from 'next/navigation';

const { Dragger } = Upload;

export default function Home() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // Clear localStorage and image state on page refresh
  useEffect(() => {
    const handlePageReload = () => {
      localStorage.removeItem('injuryImages');
      setImages([]);
      setSelectedImages([]);
    };

    window.addEventListener('beforeunload', handlePageReload);

    return () => {
      window.removeEventListener('beforeunload', handlePageReload);
    };
  }, []);

  // Load images from localStorage on initial render
  useEffect(() => {
    const storedImages = localStorage.getItem('injuryImages');
    const storedSelectedImages = localStorage.getItem('selectedImages');
    if (storedImages) {
      setImages(JSON.parse(storedImages));
    }
    if (storedSelectedImages) {
      setSelectedImages(JSON.parse(storedSelectedImages));
    }
  }, []);

  // Function to handle form submission
  const onFinish = () => {
    if (selectedImages.length > 0) {
      // Store the selected images for analysis
      localStorage.setItem('selectedInjuryImages', JSON.stringify(selectedImages));
      router.push('/injuryDiagnosisPage'); // Redirect to the next page
    } else {
      message.error("Please select at least one image for analysis.");
    }
  };

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imagesArray = files.map((file) => URL.createObjectURL(file));
    // Check for duplicate images
    const newImages = imagesArray.filter((image) => !images.includes(image));
    if (newImages.length === 0) {
      message.warning("You cannot upload duplicate images.");
    } else {
      setImages((prevImages) => [...prevImages, ...newImages]);
      localStorage.setItem('injuryImages', JSON.stringify([...images, ...newImages]));
    }
    files.forEach((file) => URL.revokeObjectURL(file));
  };

  // Function to handle image selection
  const handleImageSelect = (image) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter((img) => img !== image));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
    localStorage.setItem('selectedImages', JSON.stringify([...selectedImages, image]));
  };

  const uploadProps = {
    name: 'file',
    multiple: true, // Allow multiple files upload
    customRequest({ file, onSuccess }: any) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Read file as Base64
      reader.onloadend = () => {
        const newImage = reader.result as string; // New uploaded image
        // Check for duplicate images
        if (!images.includes(newImage)) {
          setImages((prevImages) => [...prevImages, newImage]); // Add new image to the array
          localStorage.setItem('injuryImages', JSON.stringify([...images, newImage]));
          onSuccess('ok'); // Simulate successful upload
          message.success(`${file.name} uploaded successfully`);
        } else {
          message.warning("You cannot upload duplicate images.");
        }
      };
    },
    onChange(info: any) {
      const { status } = info.file;
      if (status === 'error') {
        message.error(`${info.file.name} upload failed.`);
      }
    },
    showUploadList: false, // Hide upload list
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

        {/* Display all uploaded images with selection option */}
        {images.length > 0 && (
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-4 text-center text-teal-700">Select Images for Analysis:</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={image} 
                    alt={`Uploaded image ${index + 1}`} 
                    className={`w-24 h-24 object-cover rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 ${selectedImages.includes(image) ? 'ring-4 ring-blue-500' : ''}`}
                    onClick={() => handleImageSelect(image)} // Select the image
                  />
                  <Checkbox
                    className="absolute top-2 right-2"
                    checked={selectedImages.includes(image)}
                    onChange={() => handleImageSelect(image)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <Form
          name="basic"
          onFinish={onFinish}
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
            <Button 
              type="primary" 
              htmlType="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
            >
              Analyze Selected Images
            </Button>
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
        <a
          className="flex items-center gap-2 hover:underline hover:text-blue-600"
          href="/injuryDiagnosisPage"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={20}
            height={20}
          />
          Diagnosis Questionnaire
        </a>
      </footer>
    </div>
  );
}
