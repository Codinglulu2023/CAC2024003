"use client";

import React, { useState } from 'react';
import { Form, Slider, Radio, Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import { analyzeWound, evaluateWoundSeverity } from '../utils/imageAnalysis';

export default function InjuryDiagnosisPage() {
  const [form] = Form.useForm();
  const router = useRouter();


  // State for form fields
  const [painIntensity, setPainIntensity] = useState(0);
  const [painType, setPainType] = useState('sharp');
  const [swelling, setSwelling] = useState(false);
  const [painDuration, setPainDuration] = useState('');

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [woundSeverity, setWoundSeverity] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load selected images from localStorage on initial render
  useEffect(() => {
    const storedSelectedImages = localStorage.getItem('selectedInjuryImages');
    if (storedSelectedImages) {
      setSelectedImages(JSON.parse(storedSelectedImages));
    } else {
      message.error('No images selected for analysis. Redirecting to home page.');
      router.push('/');
    }
  }, [router]);

   // Analyze the first image and show the result
   useEffect(() => {
    if (selectedImages.length > 0 && canvasRef.current) {
      const img = new Image();
      img.src = selectedImages[0]; // Currently analyze only the first image
      img.onload = () => {
        canvasRef.current!.width = img.width;
        canvasRef.current!.height = img.height;
        const context = canvasRef.current!.getContext('2d');
        context!.drawImage(img, 0, 0);
        analyzeWound(canvasRef.current!);
        // Call evaluateWoundSeverity with contours to determine severity
        const severity = evaluateWoundSeverity(analyzeWound(canvasRef.current!));
        setAnalysisResult(severity);
        message.success(`Wound severity: ${severity}`);
      };
    }
  }, [selectedImages]);

  const onFinish = (values: any) => {
    console.log('Form values: ', values);
    // Save diagnosis data to localStorage
    localStorage.setItem('injuryDiagnosisData', JSON.stringify(values));
    message.success('Diagnosis submitted successfully.');
    router.push('/recommendations'); // Redirect to recommendations page
  };

  const handlePainIntensityChange = (value: number) => {
    setPainIntensity(value);
  };

  const handlePainTypeChange = (e: any) => {
    setPainType(e.target.value);
  };

  const handleSwellingChange = (e: any) => {
    setSwelling(e.target.value === 'yes');
  };

  const handlePainDurationChange = (e: any) => {
    setPainDuration(e.target.value);
  };

  const goBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-12 bg-gradient-to-r from-blue-200 via-teal-200 to-green-200">
      <div className="flex flex-col items-center justify-center w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg border-2 border-blue-100">
        <h1 className="text-4xl font-bold mb-8 text-center text-teal-700">
          Injury Diagnosis
        </h1>

        <canvas id="canvasOutput" ref={canvasRef} className="w-full mb-8 border-2 border-teal-200 rounded-lg shadow-lg"></canvas>

        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish} 
          className="w-full"
        >
          {/* Pain Intensity */}
          <Form.Item 
            label={<span className="text-teal-700">Pain Intensity (0-10)</span>} 
            name="painIntensity"
            rules={[{ required: true, message: 'Please select a pain intensity.' }]}
          >
            <Slider 
              min={0} 
              max={10} 
              step={0.2} 
              onChange={handlePainIntensityChange} 
              value={painIntensity} 
            />
          </Form.Item>

          {/* Frequency of Pain */}
          <Form.Item 
            label={<span className="text-teal-700">Frequency of Pain</span>} 
            name="painFrequency"
            rules={[{ required: true, message: 'Please select an option for pain frequency.' }]}
          >
            <Radio.Group>
              <Radio value="occasional">Occasional</Radio>
              <Radio value="frequent">Frequent</Radio>
              <Radio value="constant">Constant</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Duration of Pain */}
          <Form.Item 
            label={<span className="text-teal-700">Duration of Pain</span>} 
            name="painDuration"
            rules={[{ required: true, message: 'Please select a pain duration.' }]}
          >
            <Radio.Group onChange={handlePainDurationChange} value={painDuration}>
              <Radio value="less than 1 hour">Less than 1 hour</Radio>
              <Radio value="1-3 hours">1-3 hours</Radio>
              <Radio value="3-6 hours">3-6 hours</Radio>
              <Radio value="more than 6 hours">More than 6 hours</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Swelling */}
          <Form.Item 
            label={<span className="text-teal-700">Is there any swelling?</span>} 
            name="swelling"
            rules={[{ required: true, message: 'Please select an option for swelling.' }]}
          >
            <Radio.Group onChange={handleSwellingChange} value={swelling ? 'yes' : 'no'}>
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Bleeding */}
          <Form.Item 
            label={<span className="text-teal-700">Is there any bleeding?</span>} 
            name="bleeding"
            rules={[{ required: true, message: 'Please select an option for bleeding.' }]}
          >
            <Radio.Group>
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Bruising */}
          <Form.Item 
            label={<span className="text-teal-700">Is there any bruising?</span>} 
            name="bruising"
            rules={[{ required: true, message: 'Please select an option for bruising.' }]}
          >
            <Radio.Group>
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Mobility */}
          <Form.Item 
            label={<span className="text-teal-700">Is there any difficulty in moving the affected area?</span>} 
            name="mobility"
            rules={[{ required: true, message: 'Please select an option for mobility.' }]}
          >
            <Radio.Group>
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Buttons */}
          <Form.Item className="text-center">
            <div className="flex gap-4 justify-center">
              <Button 
                type="primary" 
                htmlType="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
              >
                Submit Diagnosis
              </Button>
              <Button 
                type="default" 
                onClick={goBackToHome}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
              >
                Go Back to Home
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
