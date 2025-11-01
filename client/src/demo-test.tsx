// Test component to verify API connection
import { useEffect, useState } from 'react';
import { API_BASE } from './lib/api';

export default function DemoTest() {
  const [result, setResult] = useState<string>('Testing...');

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(res => res.json())
      .then(data => {
        setResult(`✅ Backend status: ${JSON.stringify(data)}`);
        console.log('✅ Backend response:', data);
      })
      .catch(err => {
        setResult(`❌ Error: ${err.message}`);
        console.error('❌ Backend error:', err);
      });
  }, []);

  return (
    <div className="p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Backend Connection Test</h1>
      <p>{result}</p>
    </div>
  );
}
