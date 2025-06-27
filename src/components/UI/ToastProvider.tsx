import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        className: '',
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          fontSize: '14px',
          padding: '12px 16px',
          borderRadius: '8px',
          maxWidth: '500px',
          wordBreak: 'break-word',
        },
        
        // Custom options for different types
        success: {
          duration: 3000,
          style: {
            background: '#10b981',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
          },
        },
        
        error: {
          duration: 6000,
          style: {
            background: '#ef4444',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
          },
        },
        
        loading: {
          duration: Infinity,
          style: {
            background: '#3b82f6',
            color: '#fff',
          },
        },
      }}
    />
  );
};

export default ToastProvider;