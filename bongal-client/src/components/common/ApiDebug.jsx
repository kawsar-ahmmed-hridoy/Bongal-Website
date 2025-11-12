// components/common/ApiDebug.jsx
import { useEffect, useState } from 'react';
import { productService } from '../../services/productService';

const ApiDebug = () => {
  const [status, setStatus] = useState('Testing...');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('🔍 Testing API connection...');
        const result = await productService.getAllProducts();
        console.log('✅ API Test Result:', result);
        setData(result);
        setStatus('✅ API Connected Successfully');
      } catch (err) {
        console.error('❌ API Test Error:', err);
        setError(err.message);
        setStatus('❌ API Connection Failed');
      }
    };

    testApi();
  }, []);

  return (
    <div className="p-4 bg-gray-100 border rounded-lg m-4">
      <h3 className="font-bold text-lg mb-2">API Debug Information</h3>
      <p className="mb-2"><strong>Status:</strong> {status}</p>
      {error && <p className="text-red-600"><strong>Error:</strong> {error}</p>}
      {data && (
        <div>
          <p><strong>Data Received:</strong> {JSON.stringify(data).substring(0, 200)}...</p>
          <p><strong>Data Type:</strong> {Array.isArray(data) ? 'Array' : typeof data}</p>
          <p><strong>Data Keys:</strong> {Object.keys(data).join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default ApiDebug;