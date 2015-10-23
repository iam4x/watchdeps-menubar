import React from 'react';

export default function Layout({ children }) {
  return (
    <div className='container-fluid'>
      { children }
    </div>
  );
}
