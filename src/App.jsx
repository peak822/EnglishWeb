import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Type, Puzzle, HelpCircle, ArrowRight } from 'lucide-react';
import Button from './components/Button';
import Card from './components/Card';
import './App.css';

// Components
import Home from './pages/Home';
import TypingMode from './pages/TypingMode';
import AssembleMode from './pages/AssembleMode';
import GuessMode from './pages/GuessMode';
import ReadMode from './pages/ReadMode';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <nav className="nav-bar">
          <div className="container nav-content">
            <Link to="/" className="nav-logo">
              <BookOpen size={24} />
              <span>English Study</span>
            </Link>
            <div className="nav-links">
              <Link to="/read" className="nav-link">อ่านคำศัพท์</Link>
              <Link to="/typing" className="nav-link">พิมคำศัพท์</Link>
              <Link to="/assemble" className="nav-link">ประกอบคำศัพท์</Link>
              <Link to="/guess" className="nav-link">ทายคำศัพท์</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/read" element={<ReadMode />} />
            <Route path="/typing" element={<TypingMode />} />
            <Route path="/assemble" element={<AssembleMode />} />
            <Route path="/guess" element={<GuessMode />} />
          </Routes>
        </main>

        <footer className="footer container">
          <p>English Study Web App © 2026. Design aesthetic applied.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
