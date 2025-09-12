"use client";
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function signIn() {
    setLoading(true);
    setMessage(null);
    const { data, error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else {
      const firstName = data.user?.user_metadata?.firstName || data.user?.email?.split('@')[0];
      setMessage(`Welcome back, ${firstName}! 👋`);
      // Redirect to dashboard or home
      setTimeout(() => window.location.href = '/', 1500);
    }
    setLoading(false);
  }

  async function signUp() {
    setLoading(true);
    setMessage(null);

    if (!firstName.trim() || !lastName.trim()) {
      setMessage('Please enter your first and last name');
      setLoading(false);
      return;
    }

    const { data, error } = await supabaseBrowser.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          fullName: `${firstName.trim()} ${lastName.trim()}`
        }
      }
    });

    if (error) setMessage(error.message);
    else setMessage(`Welcome ${firstName}! Check your email to confirm your account. 📧`);
    setLoading(false);
  }

  async function signOut() {
    setLoading(true);
    setMessage(null);
    const { error } = await supabaseBrowser.auth.signOut();
    if (error) setMessage(error.message);
    else setMessage('See you later! 👋');
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? 'Join DopeDeals' : 'Welcome Back'}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Create your account to get personalized recommendations'
              : 'Sign in to your account'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isSignUp && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <Input
                  placeholder="John"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <Input
                  placeholder="Doe"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Button
              onClick={isSignUp ? signUp : signIn}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={loading}
              className="w-full"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </Button>

            <Button
              variant="ghost"
              onClick={signOut}
              disabled={loading}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>

          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.includes('error') || message.includes('Error')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

