import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Compiler from './components/Compiler';
import Snippets from './components/Snippets';
import Navigation from './components/Navigation';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
  }

  #root {
    min-height: 100vh;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  const handleOnError = (error, errorInfo) => {
    console.error('Error caught by boundary:', error, errorInfo);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: 'white',
        background: '#ff6b6b',
        borderRadius: '10px',
        margin: '20px'
      }}>
        <h2>Something went wrong</h2>
        <p>Please refresh the page and try again.</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            background: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <>
      <GlobalStyle />
      <ErrorBoundary>
        <Router>
          <AppContainer>
            <Navigation />
            <MainContent>
              <Routes>
                <Route path="/" element={<Compiler />} />
                <Route path="/snippets" element={<Snippets />} />
                <Route path="*" element={<div style={{ 
                  textAlign: 'center', 
                  color: 'white', 
                  padding: '40px' 
                }}>Page Not Found</div>} />
              </Routes>
            </MainContent>
          </AppContainer>
        </Router>
      </ErrorBoundary>
    </>
  );
}

export default App;