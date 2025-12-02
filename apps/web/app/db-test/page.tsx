// apps/web/app/db-test/page.tsx
'use client';

import { useState } from 'react';
import { checkDatabaseConnection } from '../actions/health-check';

export default function DbTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);
    
    // Server Action 호출
    const data = await checkDatabaseConnection();
    
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
      <h1 className="text-2xl font-bold">Database Connection Test</h1>
      
      <button
        onClick={handleCheck}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '연결 확인 중...' : 'DB 연결 테스트 실행'}
      </button>

      {/* 결과 출력 영역 */}
      <div className="w-full max-w-md p-4 bg-gray-100 rounded border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="font-semibold mb-2">Result:</h3>
        <pre className="text-sm overflow-auto whitespace-pre-wrap">
          {result ? JSON.stringify(result, null, 2) : '버튼을 눌러 확인하세요.'}
        </pre>
      </div>
    </div>
  );
}