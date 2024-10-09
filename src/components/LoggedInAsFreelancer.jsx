import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoggedInAsFreelancer = () => {
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]); // State for applied jobs
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch the available jobs from the API
    const fetchJobs = async (accessToken) => {
        try {
            const response = await fetch('http://127.0.0.1:8080/jobs/jobs', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status === 401) {
                throw new Error('Unauthorized. Please log in.');
            }

            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }

            const data = await response.json();
            setJobs(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch the applied jobs from the API
    const fetchAppliedJobs = async (accessToken) => {
        try {
            const response = await fetch('http://127.0.0.1:8080/jobs/applied-jobs', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status === 401) {
                throw new Error('Unauthorized. Please log in.');
            }

            if (!response.ok) {
                throw new Error('Failed to fetch applied jobs');
            }

            const data = await response.json();
            setAppliedJobs(data); // Assuming applied jobs are returned from the backend
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            setError('No access token found. Please log in.');
            setLoading(false);
            return;
        }

        // Fetch available jobs and applied jobs if the access token is available
        fetchJobs(accessToken);
        fetchAppliedJobs(accessToken);
    }, []);

    // Handle login redirection
    const handleLoginRedirect = () => {
        navigate('/login');
    };


    const applyForJob = async (jobId) => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            setError('No access token found. Please log in.');
            return;
        }

        const applicantId = JSON.parse(atob(accessToken.split('.')[1])).sub; // Extract applicant_id from token

        const applicationData = {
            applicant_id: applicantId,
            job_id: jobId
        };

        try {
            const response = await fetch('http://127.0.0.1:8080/jobs/apply', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(applicationData)
            });

            if (response.status === 401) {
                throw new Error('Unauthorized. Please log in.');
            }

            if (!response.ok) {
                throw new Error('Failed to apply for the job');
            }

            const result = await response.json();
            alert(result.message); // Show success message
            fetchAppliedJobs(accessToken); // Refresh applied jobs
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold my-4 text-center md:text-left">
                Get connected to more than 500 employers across Perth
            </h1>

            {loading && <p className="text-lg">Loading...</p>}
            
            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    <p>{error}</p>
                    <button
                        onClick={handleLoginRedirect}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                    >
                        Go to Login
                    </button>
                </div>
            )}

            {/* Page layout with two columns (3/4 for available jobs, 1/4 for applied jobs) */}
            {!error && !loading && (
                <div className="grid grid-cols-4 gap-4">
                    {/* Available Jobs (3/4 of the page) */}
                    <div className="col-span-3">
                        <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {jobs.length > 0 ? (
                                jobs.map(job => (
                                    <div key={job.id} className="bg-white border border-gray-200 rounded-lg shadow-md p-4 my-3 transition hover:shadow-lg hover:border-blue-500">
                                        <h2 className="text-xl font-semibold text-blue-600">{job.title}</h2>
                                        <p className="text-gray-700">{job.description}</p>
                                        <p className="text-gray-700 mt-2"><strong>Creator:</strong> {job.creator}</p>
                                        <p className="text-gray-700 mt-1"><strong>Level:</strong> {job.level}</p>
                                        <p className="font-bold text-green-600 mt-4">{job.rate} Dollars per hour</p>
                                        <button
                                            onClick={() => applyForJob(job.id)}
                                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>No jobs available at the moment.</p>
                            )}
                        </div>
                    </div>

                    {/* Applied Jobs (1/4 of the page) */}
                    <div className="col-span-1">
                        <h2 className="text-2xl font-bold mb-4">Applied Jobs</h2>
                        <div className="overflow-y-auto h-[600px] bg-gray-100 p-4 rounded-lg shadow-md"> {/* Scrollable container */}
                            {appliedJobs.length > 0 ? (
                                appliedJobs.map(job => (
                                    <div key={job.id} className="bg-white border border-gray-200 rounded-lg shadow-md p-4 my-3 transition hover:shadow-lg hover:border-blue-500">
                                        <h2 className="text-xl font-semibold text-blue-600">{job.title}</h2>
                                        <p className="text-gray-700 mt-2"><strong>Creator:</strong> {job.creator}</p>
                                        <p className="text-gray-700 mt-1"><strong>Level:</strong> {job.level}</p>
                                        <p className="font-bold text-green-600 mt-2">{job.rate} Dollars per hour</p>
                                    </div>
                                ))
                            ) : (
                                <p>No applied jobs yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoggedInAsFreelancer;