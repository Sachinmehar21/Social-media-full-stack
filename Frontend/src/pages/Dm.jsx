import React from 'react';
import { Link } from 'react-router-dom';

const Dm = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: 'black',
      margin: 0,
      padding: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        width: '100%',
        maxWidth: '400px',
        padding: '0 20px'
      }}>
        <img
          src="https://i.pinimg.com/736x/0b/ae/11/0bae116d0cb591cee3cba8b7aac902a2.jpg"
          alt="Feature coming soon"
          style={{
            width: '160px',
            height: '160px',
            marginBottom: '32px',
            borderRadius: '12px',
            animation: 'bounce 3s infinite'
          }}
        />
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '8px' }}>Uh Oh! 😅</h1>
        <p style={{ fontSize: '1.125rem', marginBottom: '24px' }}>
          This feature isn't ready yet.<br />We're working on something awesome for you!
        </p>
        <Link
          to="/"
          style={{
            padding: '8px 24px',
            backgroundColor: 'white',
            color: 'black',
            borderRadius: '9999px',
            textDecoration: 'none',
            transition: 'background-color 0.3s',
            fontWeight: '500'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e5e5e5'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
        >
          Go back home
        </Link>
      </div>
      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          body, html {
            margin: 0;
            padding: 0;
            background-color: black;
            overflow: hidden;
          }
        `}
      </style>
    </div>
  );
};

export default Dm;