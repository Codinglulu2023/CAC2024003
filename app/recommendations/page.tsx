"use client";

import React from 'react';
import { Button, Card } from 'antd';
import { useRouter } from 'next/navigation';

const recommendationsData = [
  {
    id: 1,
    title: 'Immediate Self-Care',
    description: 'Apply ice to the affected area for 15-20 minutes every hour for the first 48 hours. Rest the injured area and avoid any strenuous activity.',
  },
  {
    id: 2,
    title: 'Pain Management',
    description: 'Take over-the-counter pain medication like ibuprofen to reduce swelling and pain. Consult with a healthcare provider if pain persists.',
  },
  {
    id: 3,
    title: 'Rehabilitation Exercises',
    description: 'Start gentle stretching exercises once the swelling and pain have subsided. Consult with a physical therapist for proper recovery routines.',
  },
  {
    id: 4,
    title: 'Red Alert',
    description: 'If the pain is severe or you notice an unusual symptom like numbness or tingling, visit urgent care immediately. The location of nearby urgent care centers is shown below.',
  },
];

export default function Recommendations() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/injuryDiagnosisPage');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 style={{ fontSize: '32px', marginBottom: '20px', textAlign: 'center' }}>Injury Recommendations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendationsData.map((item) => (
          <Card key={item.id} title={item.title} bordered={true}>
            <p>{item.description}</p>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button type="primary" onClick={handleGoBack}>
          Go Back to Injury Diagnosis
        </Button>
      </div>

      <div className="mt-10">
        <h2 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '20px' }}>Urgent Care Locations</h2>
        <iframe
          title="Urgent Care Locations"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48382.22517449554!2d-73.13471334498257!3d40.91534517251402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e8454c8ebc2ff7%3A0x2a0493e2339c2cf4!2sUrgent%20Care!5e0!3m2!1sen!2sus!4v1684452255095!5m2!1sen!2sus"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
