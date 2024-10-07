"use client";

import React, { useState } from 'react';
import { Form, Slider, Radio, Button, message, RadioChangeEvent } from 'antd';
import { useRouter } from 'next/navigation';

interface DiagnosisFormValues {
  painIntensity: number;
  swelling: string;
  painDuration: string;
  mobility: string;
}

export default function InjuryDiagnosisPage() {
  const [form] = Form.useForm();
  const router = useRouter();

  // State for form fields
  const [painIntensity, setPainIntensity] = useState(0);
  const [swelling, setSwelling] = useState(false);
  const [painDuration, setPainDuration] = useState('');
  const [injurySeverity, setInjurySeverity] = useState<string | null>(null); // State to hold the injury severity result
  const [showRecommendationsButton, setShowRecommendationsButton] = useState(false); // State to control when to show recommendations button

  const onFinish = (values: DiagnosisFormValues) => {
    console.log('Form values: ', values);

    // Evaluate injury severity based on form inputs
    const severity = evaluateSeverity(values);
    setInjurySeverity(severity);

    // Save diagnosis data to localStorage
    localStorage.setItem('injuryDiagnosisData', JSON.stringify(values));
    localStorage.setItem('injurySeverity', severity); // Store severity for later use
    message.success('Diagnosis submitted successfully.');

    // After form submission, show the severity message and Check Recommendations button
    setShowRecommendationsButton(true);
  };

  const evaluateSeverity = (values: DiagnosisFormValues): string => {
    // Simple evaluation logic to determine injury severity based on form inputs
    const { painIntensity, swelling, painDuration, mobility } = values;
    if (painIntensity >= 8 || swelling === 'yes' || mobility === 'yes') {
      return 'severe';
    } else if (painIntensity >= 4 || painDuration === '3-6 hours') {
      return 'moderate';
    } else {
      return 'mild';
    }
  };

  const handlePainIntensityChange = (value: number) => {
    setPainIntensity(value);
  };

  const handleSwellingChange = (e: RadioChangeEvent) => {
    setSwelling(e.target.value === 'yes');
  };

  const handlePainDurationChange = (e: RadioChangeEvent) => {
    setPainDuration(e.target.value);
  };

  const goToRecommendations = () => {
    router.push('/recommendations');
  };

  const goBackToHome = () => {
    localStorage.removeItem('injuryImages');
    localStorage.removeItem('injurySeverity');
    localStorage.removeItem('injuryDiagnosisData');
    router.push('/');
  };

  const commonButtonStyles = "w-full max-w-2xl text-2xl font-semibold py-5 rounded-lg shadow-lg transform hover:scale-105 transition-transform";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-16 pb-24 gap-16 bg-gradient-to-r from-blue-200 via-teal-200 to-green-200">
      <div className="flex flex-col items-center justify-center w-full max-w-4xl p-12 bg-white rounded-lg shadow-lg border-2 border-blue-100">
        <h1 className="text-8xl font-bold mb-10 text-center text-teal-700">
          Injury Diagnosis
        </h1>

        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish} 
          className="w-full"
        >
          {/* Pain Intensity */}
          <Form.Item 
            label={<span className="text-teal-700 text-2xl">Pain Intensity (0-10)</span>} 
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
            label={<span className="text-teal-700 text-2xl">Frequency of Pain</span>} 
            name="painFrequency"
            rules={[{ required: true, message: 'Please select an option for pain frequency.' }]}
          >
            <Radio.Group className="text-teal-700">
              <Radio value="occasional">Occasional</Radio>
              <Radio value="frequent">Frequent</Radio>
              <Radio value="constant">Constant</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Duration of Pain */}
          <Form.Item 
            label={<span className="text-teal-700 text-2xl">Duration of Pain</span>} 
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
            label={<span className="text-teal-700 text-2xl">Is there any swelling?</span>} 
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
            label={<span className="text-teal-700 text-2xl">Is there any bleeding?</span>} 
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
            label={<span className="text-teal-700 text-2xl">Is there any bruising?</span>} 
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
            label={<span className="text-teal-700 text-2xl">Is there any difficulty in moving the affected area?</span>} 
            name="mobility"
            rules={[{ required: true, message: 'Please select an option for mobility.' }]}
          >
            <Radio.Group>
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item className="text-center mt-16">
            <Button 
              type="primary" 
              htmlType="submit"
              className={`${commonButtonStyles} bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-r hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white`}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>

        {injurySeverity && (
          <>
            <div className="text-center mt-8">
              <h2 className="text-2xl font-semibold text-teal-800 mb-4">
                Your injury is: <span className="text-teal-600">{injurySeverity}</span>. Please check recommendations below.
              </h2>
            </div>

            {showRecommendationsButton && (
              <div className="text-center mt-8">
                <Button
                  type="dashed"
                  onClick={goToRecommendations}
                  className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:bg-gradient-to-r hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white text-2xl font-semibold py-5 w-full max-w-2xl rounded-lg shadow-lg transform hover:scale-105 transition-transform"
                >
                  Check Recommendations
                </Button>
              </div>
            )}
          </>
        )}

        <div className="mt-5 flex flex-col gap-8 items-center w-full">
          <Button 
            type="default"
            onClick={goBackToHome}
            className="bg-pink-500 hover:bg-pink-600 text-white text-2xl font-semibold py-5 w-full max-w-2xl rounded-lg shadow-lg transform hover:scale-105 transition-transform"
          >
            Go Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
