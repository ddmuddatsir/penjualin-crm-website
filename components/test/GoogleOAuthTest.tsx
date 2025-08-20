"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export function GoogleOAuthTest() {
  const [testResult, setTestResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, user, signOut } = useAuth();

  const testGoogleOAuth = async () => {
    setIsLoading(true);
    setTestResult("Testing Google OAuth...");

    try {
      await signInWithGoogle();
      setTestResult("✅ Google OAuth berhasil! User signed in.");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setTestResult(`❌ Error: ${errorMessage}`);
      console.error("Google OAuth Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const testSignOut = async () => {
    try {
      await signOut();
      setTestResult("✅ Sign out berhasil!");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setTestResult(`❌ Sign out error: ${errorMessage}`);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>🧪 Google OAuth Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Environment Variables Check */}
        <div className="space-y-2">
          <h3 className="font-semibold">Environment Variables:</h3>
          <div className="text-sm space-y-1">
            <div>
              Google Client ID:{" "}
              {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? "✅" : "❌"}
              {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
                ? `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.substring(
                    0,
                    20
                  )}...`
                : "Not configured"}
            </div>
            <div>
              Firebase API Key:{" "}
              {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅" : "❌"}
              {process.env.NEXT_PUBLIC_FIREBASE_API_KEY !==
              "your_firebase_api_key_here"
                ? "Configured"
                : "Default value"}
            </div>
            <div>
              Firebase Project ID:{" "}
              {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✅" : "❌"}
              {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !==
              "your_project_id_here"
                ? "Configured"
                : "Default value"}
            </div>
          </div>
        </div>

        {/* User Status */}
        <div className="space-y-2">
          <h3 className="font-semibold">User Status:</h3>
          <div className="text-sm">
            {user ? (
              <div className="space-y-1">
                <div>✅ Signed in as: {user.displayName}</div>
                <div>📧 Email: {user.email}</div>
                <div>🖼️ Photo: {user.photoURL ? "✅" : "❌"}</div>
                <div>🆔 UID: {user.uid.substring(0, 8)}...</div>
              </div>
            ) : (
              <div>❌ Not signed in</div>
            )}
          </div>
        </div>

        {/* Test Buttons */}
        <div className="space-y-2">
          {!user ? (
            <Button
              onClick={testGoogleOAuth}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Testing..." : "🧪 Test Google Sign In"}
            </Button>
          ) : (
            <Button onClick={testSignOut} variant="outline" className="w-full">
              🚪 Test Sign Out
            </Button>
          )}
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-semibold mb-2">Test Result:</h3>
            <div className="text-sm whitespace-pre-wrap">{testResult}</div>
          </div>
        )}

        {/* Additional Debug Info */}
        <div className="space-y-2">
          <h3 className="font-semibold">Debug Info:</h3>
          <div className="text-xs bg-gray-100 p-2 rounded">
            <div>
              Window location:{" "}
              {typeof window !== "undefined" ? window.location.origin : "SSR"}
            </div>
            <div>Node ENV: {process.env.NODE_ENV}</div>
            <div>
              Auth State: {user ? "Authenticated" : "Not authenticated"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
