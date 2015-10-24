import React from 'react';
import Header from 'components/Header';

export default function Layout({ children }) {
  return (
    <div className='app--wrapper'>
      <Header />
      <div className='app--content'>
        { children }
      </div>
    </div>
  );
}
