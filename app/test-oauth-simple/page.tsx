export default function TestOAuthSimple() {
  // Simple redirect to login page untuk test
  if (typeof window !== "undefined") {
    console.log("🧪 Testing environment variables on client side:");
    console.log(
      "NEXT_PUBLIC_GOOGLE_CLIENT_ID:",
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    );
    console.log(
      "NEXT_PUBLIC_FIREBASE_API_KEY:",
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    );
    console.log(
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID:",
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">🧪 OAuth Test Results</h1>

          <div className="space-y-4">
            <div>
              <h2 className="font-semibold mb-2">Environment Variables:</h2>
              <div className="text-sm space-y-1 bg-gray-100 p-3 rounded">
                <div>
                  <strong>Google Client ID:</strong>
                  <span className="ml-2 font-mono text-xs">
                    {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "NOT SET"}
                  </span>
                </div>
                <div>
                  <strong>Firebase API Key:</strong>
                  <span className="ml-2 font-mono text-xs">
                    {process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "NOT SET"}
                  </span>
                </div>
                <div>
                  <strong>Firebase Project ID:</strong>
                  <span className="ml-2 font-mono text-xs">
                    {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "NOT SET"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-2">Test Status:</h2>
              <div className="space-y-2">
                {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <span>✅</span>
                    <span>Google Client ID loaded</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <span>❌</span>
                    <span>Google Client ID missing</span>
                  </div>
                )}

                {process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
                process.env.NEXT_PUBLIC_FIREBASE_API_KEY !==
                  "your_firebase_api_key_here" ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <span>✅</span>
                    <span>Firebase API Key configured</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-orange-600">
                    <span>⚠️</span>
                    <span>
                      Firebase API Key using default/placeholder value
                    </span>
                  </div>
                )}

                {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
                process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !==
                  "your_project_id_here" ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <span>✅</span>
                    <span>Firebase Project ID configured</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-orange-600">
                    <span>⚠️</span>
                    <span>
                      Firebase Project ID using default/placeholder value
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <h2 className="font-semibold mb-2">Next Steps:</h2>
              <div className="text-sm space-y-1">
                <div>
                  1. Pastikan Firebase config sudah diisi dengan nilai real
                </div>
                <div>2. Test Google OAuth di halaman login</div>
                <div>3. Cek browser console untuk error Firebase</div>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href="/login"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                🚀 Go to Login Page
              </a>
              <a
                href="/test-oauth"
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                🧪 Advanced Test
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
