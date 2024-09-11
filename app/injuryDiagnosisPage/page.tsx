"use client";

import React, { useState } from 'react';
import { Form, Slider, Radio, Button, message } from 'antd';
import { useRouter } from 'next/navigation';

export default function InjuryDiagnosisPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [painIntensity, setPainIntensity] = useState(0);
  const [painType, setPainType] = useState('sharp');
  const [swelling, setSwelling] = useState(false);

  const onFinish = (values: any) => {
    console.log('Form values: ', values);
    message.success('Diagnosis submitted successfully.');
    router.push('/recommendations');
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

  const goBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 style={{ fontSize: '32px', marginBottom: '20px', textAlign: 'center' }}>Injury Diagnosis</h1>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Pain Intensity */}
        <Form.Item label="Pain Intensity (1-10)">
          <Slider min={1} max={10} onChange={handlePainIntensityChange} value={painIntensity} />
        </Form.Item>

        {/* Type of Pain */}
        <Form.Item label="Type of Pain">
          <Radio.Group onChange={handlePainTypeChange} value={painType}>
            <Radio value="sharp">Sharp</Radio>
            <Radio value="burning">Burning</Radio>
            <Radio value="dull">Dull</Radio>
          </Radio.Group>
        </Form.Item>

        {/* Swelling */}
        <Form.Item label="Is there any swelling?">
          <Radio.Group onChange={handleSwellingChange}>
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Radio.Group>
        </Form.Item>

        {/* Bleeding */}
        <Form.Item label="Is there any bleeding?">
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
