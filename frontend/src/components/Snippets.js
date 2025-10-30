import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Copy, Play, Calendar } from 'lucide-react';

const SnippetsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const SnippetGrid = styled.div`
  display: grid;
  gap: 20px;
  margin-top: 20px;
`;

const SnippetCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const SnippetTitle = styled.h3`
  color: #2d3748;
  margin-bottom: 10px;
`;

const SnippetDescription = styled.p`
  color: #666;
  margin-bottom: 15px;
`;

const SnippetCode = styled.pre`
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 15px;
  border-radius: 8px;
  font-size: 14px;
  overflow-x: auto;
  margin-bottom: 15px;
`;

const SnippetMeta = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  color: #888;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #667eea;
  color: white;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #5a6fd8;
  }
`;

function Snippets() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      const response = await axios.get('/api/snippets');
      setSnippets(response.data);
    } catch (error) {
      console.error('Failed to fetch snippets:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  if (loading) {
    return <div>Loading snippets...</div>;
  }

  return (
    <SnippetsContainer>
      <h2>📚 EBPL Code Snippets</h2>
      <p>Browse and learn from community examples</p>

      <SnippetGrid>
        {snippets.map(snippet => (
          <SnippetCard key={snippet._id}>
            <SnippetTitle>{snippet.title}</SnippetTitle>
            <SnippetDescription>{snippet.description}</SnippetDescription>
            
            <SnippetCode>{snippet.sourceCode}</SnippetCode>
            
            <SnippetMeta>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={14} />
                {new Date(snippet.createdAt).toLocaleDateString()}
              </div>
            </SnippetMeta>

            <ButtonGroup>
              <Button onClick={() => copyToClipboard(snippet.sourceCode)}>
                <Copy size={16} />
                Copy Code
              </Button>
            </ButtonGroup>
          </SnippetCard>
        ))}
      </SnippetGrid>

      {snippets.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No snippets found. Be the first to create one!
        </div>
      )}
    </SnippetsContainer>
  );
}

export default Snippets;