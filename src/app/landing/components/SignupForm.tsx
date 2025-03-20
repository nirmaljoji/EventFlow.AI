import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authService } from '@/app/services/auth';

export function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.signup(formData);
      if (response && response.access_token) {
        // Successfully signed up, redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-5">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">Create your account</h3>
        <p className="text-slate-500 text-sm mt-1">Start your free 14-day trial today</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-slate-700">First name</label>
            <Input 
              id="firstName" 
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name" 
              className="w-full border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-slate-700">Last name</label>
            <Input 
              id="lastName" 
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name" 
              className="w-full border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-slate-700">Work email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <Input 
              type="email" 
              id="username" 
              value={formData.username}
              onChange={handleChange}
              placeholder="name@company.com" 
              className="pl-10 w-full border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">Create password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <Input 
              type="password" 
              id="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••" 
              className="pl-10 w-full border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              required
            />
          </div>
          <div className="mt-1 flex gap-1">
            <span className="h-1 w-1/4 rounded-full bg-blue-200"></span>
            <span className="h-1 w-1/4 rounded-full bg-blue-300"></span>
            <span className="h-1 w-1/4 rounded-full bg-blue-400"></span>
            <span className="h-1 w-1/4 rounded-full bg-slate-200"></span>
            <p className="text-xs text-slate-500 ml-1">Good</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input 
              id="terms" 
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded" 
              required
            />
          </div>
          <div className="ml-2 text-sm">
            <label htmlFor="terms" className="text-slate-600">
              I agree to the <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Privacy Policy</a>
            </label>
          </div>
        </div>
        
        <Button 
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </div>
    </form>
  );
}