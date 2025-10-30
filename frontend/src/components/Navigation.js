import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Code, BookOpen, Home } from 'lucide-react';

const Nav = styled.nav`
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const NavContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #667eea;
  font-size: 1.5rem;
  font-weight: bold;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: ${props => props.active ? '#667eea' : '#666'};
  font-weight: ${props => props.active ? '600' : '500'};
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f8f9fa;
    color: #667eea;
  }
`;

function Navigation() {
  const location = useLocation();

  return (
    <Nav>
      <NavContent>
        <Logo to="/">
          <Code size={24} />
          EBPL Compiler
        </Logo>
        
        <NavLinks>
          <NavLink to="/" active={location.pathname === '/'}>
            <Home size={18} />
            Compiler
          </NavLink>
          <NavLink to="/snippets" active={location.pathname === '/snippets'}>
            <BookOpen size={18} />
            Code Snippets
          </NavLink>
        </NavLinks>
      </NavContent>
    </Nav>
  );
}

export default Navigation;