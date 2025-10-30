import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Play, Save, RotateCcw, BookOpen, X } from 'lucide-react';

// Styled Components
const CompilerContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  height: 80vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

const Panel = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const EditorPanel = styled(Panel)``;

const ResultsPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TextArea = styled.textarea`
  flex: 1;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  padding: 16px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  min-height: 300px;

  &:focus {
    border-color: #667eea;
  }
`;

const OutputArea = styled.pre`
  flex: 1;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  padding: 16px;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  overflow: auto;
  white-space: pre-wrap;
  min-height: 200px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  padding: 8px 16px;
  border: none;
  background: ${props => props.active ? '#667eea' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#5a6fd8' : '#e9ecef'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: ${props => {
    switch (props.variant) {
      case 'primary': return '#667eea';
      case 'success': return '#28a745';
      case 'warning': return '#ffc107';
      case 'info': return '#17a2b8';
      case 'danger': return '#dc3545';
      default: return '#6c757d';
    }
  }};
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Title = styled.h2`
  color: #2d3748;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatusMessage = styled.div`
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 15px;
  background: ${props => props.type === 'error' ? '#fee2e2' : '#d1fae5'};
  color: ${props => props.type === 'error' ? '#dc2626' : '#065f46'};
  border: 1px solid ${props => props.type === 'error' ? '#fecaca' : '#a7f3d0'};
`;

// Examples Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 0;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #2d3748;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
`;

const ExamplesSidebar = styled.div`
  width: 250px;
  border-right: 1px solid #e1e5e9;
  background: #f8f9fa;
  overflow-y: auto;
`;

const ExampleCategory = styled.div`
  padding: 15px 20px;
  cursor: pointer;
  border-bottom: 1px solid #e1e5e9;
  background: ${props => props.active ? '#667eea' : 'transparent'};
  color: ${props => props.active ? 'white' : '#333'};
  font-weight: ${props => props.active ? '600' : '500'};
  
  &:hover {
    background: ${props => props.active ? '#5a6fd8' : '#e9ecef'};
  }
`;

const ExampleItem = styled.div`
  padding: 12px 20px 12px 35px;
  cursor: pointer;
  border-bottom: 1px solid #e1e5e9;
  background: ${props => props.active ? '#e3f2fd' : 'transparent'};
  font-weight: ${props => props.active ? '600' : '400'};
  
  &:hover {
    background: #e9ecef;
  }
`;

const ExampleContent = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const ExampleCode = styled.pre`
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 20px;
  border-radius: 8px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  overflow-x: auto;
  white-space: pre-wrap;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const ExampleDescription = styled.div`
  background: #e3f2fd;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #2196f3;
`;

const CopyButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #218838;
  }
`;

// Example Data
const exampleCategories = {
  basics: {
    name: '📚 Basic Syntax',
    examples: [
      {
        name: 'Hello World',
        code: `print "Hello, EBPL World!"`,
        description: 'The simplest EBPL program - printing a message.'
      },
      {
        name: 'Variables',
        code: `create variable name with value "Alice"
create variable age with value 25
print name
print age`,
        description: 'Creating and using variables with different data types.'
      },
      {
        name: 'Basic Math',
        code: `create variable a with value 10
create variable b with value 5
print a + b
print a - b
print a * b
print a / b`,
        description: 'Basic arithmetic operations with variables.'
      }
    ]
  },
  variables: {
    name: '🔢 Variables & Data Types',
    examples: [
      {
        name: 'Number Variables',
        code: `create variable integer with value 42
create variable decimal with value 3.14
create variable negative with value -10
print integer
print decimal
print negative`,
        description: 'Working with different numeric data types.'
      },
      {
        name: 'String Variables',
        code: `create variable greeting with value "Hello"
create variable name with value "World"
create variable message with value greeting + " " + name
print message`,
        description: 'String concatenation and manipulation.'
      },
      {
        name: 'Boolean Logic',
        code: `create variable is_sunny with value 1
create variable is_weekend with value 0

if is_sunny is equal to 1 then
    print "It's sunny today!"
end if

if is_weekend is equal to 0 then
    print "It's a weekday"
end if`,
        description: 'Using boolean values (1 for true, 0 for false) in conditions.'
      }
    ]
  },
  control: {
    name: '⚙️ Control Structures',
    examples: [
      {
        name: 'If-Else Statement',
        code: `create variable score with value 85

if score is greater than 90 then
    print "Grade: A+"
else if score is greater than 80 then
    print "Grade: A"
else if score is greater than 70 then
    print "Grade: B"
else
    print "Grade: C"
end if`,
        description: 'Conditional logic with multiple branches.'
      },
      {
        name: 'While Loop',
        code: `create variable counter with value 1

while counter is less than 6 do
    print "Count: " + counter
    create variable counter with value counter + 1
end while

print "Loop finished!"`,
        description: 'Repeating code execution with a while loop.'
      },
      {
        name: 'Nested Conditions',
        code: `create variable age with value 20
create variable has_license with value 1

if age is greater than 18 then
    if has_license is equal to 1 then
        print "You can drive a car!"
    else
        print "You need a license to drive"
    end if
else
    print "You are too young to drive"
end if`,
        description: 'Complex conditional logic with nested if statements.'
      }
    ]
  },
  math: {
    name: '🧮 Math Operations',
    examples: [
      {
        name: 'Calculator',
        code: `create variable num1 with value 15
create variable num2 with value 3

create variable addition with value num1 + num2
create variable subtraction with value num1 - num2
create variable multiplication with value num1 * num2
create variable division with value num1 / num2

print "Calculator Results:"
print addition
print subtraction
print multiplication
print division`,
        description: 'Complete calculator with all basic operations.'
      },
      {
        name: 'Complex Expressions',
        code: `create variable a with value 10
create variable b with value 5
create variable c with value 2

create variable result1 with value (a + b) * c
create variable result2 with value a * b + c * 3
create variable result3 with value (a - b) / c

print result1
print result2
print result3`,
        description: 'Mathematical expressions with operator precedence.'
      },
      {
        name: 'Temperature Converter',
        code: `create variable celsius with value 25
create variable fahrenheit with value (celsius * 9/5) + 32

print celsius + "°C = " + fahrenheit + "°F"

if celsius is greater than 30 then
    print "It's a hot day!"
else if celsius is less than 10 then
    print "It's a cold day!"
else
    print "The weather is pleasant!"
end if`,
        description: 'Practical example with temperature conversion and conditions.'
      }
    ]
  },
  practical: {
    name: '🚀 Practical Examples',
    examples: [
      {
        name: 'Student Grading',
        code: `create variable student_name with value "Alice"
create variable math_score with value 92
create variable science_score with value 88
create variable english_score with value 95

create variable total_score with value math_score + science_score + english_score
create variable average_score with value total_score / 3

print "Student Report Card:"
print "Name: " + student_name
print "Total Score: " + total_score
print "Average Score: " + average_score

if average_score is greater than 90 then
    print "Grade: A+ - Excellent!"
else if average_score is greater than 80 then
    print "Grade: A - Very Good!"
else if average_score is greater than 70 then
    print "Grade: B - Good!"
else
    print "Grade: C - Needs Improvement"
end if`,
        description: 'Complete student grading system with report generation.'
      },
      {
        name: 'Shopping Cart',
        code: `create variable item1_price with value 25.50
create variable item2_price with value 15.75
create variable item3_price with value 8.99

create variable subtotal with value item1_price + item2_price + item3_price
create variable tax with value subtotal * 0.08
create variable total with value subtotal + tax

print "🛒 Shopping Cart Summary"
print "Item 1: $" + item1_price
print "Item 2: $" + item2_price
print "Item 3: $" + item3_price
print "-------------------"
print "Subtotal: $" + subtotal
print "Tax (8%): $" + tax
print "Total: $" + total

if total is greater than 50 then
    print "🎉 You qualify for free shipping!"
else
    print "➕ Add $" + (50 - total) + " more for free shipping"
end if`,
        description: 'Shopping cart system with tax calculation and conditional offers.'
      },
      {
        name: 'Fibonacci Sequence',
        code: `create variable a with value 0
create variable b with value 1
create variable count with value 1

print "Fibonacci Sequence:"

while count is less than 10 do
    print a
    create variable next with value a + b
    create variable a with value b
    create variable b with value next
    create variable count with value count + 1
end while`,
        description: 'Generating Fibonacci sequence using a while loop.'
      }
    ]
  }
};

function Compiler() {
  const [sourceCode, setSourceCode] = useState('');
  const [activeTab, setActiveTab] = useState('output');
  const [output, setOutput] = useState('');
  const [tokens, setTokens] = useState([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('basics');
  const [selectedExample, setSelectedExample] = useState(0);

  React.useEffect(() => {
    // Load a basic example when component mounts
    setSourceCode(exampleCategories.basics.examples[0].code);
  }, []);

  const compileCode = async () => {
    setLoading(true);
    setError('');
    setOutput('');
    setTokens([]);
    setGeneratedCode('');
    
    try {
      const response = await axios.post('/api/compiler/compile', {
        sourceCode
      });

      if (response.data.success) {
        setTokens(response.data.tokens || []);
        setGeneratedCode(response.data.generatedCode || '');
        
        // Show execution output if available
        if (response.data.executionOutput && response.data.executionOutput.trim()) {
          setOutput(response.data.executionOutput);
        } else if (response.data.executionError && response.data.executionError.trim()) {
          setOutput(`Execution Error:\n${response.data.executionError}`);
        } else {
          setOutput('✅ Compilation successful! No output generated.\nCheck the "Generated Code" tab to see the Python code.');
        }
      } else {
        setError(response.data.error || 'Compilation failed');
        setOutput(`❌ Compilation Error: ${response.data.error}`);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to connect to compiler server';
      setError(errorMsg);
      setOutput(`❌ Connection Error: ${errorMsg}\n\nMake sure the backend server is running on port 5000.`);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setSourceCode('');
    setOutput('');
    setTokens([]);
    setGeneratedCode('');
    setError('');
  };

  const saveSnippet = async () => {
    try {
      await axios.post('/api/snippets', {
        title: 'EBPL Snippet',
        description: 'Generated from compiler',
        sourceCode,
        tags: ['ebpl', 'example']
      });
      alert('Snippet saved successfully!');
    } catch (err) {
      alert('Failed to save snippet');
    }
  };

  const loadExample = (category, exampleIndex) => {
    const example = exampleCategories[category].examples[exampleIndex];
    setSourceCode(example.code);
    setShowExamples(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Code copied to clipboard!');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'output':
        return <OutputArea>{output || 'Output will appear here after compilation...'}</OutputArea>;
      case 'tokens':
        return (
          <OutputArea>
            {tokens.length > 0 ? tokens.join('\n') : 'No tokens generated yet...'}
          </OutputArea>
        );
      case 'generated':
        return <OutputArea>{generatedCode || 'No generated code yet...'}</OutputArea>;
      default:
        return <OutputArea>{output}</OutputArea>;
    }
  };

  const currentExamples = exampleCategories[selectedCategory];

  return (
    <div>
      <Title>🎯 EBPL Online Compiler</Title>
      
      <CompilerContainer>
        <EditorPanel>
          <h3>EBPL Code Editor</h3>
          <TextArea
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            placeholder="Enter your EBPL code here... or click 'Example Codes' to get started!"
            spellCheck="false"
          />
          
          {error && (
            <StatusMessage type="error">{error}</StatusMessage>
          )}

          <ButtonGroup>
            <Button 
              variant="primary" 
              onClick={compileCode}
              disabled={loading}
            >
              <Play size={18} />
              {loading ? 'Compiling...' : 'Compile & Run'}
            </Button>
            
            <Button variant="info" onClick={() => setShowExamples(true)}>
              <BookOpen size={18} />
              Example Codes
            </Button>
            
            <Button variant="success" onClick={saveSnippet}>
              <Save size={18} />
              Save Snippet
            </Button>
            
            <Button variant="warning" onClick={clearAll}>
              <RotateCcw size={18} />
              Clear All
            </Button>
          </ButtonGroup>
        </EditorPanel>

        <ResultsPanel>
          <h3>Compilation Results</h3>
          
          <TabContainer>
            <Tab 
              active={activeTab === 'output'} 
              onClick={() => setActiveTab('output')}
            >
              Output
            </Tab>
            <Tab 
              active={activeTab === 'tokens'} 
              onClick={() => setActiveTab('tokens')}
            >
              Tokens
            </Tab>
            <Tab 
              active={activeTab === 'generated'} 
              onClick={() => setActiveTab('generated')}
            >
              Generated Code
            </Tab>
          </TabContainer>

          {renderContent()}
        </ResultsPanel>
      </CompilerContainer>

      {/* Examples Modal */}
      <ModalOverlay show={showExamples} onClick={() => setShowExamples(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>📚 EBPL Example Codes</ModalTitle>
            <CloseButton onClick={() => setShowExamples(false)}>
              <X size={24} />
            </CloseButton>
          </ModalHeader>
          <ModalBody>
            <ExamplesSidebar>
              {Object.entries(exampleCategories).map(([key, category]) => (
                <ExampleCategory
                  key={key}
                  active={selectedCategory === key}
                  onClick={() => {
                    setSelectedCategory(key);
                    setSelectedExample(0);
                  }}
                >
                  {category.name}
                </ExampleCategory>
              ))}
            </ExamplesSidebar>
            <ExampleContent>
              {currentExamples && (
                <>
                  <ExampleDescription>
                    <h4>{currentExamples.examples[selectedExample].name}</h4>
                    <p>{currentExamples.examples[selectedExample].description}</p>
                  </ExampleDescription>
                  
                  <ExampleCode>
                    {currentExamples.examples[selectedExample].code}
                  </ExampleCode>
                  
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <CopyButton 
                      onClick={() => copyToClipboard(currentExamples.examples[selectedExample].code)}
                    >
                      📋 Copy Code
                    </CopyButton>
                    <Button 
                      variant="primary" 
                      onClick={() => loadExample(selectedCategory, selectedExample)}
                    >
                      🚀 Load in Editor
                    </Button>
                  </div>
                  
                  <div style={{ marginTop: '20px' }}>
                    <h4>Other examples in this category:</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {currentExamples.examples.map((example, index) => (
                        <ExampleItem
                          key={index}
                          active={selectedExample === index}
                          onClick={() => setSelectedExample(index)}
                        >
                          {example.name}
                        </ExampleItem>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </ExampleContent>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </div>
  );
}

export default Compiler;
