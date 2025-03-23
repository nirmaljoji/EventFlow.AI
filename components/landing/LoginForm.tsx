import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authService } from '@/app/services/auth';

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
      const response = await authService.login(formData);
      if (response && response.access_token) {
        // Successfully logged in, redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err: any) {
      // Handle different types of error responses
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          err.message || 
                          'An error occurred during login';
      setError(typeof errorMessage === 'string' ? errorMessage : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-5">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">Welcome back</h3>
        <p className="text-slate-500 text-sm mt-1">Sign in to your EventFlow.AI account</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-slate-700">Email address</label>
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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
            <a href="#" className="text-xs text-blue-600 hover:text-blue-800 font-medium">Forgot password?</a>
          </div>
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
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="remember" 
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded" 
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-slate-600">Remember me</label>
        </div>
        
        <Button 
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </div>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-slate-500">Or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107"/>
            <path d="M3.15302 7.3455L6.43852 9.755C7.32752 7.554 9.48052 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15902 2 4.82802 4.1685 3.15302 7.3455Z" fill="#FF3D00"/>
            <path d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3037 18.0011 12 18C9.399 18 7.19052 16.3415 6.35652 14.027L3.09952 16.5395C4.75552 19.778 8.11352 22 12 22Z" fill="#4CAF50"/>
            <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1976D2"/>
          </svg>
          <span className="text-sm font-medium text-slate-700">Google</span>
        </Button>
        <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#1877F2]">
            <path d="M24 12.073c0-5.8-4.702-10.503-10.503-10.503S2.994 6.273 2.994 12.073c0 5.24 3.837 9.59 8.858 10.384v-7.345h-2.668v-3.04h2.668V9.75c0-2.633 1.568-4.085 3.966-4.085 1.15 0 2.35.205 2.35.205v2.584h-1.323c-1.304 0-1.712.81-1.712 1.64v1.97h2.912l-.465 3.04h-2.447v7.344c5.02-.794 8.858-5.145 8.858-10.384z"/>
          </svg>
          <span className="text-sm font-medium text-slate-700">Facebook</span>
        </Button>
      </div>
    </form>
  );
}