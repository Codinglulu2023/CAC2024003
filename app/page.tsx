"use client"

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
    const files = event.target.files;
    const imagesArray = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...imagesArray]);
    localStorage.setItem('injuryImages', JSON.stringify([...images, ...imagesArray]));
    Array.from(files).forEach((file) => URL.revokeObjectURL(file));
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
        setImages((prevImages) => [...prevImages, newImage]); // Add new image to the array
        localStorage.setItem('injuryImages', JSON.stringify([...images, newImage]));
        onSuccess('ok'); // Simulate successful upload
        message.success(`${file.name} uploaded successfully`);
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 style={{ fontSize: '64px', backgroundColor: 'lightblue' }}>Injury Detector</h1>
        <Image
          className="dark:invert"
          src="/20240919194536.png"
          alt="logo"
          width={400}
          height={200}
          priority
          onError={(e) => {
            console.error('Image load failed:', e);
          }}
        />
        <p className="text-sm text-center sm:text-left">
          The app does not provide professional medical advice, and the creator assumes no liability. Users are encouraged to consult healthcare providers for proper diagnosis.
        </p>

        {/* Display all uploaded images with selection option */}
        {images.length > 0 && (
          <div>
            <h3>Select Images for Analysis:</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {images.map((image, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img 
                    src={image} 
                    alt={`Uploaded image ${index + 1}`} 
                    style={{ width: '100px', height: '100px', objectFit: 'cover', border: selectedImages.includes(image) ? '2px solid blue' : 'none' }}
                    onClick={() => handleImageSelect(image)} // Select the image
                  />
                  <Checkbox
                    checked={selectedImages.includes(image)}
                    onChange={() => handleImageSelect(image)}
                  >
                    Select
                  </Checkbox>
                </div>
              ))}
            </div>
          </div>
        )}

        <Form
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="Upload Image">
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for multiple uploads. Do not upload sensitive data.
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Analyze Selected Images
            </Button>
          </Form.Item>
        </Form>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/injuryDiagnosisPage"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Diagnosis Questionnaire
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/recommendations"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to find Urgent Care locations
        </a>
      </footer>
    </div>
  );
}
