import { GoogleOAuthTest } from "@/components/test/GoogleOAuthTest";

export default function TestOAuthPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Google OAuth Connection Test</h1>
          <p className="text-gray-600 mt-2">
            Test apakah Google OAuth sudah terhubung dengan benar
          </p>
        </div>

        <GoogleOAuthTest />

        {/* Configuration Check */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              📋 Configuration Checklist
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span>🔧</span>
                <span>Google Cloud Console - OAuth 2.0 Client configured</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🌐</span>
                <span>Authorized redirect URIs: http://localhost:3000</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔑</span>
                <span>
                  Client ID dan Client Secret di environment variables
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔥</span>
                <span>Firebase Authentication - Google provider enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span className="text-orange-600">
                  Pastikan Firebase config sudah diisi dengan nilai yang benar
                  (bukan placeholder)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Environment Status */}
        <div className="mt-6 max-w-2xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">
              ⚠️ Environment Configuration Needed
            </h3>
            <p className="text-yellow-700 text-sm">
              Saat ini Firebase configuration masih menggunakan placeholder
              values. Untuk test Google OAuth berhasil, Anda perlu:
            </p>
            <ol className="text-yellow-700 text-sm mt-2 ml-4 list-decimal">
              <li>Update Firebase API key di .env file</li>
              <li>Update Firebase Project ID di .env file</li>
              <li>Tambahkan NEXT_PUBLIC_GOOGLE_CLIENT_ID di .env file</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
