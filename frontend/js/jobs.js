let allJobs = [];
let allCategories = [];

// Load jobs and categories on page load
document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    await loadCategories();
    await loadJobs();
});

// Load categories
async function loadCategories() {
    try {
        const categories = await apiCall(API_ENDPOINTS.categories);
        allCategories = categories;
        
        const categoryFilter = document.getElementById('categoryFilter');
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.category_id;
            option.textContent = cat.category_name;
            categoryFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load jobs
async function loadJobs() {
    try {
        const jobs = await apiCall(API_ENDPOINTS.jobs);
        allJobs = jobs;
        displayJobs(jobs);
    } catch (error) {
        console.error('Error loading jobs:', error);
        document.getElementById('jobsContainer').innerHTML = 
            '<p class="error-message show">Failed to load jobs. Please try again.</p>';
    }
}

// Display jobs
function displayJobs(jobs) {
    const container = document.getElementById('jobsContainer');
    
    if (jobs.length === 0) {
        container.innerHTML = '<p class="loading">No jobs found</p>';
        return;
    }
    
    container.innerHTML = jobs.map(job => `
        <div class="job-card" onclick="showJobDetails(${job.job_id})">
            <h3>${job.title}</h3>
            <div class="job-meta">
                <span>📍 ${job.location || 'Remote'}</span>
                <span>💰 ${job.salary || 'Competitive'}</span>
                ${job.category_name ? `<span>📂 ${job.category_name}</span>` : ''}
            </div>
            <p>${job.description ? job.description.substring(0, 150) + '...' : 'No description'}</p>
            ${job.skills_required ? `
                <div class="job-skills">
                    ${job.skills_required.split(',').slice(0, 3).map(skill => 
                        `<span class="skill-tag">${skill.trim()}</span>`
                    ).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Filter jobs
function filterJobs() {
    const categoryId = document.getElementById('categoryFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = allJobs;
    
    if (categoryId) {
        filtered = filtered.filter(job => job.category_id == categoryId);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(job => 
            job.title.toLowerCase().includes(searchTerm) ||
            (job.description && job.description.toLowerCase().includes(searchTerm)) ||
            (job.skills_required && job.skills_required.toLowerCase().includes(searchTerm))
        );
    }
    
    displayJobs(filtered);
}

// Show job details in modal
function showJobDetails(jobId) {
    const job = allJobs.find(j => j.job_id === jobId);
    if (!job) return;
    
    const auth = checkAuth();
    const canApply = auth && auth.role === 'JobSeeker';
    
    const modal = document.getElementById('jobModal');
    const detailsDiv = document.getElementById('jobDetails');
    
    detailsDiv.innerHTML = `
        <h2>${job.title}</h2>
        <div class="job-meta" style="margin: 1rem 0;">
            <span>📍 ${job.location || 'Remote'}</span>
            <span>💰 ${job.salary || 'Competitive'}</span>
            ${job.category_name ? `<span>📂 ${job.category_name}</span>` : ''}
            ${job.deadline ? `<span>📅 Deadline: ${new Date(job.deadline).toLocaleDateString()}</span>` : ''}
        </div>
        
        <h3>Description</h3>
        <p style="margin-bottom: 1.5rem;">${job.description || 'No description available'}</p>
        
        ${job.skills_required ? `
            <h3>Required Skills</h3>
            <div class="job-skills" style="margin-bottom: 1.5rem;">
                ${job.skills_required.split(',').map(skill => 
                    `<span class="skill-tag">${skill.trim()}</span>`
                ).join('')}
            </div>
        ` : ''}
        
        ${canApply ? `
            <button class="btn-large btn-primary" onclick="applyToJob(${job.job_id})">
                Apply Now
            </button>
        ` : !auth ? `
            <p style="color: var(--secondary);">
                <a href="login.html">Login</a> as a job seeker to apply
            </p>
        ` : ''}
    `;
    
    modal.classList.add('show');
}

// Close modal
function closeJobModal() {
    document.getElementById('jobModal').classList.remove('show');
}

// Apply to job
async function applyToJob(jobId) {
    const auth = checkAuth();
    if (!auth || auth.role !== 'JobSeeker') {
        alert('Please login as a job seeker to apply');
        return;
    }
    
    const coverLetter = prompt('Enter a brief cover letter (optional):');
    
    try {
        await apiCall(API_ENDPOINTS.applyJob, {
            method: 'POST',
            body: JSON.stringify({
                job_id: jobId,
                jobseeker_id: auth.userId,
                cover_letter: coverLetter || '',
                resume_url: ''
            })
        });
        
        alert('Application submitted successfully!');
        closeJobModal();
    } catch (error) {
        alert(error.message);
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('jobModal');
    if (event.target === modal) {
        closeJobModal();
    }
}
