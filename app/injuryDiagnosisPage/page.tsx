"use client";

import React, { useState } from 'react';
import { Form, Slider, Radio, Button, message } from 'antd';
import { useRouter } from 'next/navigation';

export default function InjuryDiagnosisPage() {
  const [form] = Form.useForm();
  const router = useRouter();

  // State for form fields
  const [painIntensity, setPainIntensity] = useState(0);
  const [painType, setPainType] = useState('sharp');
  const [swelling, setSwelling] = useState(false);
  const [painDuration, setPainDuration] = useState('');

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
    <div className="container mx-auto p-8">
      <h1 style={{ fontSize: '32px', marginBottom: '20px', textAlign: 'center' }}>Injury Diagnosis</h1>

      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish} 
      >
        {/* Pain Intensity */}
        <Form.Item 
          label={`Pain Intensity`} 
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
          label="How frequently are you experiencing pain?" 
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
          label="Duration of Pain" 
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
          label="Is there any swelling?" 
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
          label="Is there any bleeding?" 
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
          label="Is there any bruising?" 
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
          label="Is there any difficulty in moving the affected area?" 
          name="mobility"
          rules={[{ required: true, message: 'Please select an option for mobility.' }]}
        >
          <Radio.Group>
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Radio.Group>
        </Form.Item>

        {/* Buttons */}
        <Form.Item>
          <div className="flex gap-4">
            <Button type="primary" htmlType="submit">
              Submit Diagnosis
            </Button>
            <Button type="default" onClick={goBackToHome}>
              Go Back to Home
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
