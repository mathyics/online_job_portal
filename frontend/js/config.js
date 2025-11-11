// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

const API_ENDPOINTS = {
    register: `${API_BASE_URL}/users/register`,
    login: `${API_BASE_URL}/users/login`,
    categories: `${API_BASE_URL}/categories`,
    jobs: `${API_BASE_URL}/jobs/open`,
    createJob: `${API_BASE_URL}/jobs/create`,
    myJobs: (id) => `${API_BASE_URL}/jobs/my/${id}`,
    jobseekerProfile: `${API_BASE_URL}/jobseeker/upsert`,
    getJobseekerProfile: (id) => `${API_BASE_URL}/jobseeker/${id}`,
    employerProfile: `${API_BASE_URL}/employer/create`,
    getEmployerProfile: (id) => `${API_BASE_URL}/employer/${id}`,
    applyJob: `${API_BASE_URL}/applications/apply`,
    myApplications: (id) => `${API_BASE_URL}/applications/my/${id}`,
    jobApplicants: (id) => `${API_BASE_URL}/applications/job/${id}`,
    updateApplication: (id) => `${API_BASE_URL}/applications/update/${id}`
};

// Helper function to get auth headers
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

// Helper function to make API calls
async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...options.headers
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
