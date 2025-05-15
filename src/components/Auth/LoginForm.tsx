import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Anchor, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import FormField from '../Common/FormField';
import ActionButton from '../Common/ActionButton';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { email, password } = formData;
    const success = await login(email, password);
    
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div className="flex justify-center">
            <Anchor className="h-12 w-12 text-teal-500" />
          </div>
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ENTNT Marine
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ship Maintenance Dashboard
          </p>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}
            
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@entnt.in"
              required
            />
            
            <FormField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <div className="font-medium text-teal-600 hover:text-teal-500">
                  Demo accounts:
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600 divide-y">
              <div className="py-2">
                <div className="font-medium">Admin:</div>
                <div>Email: admin@entnt.in</div>
                <div>Password: admin123</div>
              </div>
              <div className="py-2">
                <div className="font-medium">Inspector:</div>
                <div>Email: inspector@entnt.in</div>
                <div>Password: inspect123</div>
              </div>
              <div className="py-2">
                <div className="font-medium">Engineer:</div>
                <div>Email: engineer@entnt.in</div>
                <div>Password: engine123</div>
              </div>
            </div>
            
            <div>
              <ActionButton
                text="Sign In"
                onClick={() => {}}
                type="submit"
                icon={<LogIn className="h-4 w-4" />}
                disabled={isLoading}
                fullWidth
              />
            </div>
          </form>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 sm:px-10">
          <p className="text-xs text-center text-gray-500">
            © 2025 ENTNT Marine. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;