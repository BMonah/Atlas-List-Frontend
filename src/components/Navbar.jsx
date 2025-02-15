import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { lock, hamburgerMenu, close } from '../assets';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // For dropdown
  const [username, setUsername] = useState(null); // State to hold the username
  const navigate = useNavigate();

  // Retrieve the username from localStorage when the component mounts
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const accessToken = localStorage.getItem('access_token');

    if (accessToken && storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleClick = () => setToggle(!toggle);

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');

      if (!accessToken) {
        alert('No access token found. Please log in again.');
        return;
      }

      const response = await fetch('http://127.0.0.1:8080/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Clear the tokens and username from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');

        // Redirect to the login page after logout
        navigate('/login');
      } else {
        const errorData = await response.json();
        console.error('Logout error response:', errorData); // Log error details
        alert(errorData.message || 'Logout failed!');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred while logging out.');
    }
  };

  // Toggle the dropdown when clicking the username
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className='w-full h-[80px] bg-white border-b'>
      <div className='md:max-w-[1400px] max-w-[600px] m-auto w-full h-full flex justify-between items-center'>
        {/* Replaced img with AtlasList text in green */}
        <span className="text-[#20B486] text-4xl font-bold">AtlasList</span>

        <div className='hidden md:flex items-center'>
          <ul className='flex gap-4'>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/support">Support</Link></li>
            <li><Link to="/createjob">Create Job</Link></li>
            <li><Link to="/FreelancerPage">Get Jobs</Link></li>
          </ul>
        </div>

        {/* Show username with a dropdown menu for Logout */}
        <div className="hidden md:flex items-center relative">
          {username ? (
            <div>
              <span
                onClick={toggleDropdown} // Show dropdown on click
                className="text-gray-800 font-bold cursor-pointer"
              >
                Hello, {username} ▼
              </span>
              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute top-8 right-0 mt-2 w-48 bg-white shadow-lg rounded-md border">
                  <ul className="flex flex-col">
                    <li>
                      <button
                        onClick={handleLogout}
                        className='w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800'
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className='flex justify-between items-center bg-transparent px-6 gap-2'>
                <img src={lock} alt="Lock icon" />
                login
              </Link>
              <Link to="/signup" className='px-8 py-3 rounded-md bg-[#20B486] text-white font-bold'>
                sign up for free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className='md:hidden' onClick={handleClick}>
          <img src={toggle ? close : hamburgerMenu} alt="Menu icon" />
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={toggle ? 'absolute z-10 p-4 bg-white w-full px-8 md:hidden' : 'hidden'}>
        <ul>
          <li><Link to="/" className='p-4 hover:bg-gray-100'>Home</Link></li>
          <li><Link to="/about" className='p-4 hover:bg-gray-100'>About</Link></li>
          <li><Link to="/support" className='p-4 hover:bg-gray-100'>Support</Link></li>
          <li><Link to="/createjob" className='p-4 hover:bg-gray-100'>Create Job</Link></li>
          <li><Link to="/FreelancerPage" className='p-4 hover:bg-gray-100'>Get Jobs</Link></li>
        </ul>
        {/* Mobile Logout Button */}
        {username ? (
          <div className='flex flex-col my-4 gap-4'>
            <span className='text-gray-700'>Hello, {username}</span>
            <button
              onClick={handleLogout}
              className='px-8 py-5 rounded-md bg-[#20B486] text-white font-bold'
            >
              Logout
            </button>
          </div>
        ) : (
          <div className='flex flex-col my-4 gap-4'>
            <Link to="/login" className='border border-[#20B486] flex justify-center items-center bg-transparent px-6 gap-2 py-4'>
              <img src={lock} alt="Lock icon" />
              login
            </Link>
            <Link to="/signup" className='px-8 py-5 rounded-md bg-[#20B486] text-white font-bold'>
              sign up for free
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;