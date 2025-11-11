// Dashboard functionality
document.addEventListener('DOMContentLoaded', async () => {
    const auth = checkAuth();
    
    if (!auth) {
        window.location.href = 'login.html';
        return;
    }
    
    // Show appropriate dashboard
    if (auth.role === 'JobSeeker') {
        document.getElementById('jobseekerDashboard').style.display = 'block';
        await loadJobSeekerProfile();
        await loadMyApplications();
    } else if (auth.role === 'Employer') {
        document.getElementById('employerDashboard').style.display = 'block';
        await loadEmployerProfile();
        await loadJobCategories();
        await loadMyJobs();
    }
});

// Tab switching
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const tabMap = {
        'profile': 'profileTab',
        'applications': 'applicationsTab',
        'company': 'companyTab',
        'postjob': 'postjobTab',
        'myjobs': 'myjobsTab'
    };
    
    // Load data when switching to specific tabs
    if (tabName === 'myjobs') {
        loadMyJobs();
    } else if (tabName === 'applications') {
        loadMyApplications();
    }
    
    const tabElement = document.getElementById(tabMap[tabName]);
    if (tabElement) {
        tabElement.classList.add('active');
    }
    
    // Set active button
    event.target.classList.add('active');
}

// Job Seeker Functions
async function loadJobSeekerProfile() {
    const auth = checkAuth();
    try {
        const profile = await apiCall(API_ENDPOINTS.getJobseekerProfile(auth.userId));
        
        // Populate form
        document.getElementById('skills').value = profile.skills || '';
        document.getElementById('education').value = profile.education || '';
        document.getElementById('experience').value = profile.experience || '';
        document.getElementById('resume_url').value = profile.resume_url || '';
        document.getElementById('preferred_location').value = profile.preferred_location || '';
    } catch (error) {
        console.log('No profile found, user can create one');
    }
}

async function saveProfile(event) {
    event.preventDefault();
    const auth = checkAuth();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data.jobseeker_id = auth.userId;
    
    try {
        await apiCall(API_ENDPOINTS.jobseekerProfile, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        alert('Profile saved successfully!');
    } catch (error) {
        alert('Error saving profile: ' + error.message);
    }
}

async function loadMyApplications() {
    const auth = checkAuth();
    const container = document.getElementById('applicationsContainer');
    
    try {
        const applications = await apiCall(API_ENDPOINTS.myApplications(auth.userId));
        
        if (applications.length === 0) {
            container.innerHTML = '<p class="loading">No applications yet</p>';
            return;
        }
        
        container.innerHTML = applications.map(app => `
            <div class="application-item">
                <h4>${app.title || 'Job'}</h4>
                <p><strong>Applied:</strong> ${new Date(app.apply_date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> 
                    <span class="status-badge status-${app.status.toLowerCase()}">
                        ${app.status.toUpperCase()}
                    </span>
                </p>
                ${app.location ? `<p><strong>Location:</strong> ${app.location}</p>` : ''}
                ${app.salary ? `<p><strong>Salary:</strong> ${app.salary}</p>` : ''}
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p class="error-message show">Failed to load applications</p>';
    }
}

// Employer Functions
async function loadEmployerProfile() {
    const auth = checkAuth();
    try {
        const profile = await apiCall(API_ENDPOINTS.getEmployerProfile(auth.userId));
        
        // Populate form
        document.getElementById('company_name').value = profile.company_name || '';
        document.getElementById('industry').value = profile.industry || '';
        document.getElementById('website').value = profile.website || '';
        document.getElementById('address').value = profile.address || '';
        document.getElementById('position_title').value = profile.position_title || '';
    } catch (error) {
        console.log('No profile found, user can create one');
    }
}

async function saveCompanyProfile(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    try {
        await apiCall(API_ENDPOINTS.employerProfile, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        alert('Company profile saved successfully!');
    } catch (error) {
        alert('Error saving profile: ' + error.message);
    }
}

async function loadJobCategories() {
    try {
        const categories = await apiCall(API_ENDPOINTS.categories);
        const select = document.getElementById('job_category');
        
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.category_id;
            option.textContent = cat.category_name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function postJob(event) {
    event.preventDefault();
    const auth = checkAuth();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data.employer_id = auth.userId;
    
    try {
        await apiCall(API_ENDPOINTS.createJob, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        alert('Job posted successfully!');
        event.target.reset();
    } catch (error) {
        alert('Error posting job: ' + error.message);
    }
}


async function loadMyJobs() {
    const auth = checkAuth();
    const container = document.getElementById('myJobsContainer');
    
    try {
        const jobs = await apiCall(API_ENDPOINTS.myJobs(auth.userId));
        
        if (jobs.length === 0) {
            container.innerHTML = '<p class="loading">No jobs posted yet</p>';
            return;
        }
        
        container.innerHTML = jobs.map(job => `
            <div class="application-item">
                <h4>${job.title}</h4>
                <div class="job-meta" style="margin: 0.5rem 0;">
                    <span>📍 ${job.location || 'Remote'}</span>
                    <span>💰 ${job.salary || 'Not specified'}</span>
                    <span>📂 ${job.category_name || 'Uncategorized'}</span>
                </div>
                <p><strong>Status:</strong> 
                    <span class="status-badge status-${job.status.toLowerCase()}">
                        ${job.status}
                    </span>
                </p>
                <p><strong>Posted:</strong> ${new Date(job.posted_date).toLocaleDateString()}</p>
                ${job.deadline ? `<p><strong>Deadline:</strong> ${new Date(job.deadline).toLocaleDateString()}</p>` : ''}
                <p><strong>Applications:</strong> ${job.application_count || 0}</p>
                ${job.application_count > 0 ? `
                    <button class="btn-primary" onclick="viewApplicants(${job.job_id})">
                        View Applicants
                    </button>
                ` : ''}
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p class="error-message show">Failed to load jobs</p>';
        console.error('Error loading jobs:', error);
    }
}

let currentViewingJobId = null;

async function viewApplicants(jobId) {
    currentViewingJobId = jobId;
    const container = document.getElementById('myJobsContainer');
    
    try {
        const applicants = await apiCall(API_ENDPOINTS.jobApplicants(jobId));
        
        if (applicants.length === 0) {
            container.innerHTML = `
                <div class="card">
                    <button onclick="loadMyJobs()" class="btn-secondary" style="margin-bottom: 1rem;">← Back to My Jobs</button>
                    <h2>Applicants for Job ID: ${jobId}</h2>
                    <p class="loading">No applicants yet for this job</p>
                </div>
            `;
            return;
        }
        
        // Create modal-like view
        container.innerHTML = `
            <div class="card">
                <button onclick="loadMyJobs()" class="btn-secondary" style="margin-bottom: 1rem;">← Back to My Jobs</button>
                <h2>Applicants (${applicants.length})</h2>
                ${applicants.map(app => `
                    <div class="application-item">
                        <h4>${app.full_name}</h4>
                        <p><strong>Email:</strong> ${app.email}</p>
                        <p><strong>Applied:</strong> ${new Date(app.apply_date).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> 
                            <span class="status-badge status-${app.status.toLowerCase()}">
                                ${app.status}
                            </span>
                        </p>
                        ${app.resume_url ? `<p><strong>Resume:</strong> <a href="${app.resume_url}" target="_blank">View Resume</a></p>` : ''}
                        
                        ${app.status === 'Pending' ? `
                            <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                                <button class="btn-primary" onclick="updateApplicationStatus(${app.application_id}, 'Accepted')">
                                    ✅ Accept
                                </button>
                                <button class="btn-secondary" onclick="updateApplicationStatus(${app.application_id}, 'Rejected')" style="background: #ef4444;">
                                    ❌ Reject
                                </button>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        container.innerHTML = `
            <div class="card">
                <button onclick="loadMyJobs()" class="btn-secondary" style="margin-bottom: 1rem;">← Back to My Jobs</button>
                <p class="error-message show">Error loading applicants: ${error.message}</p>
            </div>
        `;
        console.error('Error:', error);
    }
}

async function updateApplicationStatus(applicationId, status) {
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this application?`)) {
        return;
    }
    
    try {
        await apiCall(API_ENDPOINTS.updateApplication(applicationId), {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        
        alert(`Application ${status.toLowerCase()} successfully!`);
        
        // Reload the applicants view
        if (currentViewingJobId) {
            viewApplicants(currentViewingJobId);
        } else {
            loadMyJobs();
        }
    } catch (error) {
        alert('Error updating status: ' + error.message);
    }
}
