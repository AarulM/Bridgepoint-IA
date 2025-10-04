// enhanced script for employment.html to more better utilize more survey data
document.addEventListener("DOMContentLoaded", function() {
  console.log("Employment page script loaded");
  
  // check if on the employment survey page
  if (window.location.pathname.includes("contact.html")) {
    handleSurveyPage();
  }
  
  // Check if on the employment page
  if (window.location.pathname.includes("employment.html")) {
    handleEmploymentPage();
  }
});

// function to handle the survey page
function handleSurveyPage() {
  console.log("Survey page detected");
  
  // getting the form element
  const form = document.getElementById('employment-survey');
  
  // ading form submission handler
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // prevent default form submission
      
      // get the  form data
      const formData = new FormData(form);
      let surveyData = {};
      
      // Convert form data to object
      for (let [key, value] of formData.entries()) {
        // handle checkbox groups (multiple values for same key)
        if (key === 'experience' || key === 'barriers') {
          if (!surveyData[key]) {
            surveyData[key] = [];
          }
          surveyData[key].push(value);
        } else {
          surveyData[key] = value;
        }
      }
      
      // store the data in localStorage
      localStorage.setItem('employmentSurveyData', JSON.stringify(surveyData));
      
      // show success message
      const messageElement = document.getElementById('message');
      if (messageElement) {
        messageElement.className = 'message-box success';
        messageElement.textContent = 'Thank you! Redirecting to employment opportunities...';
        messageElement.style.display = 'block';
      }
      
      // redirect to employment page after a short delay
      setTimeout(function() {
        window.location.href = 'employment.html';
      }, 1500);
    });
  }
}

// main functioning to handle the employment page
function handleEmploymentPage() {
  console.log("Employment page detected");
  
  // retrieval of data from localStorage
  const surveyData = localStorage.getItem('employmentSurveyData');
  
  if (surveyData) {
    console.log("Survey data found");
    
    // parse the survey data
    // parsing is necessary to convert the string back to an object
    // parsing means converting the JSON string back to a JavaScript object
    const userData = JSON.parse(surveyData);
    
    // find matching jobs based on comprehensive criteria
    const matchedJobs = findJobMatches(userData);
    console.log("Found " + matchedJobs.length + " matching jobs");
    
    // show personalized section
    // this section is where we display the personalized content based on the survey data
    const personalizedSection = document.getElementById('personalizedSection');
    if (personalizedSection) {
      personalizedSection.style.display = 'block';
    }
    
    // display personalized greeting and match explanation
    displayMatchExplanation(userData, matchedJobs);
    
    // Set up filter event handlers
    setupFilters(userData, matchedJobs);
    
    // Display job listings with match highlights
    displayJobListings(matchedJobs, userData);
    
  } else {
    console.log("No survey data found, showing all jobs");
    // No survey data, just show all jobs
    displayJobListings(getAvailableJobs(), null);
  }
}

// enhanced job matching algorithm using multiple criteria from the survey
function findJobMatches(userData) {
  // Get available jobs
  const availableJobs = getAvailableJobs();
  
  // Array to store matching jobs with scores
  let matchingJobs = [];
  
  // extractting user preferences
  const jobType = userData['job-type'] || 'either';
  const experience = userData.experience || [];
  const wageRequirement = document.getElementById('wage-requirement') ? 
    document.getElementById('wage-requirement').options[document.getElementById('wage-requirement').selectedIndex].text : 
    userData['wage-requirement'];
  const hasTransportation = userData.transportation || 'no';
  const barriers = userData.barriers || [];
  
  // Looping through available jobs to find matches
  for (let job of availableJobs) {
    // Calculate a match score and track match reasons
    let matchScore = 0;
    let matchReasons = [];
    
    // Matching by job type
    if (jobType === 'either' || jobType === job.type) {
      matchScore += 2;
      matchReasons.push('Job Type');
    }
    
    // Match by wage
    const jobWage = job.wage || "$10-15"; // Default if not specified
    if (wageRequirement === jobWage || 
        (typeof wageRequirement === 'string' && jobWage && jobWage.includes(wageRequirement)) ||
        (typeof wageRequirement === 'string' && wageRequirement.includes(jobWage))) {
      matchScore += 3;
      matchReasons.push('Wage');
    }
    
    // Matching by experience
    if (Array.isArray(experience)) {
      // Each job has different roles that match with experience
      const jobRoles = {
        "Retail Sales Associate": ["retail", "customer-service"],
        "Warehouse Worker": ["warehouse"],
        "Office Assistant": ["office", "customer-service"],
        "Construction Helper": ["construction"]
      };
      
      const relevantExperience = jobRoles[job.title] || [];
      
      // c=heck if any of the user's experience matches this job
      for (let exp of experience) {
        if (relevantExperience.includes(exp)) {
          matchScore += 2;
          matchReasons.push('Experience');
          break; // Only count experience match once
        }
      }
    }
    
    // transport requirement
    // if not met, check if the job requires transportation and if the user has transportation available
    const jobRequiresTransportation = job.title.includes("Construction") || job.location === "Various Sites" || job.requirements.some(req => req.includes("transportation"));
    
    if (!jobRequiresTransportation || hasTransportation === 'yes') {
      matchScore += 1;
      if (jobRequiresTransportation && hasTransportation === 'yes') {
        matchReasons.push('Transportation');
      }
    }
    
    // Add to matches with score and reasons
    const jobWithScore = {
      ...job,
      matchScore: matchScore,
      matchReasons: matchReasons
    };
    
    // Always include all jobs, but with different scores
    matchingJobs.push(jobWithScore);
  }
  
  // Sort by match score (highest first)
  matchingJobs.sort((a, b) => b.matchScore - a.matchScore);
  
  return matchingJobs;
}

// Display personalized explanation of matches 
function displayMatchExplanation(userData, matchedJobs) {
  const matchExplanation = document.getElementById('matchExplanation');
  if (!matchExplanation) return;
  
  const name = userData.name || "there";
  const firstName = name.split(' ')[0];
  
  // Count high match jobs (score > 5)
  const highMatchCount = matchedJobs.filter(job => job.matchScore > 5).length;
  
  // Build personalized message
  let html = `<h3>Hello, ${firstName}!</h3><p>`;
  
  // Based on form data, create a personalized message
  html += `We've found <strong>${matchedJobs.length} job opportunities</strong> that might be a good fit for you. `;
  
  if (highMatchCount > 0) {
    html += `${highMatchCount} positions are particularly strong matches based on your qualifications. `;
  }
  
  // Add references to specific criteria that helped find matches
  if (userData.experience && userData.experience.length > 0) {
    // Check if array or string
    const expArray = Array.isArray(userData.experience) ? userData.experience : [userData.experience];
   
// conditional statemeents for reccommending jobs based on experience
// this section of the code provides personalized recommendations based on the user's experience
    if (expArray.includes('retail') || expArray.includes('customer-service')) {
      html += `Your customer service experience is valuable for several of these positions. `;
    }
    if (expArray.includes('warehouse')) {
      html += `Your warehouse experience is especially relevant for our logistics positions. `;
    }
    if (expArray.includes('office')) {
      html += `Your office skills are well-matched to our administrative openings. `;
    }
  }
  
  if (userData.transportation === 'yes') {
    html += `Having reliable transportation qualifies you for positions across various locations. `;
  }
  
  html += `</p>`;
  
  // Add a note about the sorting and filtering
  // this note explains how the jobs are sorted and how the user can refine the results
  html += `<p>Jobs are sorted by how well they match your survey responses. Use the filters below to refine results.</p>`;
  
  matchExplanation.innerHTML = html;
}

// set up filter controls
// this function sets up the filter controls on the employment page 
function setupFilters(userData, allJobs) {
  const jobTypeFilter = document.getElementById('jobTypeFilter');
  const sortOrder = document.getElementById('sortOrder');
  
  if (jobTypeFilter && sortOrder) {
    // set initial value based on user preferences
    if (userData['job-type']) {
      jobTypeFilter.value = userData['job-type'] === 'either' ? 'all' : userData['job-type'];
    }
    
    // Add event listeners for filters
    jobTypeFilter.addEventListener('change', function() {
      filterAndDisplayJobs(userData, allJobs);
    });
    
    sortOrder.addEventListener('change', function() {
      filterAndDisplayJobs(userData, allJobs);
    });
  }
}

// appply filters and sort jobs
function filterAndDisplayJobs(userData, allJobs) {
  const jobTypeFilter = document.getElementById('jobTypeFilter');
  const sortOrder = document.getElementById('sortOrder');
  
  let filteredJobs = [...allJobs]; // create copyy to avoid modifying original
  
  // apply job type filter
  if (jobTypeFilter && jobTypeFilter.value !== 'all') {
    filteredJobs = filteredJobs.filter(job => job.type === jobTypeFilter.value);
  }
  
  // apply sorting
  // sort based on user selection
  // this section of the code sorts the job listings based on the user's selected criteria
  if (sortOrder) {
    switch(sortOrder.value) {
      case 'match':
        filteredJobs.sort((a, b) => b.matchScore - a.matchScore);
        break;
      case 'wage-high':
        filteredJobs.sort((a, b) => {
          const getWageValue = (wage) => {
            if (wage === "$10-15") return 12.5;
            if (wage === "$15-20") return 17.5;
            if (wage === "$20-25") return 22.5;
            return 10; // Default
          };
          return getWageValue(b.wage) - getWageValue(a.wage);
        });
        break;
      case 'wage-low':
        filteredJobs.sort((a, b) => {
          const getWageValue = (wage) => {
            if (wage === "$10-15") return 12.5;
            if (wage === "$15-20") return 17.5;
            if (wage === "$20-25") return 22.5;
            return 30; // Default
          };
          return getWageValue(a.wage) - getWageValue(b.wage);
        });
        break;
    }
  }
  
  // display filtered and sorted jobs
  displayJobListings(filteredJobs, userData);
}
// get available job listings
// display job listings with match information
function displayJobListings(jobs, userData) {
  const jobListingsContainer = document.getElementById('jobListings');
  if (!jobListingsContainer) return;
  
  // Clear existing content
  jobListingsContainer.innerHTML = '';
  
  // If no jobs match
  if (jobs.length === 0) {
    jobListingsContainer.innerHTML = `
      <div class="no-match-message">
        <h3>No Matching Jobs Found</h3>
        <p>We don't have any positions that match your current filters. Try adjusting your search criteria.</p>
        <p>You can also contact our employment team for personalized assistance.</p>
        <button class="btn-apply" onclick="window.location.href='contact.html'">Contact Support</button>
      </div>
    `;
    return;
  }
  
  // Create job cards
  jobs.forEach(job => {
    const jobCard = document.createElement('div');
    jobCard.className = 'job-card';
    
    // Determine match level for styling
    let matchLevel = '';
    if (userData) {
      if (job.matchScore > 5) matchLevel = 'high-match';
      else if (job.matchScore > 3) matchLevel = 'medium-match';
    }
    
    if (matchLevel) {
      jobCard.classList.add(matchLevel);
    }
    
    // Map wage range to human-readable format
    let wageDisplay = '';
    switch(job.wage) {
      case "$10-15": wageDisplay = "$10-15/hour"; break;
      case "$15-20": wageDisplay = "$15-20/hour"; break;
      case "$20-25": wageDisplay = "$20-25/hour"; break;
      default: wageDisplay = job.wage || "Competitive";
    }
    
    // Map job type to human-readable format
    // this section of the code maps the job type to a more user-friendly display format
    let jobTypeDisplay = '';
    switch(job.type) {
      case "full-time": jobTypeDisplay = "Full-time"; break;
      case "part-time": jobTypeDisplay = "Part-time"; break;
      case "either": jobTypeDisplay = "Full-time or Part-time"; break;
      default: jobTypeDisplay = job.type || "Flexible";
    }
    
    // create the card HTML
    // this section of the code creates the HTML structure for each job listing card
    let cardHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <h3 class="job-title">${job.title}</h3>
    `;
    
    // Add match badge if applicable
    if (userData && job.matchReasons && job.matchReasons.length > 0) {
      cardHTML += `<span class="job-match">${job.matchScore > 5 ? 'Strong Match!' : 'Potential Match'}</span>`;
    }
    
   // Add job type and its details 
   // this section of the code adds the job type and its details to the job listing card
    cardHTML += `
      </div>
      <h4 class="job-company">${job.company}</h4>
      
      <div class="job-details">
        <div class="job-detail">
          <strong>Type:</strong> ${jobTypeDisplay}
        </div>
        <div class="job-detail">
          <strong>Wage:</strong> ${wageDisplay}
        </div>
        <div class="job-detail">
          <strong>Location:</strong> ${job.location}
        </div>
      </div>
    `;
    
    // adding match reasons if available
    if (userData && job.matchReasons && job.matchReasons.length > 0) {
      cardHTML += `<div class="match-reasons">`;
      cardHTML += `<strong>Matches your:</strong> `;
      
      // Create badges for each match reason
      job.matchReasons.forEach(reason => {
        cardHTML += `<span class="job-tag">${reason}</span>`;
      });
      
      cardHTML += `</div>`;
    }
    
    // add description and requirements
    cardHTML += `
      <p>${job.description}</p>
      
      <div>
        <strong>Requirements:</strong>
        <ul>
          ${job.requirements.map(req => `<li>${req}</li>`).join('')}
        </ul>
      </div>
      
      <button class="btn-apply" data-job-id="${job.id}">Apply Now</button>
    `;
    // append the card to the container
    jobCard.innerHTML = cardHTML;
    jobListingsContainer.appendChild(jobCard);
  });
  
  // add event listeners to apply buttons
  // this section of the code adds event listeners to the "Apply Now" buttons on each job listing card
  // event listeners are used to handle the application process when a user clicks the button
  const applyButtons = document.querySelectorAll('.btn-apply');
  applyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const jobId = this.getAttribute('data-job-id');
      const job = jobs.find(j => j.id == jobId);
      
      if (job) {
        // For now, just show an alert - in a real app you'd handle the application
        alert(`Thank you for your interest in the ${job.title} position at ${job.company}. We'll contact you with next steps!`);
      }
    });
  });
  
  // Add styles for match levels
  // This is a simple way to highlight matches visually
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .high-match {
      border-left: 5px solid #28a745;
    }
    .medium-match {
      border-left: 5px solid #17a2b8;
    }
    .match-reasons {
      margin: 10px 0;
    }
  `;
  document.head.appendChild(styleElement);
}