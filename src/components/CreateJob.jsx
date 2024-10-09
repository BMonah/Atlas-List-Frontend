import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import ReactQuill from 'react-quill'; // Rich Text Editor component

const CreateJobPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [rate, setRate] = useState('');
    const [level, setLevel] = useState('');
    const [createdJobs, setCreatedJobs] = useState([]); // State to store created jobs
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCreatedJobs();
    }, []);

    // Function to fetch created jobs from the backend
    const fetchCreatedJobs = async () => {
        const accessToken = localStorage.getItem('access_token');
        try {
            const response = await fetch('http://127.0.0.1:8080/jobs/created-jobs', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch created jobs');
            }

            const data = await response.json();
            setCreatedJobs(data); // Store the fetched jobs in state
        } catch (err) {
            setError(err.message);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem('access_token');
        
        if (!accessToken) {
            setError('No access token found. Please log in.');
            return;
        }

        const jobData = {
            title,
            description,
            rate: parseFloat(rate), // Ensure rate is converted to number
            level, // Include the job level in the request
        };

        try {
            const response = await fetch('http://127.0.0.1:8080/jobs/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`, // Pass JWT token
                },
                body: JSON.stringify(jobData),
            });

            if (response.status === 401) {
                throw new Error('Unauthorized. Please log in.');
            }

            if (!response.ok) {
                throw new Error('Failed to create job');
            }

            setSuccessMessage('Job created successfully!');
            setError(null);
            fetchCreatedJobs(); // Fetch the updated list of created jobs after successful submission

            // Clear form after successful submission
            setTitle('');
            setDescription('');
            setRate('');
            setLevel('');
        } catch (err) {
            setError(err.message);
            setSuccessMessage(null);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-2 gap-6">
                {/* 1/2 for Create Job */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-3xl font-semibold mb-6">Create New Job</h1>
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                    {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="jobTitle" className="block text-gray-700 font-semibold mb-2">Job Title</label>
                            <input
                                type="text"
                                id="jobTitle"
                                placeholder="Enter job title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="jobDescription" className="block text-gray-700 font-semibold mb-2">Job Description</label>
                            <ReactQuill
                                theme="snow"
                                value={description}
                                onChange={setDescription}
                                required
                                placeholder="Enter job description"
                                className="border rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="jobRate" className="block text-gray-700 font-semibold mb-2">Job Rate ($/hr)</label>
                            <input
                                type="number"
                                id="jobRate"
                                placeholder="Enter job rate"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                required
                                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="jobLevel" className="block text-gray-700 font-semibold mb-2">Job Level</label>
                            <select
                                id="jobLevel"
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                required
                                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="" disabled>Select job level</option>
                                <option value="Entry Level">Entry Level</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Senior">Senior</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full py-3 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition duration-200">
                            Create Job
                        </button>
                    </form>
                </div>

                {/* 1/2 for Created Jobs */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Created Jobs</h2>
                    <div className="overflow-y-auto max-h-[30rem]"> {/* Make the section scrollable */}
                        {createdJobs.length > 0 ? (
                            <ul className="space-y-4">
                                {createdJobs.map((job, index) => (
                                    <li key={index} className="bg-white p-4 rounded-lg shadow-md">
                                        <h3 className="text-blue-600 text-lg font-semibold">{job.title}</h3>
                                        <p className="text-gray-600"><strong>Description:</strong> {job.description}</p>
                                        <p className="text-gray-600"><strong>Level:</strong> {job.level}</p>
                                        <p className="text-gray-600"><strong>Rate:</strong> ${job.rate}/hr</p>
                                        <p className="text-gray-600"><strong>Creator:</strong> {job.creator}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">No created jobs available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateJobPage;