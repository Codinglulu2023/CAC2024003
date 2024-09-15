"use client"

import React, { useState, useEffect } from 'react';
import { Form, Button, Upload, message } from 'antd';
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
      localStorage.setItem('injuryImages', JSON.stringify(images)); // Store images in localStorage
    }
    router.push('/injuryDiagnosisPage'); // Redirect to the next page
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    customRequest({ file, onSuccess }: any) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Read file as Base64
      reader.onloadend = () => {
        const newImage = reader.result as string; // New uploaded image
        setImages((prevImages) => [...prevImages, newImage]); // Add new image to the array
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
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 style={{ fontSize: '64px', backgroundColor: 'lightblue' }}>Injury Detector</h1>
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <p className="text-sm text-center sm:text-left">
          The app does not provide professional medical advice, and the creator assumes no liability. Users are encouraged to consult healthcare providers for proper diagnosis.
        </p>

        {/* Display all uploaded images as thumbnails */}
        {images.length > 0 && (
          <div>
            <h3>Uploaded Images:</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {images.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`Uploaded image ${index + 1}`} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }} // Control image size
                />
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
                Support for a single upload. Do not upload sensitive data.
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
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
