import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaRegUserCircle } from 'react-icons/fa';

import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOutsideClick = e => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [dropdownOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">VidiZone</div>
      <div className="navbar-search">
        <input type="text" placeholder="Search" className="navbar-search-input" />
        <button className="navbar-search-button">
          <FaSearch />
        </button>
      </div>
      <div className="navbar-dropdown" ref={dropdownRef}>
        <button className="navbar-dropdown-toggle" onClick={handleDropdownToggle}>
          <FaRegUserCircle />
        </button>
        {dropdownOpen && (
          <ul className="navbar-dropdown-menu">
            <li>
              <Link to="/upload">Upload Video</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
