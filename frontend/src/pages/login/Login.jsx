import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Added useDispatch
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../redux/features/auth/authSlice'; // Import the thunk
import { toast } from 'react-hot-toast'; // Optional: for better alerts

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get loading state from Redux to show a spinner on the button
  const { loading } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Use the Redux Thunk instead of direct axios
    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      const user = resultAction.payload.user;
      toast.success(`Welcome back, ${user.name}`);

      // Route based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/'); 
      }
    } else {
      // Show the error message from your backend
      toast.error(resultAction.payload || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Portal Login</h2>
        <p className="text-slate-400 mb-8 text-sm">Welcome back to SJCH Hospital.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            required
            className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required
            className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            disabled={loading}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:bg-slate-400"
          >
            {loading ? 'Authenticating...' : 'Enter Portal'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New to the portal?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;