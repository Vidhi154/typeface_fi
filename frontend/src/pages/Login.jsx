import React, { useState, useContext } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" className="w-full p-2 border rounded" />
        <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Password" className="w-full p-2 border rounded" />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
      </form>
    </div>
  );
}
// import React, { useState, useContext } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import api from '../api/api';
// import { AuthContext } from '../contexts/AuthContext';

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login } = useContext(AuthContext);

//   // Get the intended destination from location state
//   const from = location.state?.from?.pathname || '/dashboard';

//   const validateForm = () => {
//     if (!form.email) {
//       setError('Email is required');
//       return false;
//     }
//     if (!form.email.includes('@')) {
//       setError('Please enter a valid email address');
//       return false;
//     }
//     if (!form.password) {
//       setError('Password is required');
//       return false;
//     }
//     if (form.password.length < 6) {
//       setError('Password must be at least 6 characters');
//       return false;
//     }
//     return true;
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await api.post('/auth/login', form);
//       login(response.data.token, response.data.user);
//       navigate(from, { replace: true });
//     } catch (err) {
//       console.error('Login error:', err);
//       setError(
//         err.response?.data?.message || 
//         'Login failed. Please check your credentials and try again.'
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setForm(prev => ({ ...prev, [field]: value }));
//     // Clear error when user starts typing
//     if (error) setError(null);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         {/* Logo and Header */}
//         <div className="text-center">
//           <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
//             <span className="text-white font-bold text-2xl">₹</span>
//           </div>
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">
//             Welcome back
//           </h2>
//           <p className="text-gray-600">
//             Sign in to your Personal Finance account
//           </p>
//         </div>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10">
//           {/* Error Alert */}
//           {error && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <p className="text-red-600 text-sm">{error}</p>
//               </div>
//             </div>
//           )}

//           <form onSubmit={onSubmit} className="space-y-6">
//             {/* Email Field */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 value={form.email}
//                 onChange={e => handleInputChange('email', e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//                 placeholder="Enter your email"
//                 disabled={isLoading}
//                 autoComplete="email"
//                 required
//               />
//             </div>

//             {/* Password Field */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   id="password"
//                   type={showPassword ? 'text' : 'password'}
//                   value={form.password}
//                   onChange={e => handleInputChange('password', e.target.value)}
//                   className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//                   placeholder="Enter your password"
//                   disabled={isLoading}
//                   autoComplete="current-password"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                   disabled={isLoading}
//                 >
//                   {showPassword ? (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
//                     </svg>
//                   ) : (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Remember Me & Forgot Password */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                   Remember me
//                 </label>
//               </div>
//               <button
//                 type="button"
//                 className="text-sm text-blue-600 hover:text-blue-500 font-medium"
//                 onClick={() => {
//                   // TODO: Implement forgot password functionality
//                   alert('Forgot password functionality will be implemented');
//                 }}
//               >
//                 Forgot password?
//               </button>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {isLoading ? (
//                 <div className="flex items-center">
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                   Signing in...
//                 </div>
//               ) : (
//                 'Sign in'
//               )}
//             </button>
//           </form>

//           {/* Sign up link */}
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               Don't have an account?{' '}
//               <Link
//                 to="/register"
//                 className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
//               >
//                 Sign up for free
//               </Link>
//             </p>
//           </div>
//         </div>

//         {/* Demo credentials */}
//         <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//           <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h3>
//           <div className="text-sm text-blue-700">
//             <p><strong>Email:</strong> demo@example.com</p>
//             <p><strong>Password:</strong> demo123</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }