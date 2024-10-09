import React from 'react';
import drawing1 from '../assets/drawing4.jpg'; // Adjust based on actual extension
import { AiOutlineSearch } from 'react-icons/ai';

const Hero = () => {
  return (
    <div className='w-full bg-white py-24'>
      <div className='md:max-w-[1400px] m-auto grid md:grid-cols-2 max-w-[600px]'>
        <div className='flex flex-col justify-start gap-4 inline-block align-bottom'>
          <p className='py-2 text-2xl text-[#20B486] font-medium'>GET YOUR NEXT ROLE</p>
          <h1 className='py-2 md:text-6xl text-5xl font-semibold'>
            Access To over <span className='text-[#20B486]'>500+</span> Employers and{' '}
            <span className='text-[#20B486]'>2000</span> available workforce. Take control now.
          </h1>
          <p className='py-2 text-lg text-gray-600'>
            We want you to take control of your work and workforce.
          </p>
          <form className='max-w-[700px] p-4 shadow-lg rounded-md flex justify-between items-center bg-white'>
            <input
              className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#20B486]'
              type='text'
              placeholder='Search now'
            />
            <button className='ml-2 p-2 bg-[#20B486] rounded-full text-white hover:bg-green-500'>
              <AiOutlineSearch size={20} />
            </button>
          </form>
        </div>
        {/* Image rendering */}
        <img className='md:order-last order-first' src={drawing1} alt="Hero Illustration" />
      </div>
    </div>
  );
};

export default Hero;