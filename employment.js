// Available jobs database
// This is a mock database of job listings for the employment page.
// Each job listing includes details such as title, company, type, wage, experience required, description, requirements, location, and transportation options.
const availableJobs = [
    {
      id: 1,
      title: "Retail Sales Associate",
      company: "Local Retail Store",
      type: "part-time",
      wage: "$15-20",
      experience: ["retail", "customer-service"],
      description: "Retail position with flexible hours. Responsibilities include basic tasks such as  assisting customers, operating cash registers, and maintaining store appearance.",
      requirements: ["Customer service skills", "Basic math skills", "Ability to stand for extended periods"],
      location: "Downtown",
      transportation: "public"
    },
    {
      id: 2,
      title: "Warehouse Worker",
      company: "Distribution Center",
      type: "full-time",
      wage: "$15-20",
      experience: ["warehouse"],
      description: "Picking, packing and shipping orders in climate-controlled environment. Training provided for all warehouse systems.",
      requirements: ["Ability to lift up to 50 lbs", "Basic computer skills", "Reliable attendance"],
      location: "Industrial Town",
      transportation: "yes"
    },
    {
      id: 3,
      title: "Food Service Worker",
      company: "Downtown Restaurant",
      type: "either",
      wage: "$10-15",
      experience: ["food-service", "customer-service"],
      description: "Entry-level position in busy restaurant. Training provided. Flexible scheduling available.",
      requirements: ["Ability to work in fast-paced environment", "Basic food safety knowledge", "Team player"],
      location: "City Center",
      transportation: "public"
    },
    {
      id: 4,
      title: "Office Assistant",
      company: "Business Services Inc.",
      type: "full-time",
      wage: "$15-20",
      experience: ["office", "customer-service"],
      description: "Support office operations by performing administrative tasks such as data entry, answering phones, and assisting with customer inquiries. Training provided for all office systems.",
      requirements: ["Proficient in Microsoft Office", "Strong communication skills", "Ability to multitask and prioritize work"],
      location: "Business District",
      transportation: "yes"
    },
    {
      id: 5,
      title: "Construction Helper", 
      company: "BuildRight Construction",
      type: "full-time",
      wage: "$20-25",
      experience: ["construction"],
      description: "Entry-level construction position. On-the-job training provided. Great opportunity to learn construction trades.",
      requirements: ["Ability to lift heavy materials", "Basic hand tools knowledge", "Willingness to learn"],
      location: "Construction City Site",
      transportation: "yes"
    },
    {
      id: 6,
      title: "Healthcare Aide", 
      company: "Caring Hands Healthcare",
      type: "either",
      wage: "$15-20",
      experience: ["healthcare"],
      description: "Assist healthcare professionals in providing care to patients. Flexible hours available. No prior experience required, training provided.",
      requirements: ["Compassionate attitude", "Reliability", "Willingness to learn"],
      location: "Medical Center",
      transportation: "public"
    },
    {
      id: 7,
      title: "Delivery Driver",
      company: "Local Courier Service",
      type: "either",
      wage: "$15-20",
      experience: ["transportation"],
      description: "Deliver packages to local businesses and residences. Flexible hours available. Must have reliable vehicle and valid driver's license.",
      requirements: ["Valid driver's license", "Good driving record", "Ability to navigate city streets"],
      location: "City-wide",
      transportation: "yes"
    },
    {
      id: 8,
      title: "Customer Service Representative",
      company: "Support Solutions",
      type: "full-time",
      wage: "$15-20",
      experience: ["customer-service", "office"],
      description: "Provide support to customers via phone and email. Assist with inquiries and resolve issues in a timely manner. Training provided.",
      requirements: ["Communication skills", "Problem-solving ability", "Ability to work in a team environment"],
      location: "Campus Park",
      transportation: "public"
    },
    {
      id: 9,
      title: "Line Cook",
      company: "Family Restaurant",
      type: "full-time",
      wage: "$15-20",
      experience: ["food-service"],
      description: "Prepare food in busy kitchen environments. Previous cooking experience helpful but not required. You can be trained on the job.",
      requirements: ["Food handler's card", "Ability to work in fast-paced environment", "Team player"],
      location: "Restauraunt District",
      transportation: "public"
    },
    {
      id: 10,
      title: "Inventory Clerk",
      company: "Wholesale Supplies",
      type: "full-time",
      wage: "$15-20",
      experience: ["warehouse", "office"],
      description: "Track inventory levels, assist with ordering, and maintaining organization of the supply room.",
      requirements: ["Attention to detail", "Basic math skills", "Computer literacy"],
      location: "Business Park",
      transportation: "yes"
    },
  ];
  
  // On page load
  document.addEventListener("DOMContentLoaded", function() {
    // we check if user came from survey
    const surveyData = localStorage.getItem('employmentSurveyData');
    
    if (surveyData) {
      // then p arse the survey data
      const userData = JSON.parse(surveyData);
      
      // show personalized section
      document.getElementById('personalizedSection').style.display = 'block';
      
      // find matching jobs
      const matchedJobs = findMatchingJobs(userData);
      
      // display personalized greeting
      displayMatchExplanation(userData, matchedJobs.length);
      
      // display job listings
      displayJobListings(matchedJobs);
      
      // set up filter event listeners
      setupFilters(matchedJobs);
    } else {
      // NO survey data, just show all jobs
      displayJobListings(availableJobs);
    }
  });
  
  // Find matching jobs based on survey data
  function findMatchingJobs(userData) {
    // Extract user preferences
    const userExperience = Array.isArray(userData.experience) ? userData.experience : [userData.experience];
    const preferredJobType = userData["job-type"];
    const wageRequirement = userData["wage-requirement"];
    const transportationStatus = userData.transportation;
    
    // Calculate match score for each job
    const scoredJobs = availableJobs.map(job => {
      let score = 0;
      
      // Experience match (highest weight)
      const experienceMatch = job.experience.some(exp => userExperience.includes(exp));
      if (experienceMatch) score += 30;
      
      // Job type match
      if (preferredJobType === "either" || job.type === "either" || job.type === preferredJobType) {
        score += 20;
      }
      
      // wage match
      // wageRequirement is a string, so we need to compare it to the wage range in the job
      // This can be expanded to handle more complex wage requirements
      if (job.wage === wageRequirement) {
        score += 20;
      }
      
      // Transportation match
      if (job.transportation === "public" && ["yes", "public"].includes(transportationStatus)) {
        score += 20;
      } else if (job.transportation === "yes" && transportationStatus === "yes") {
        score += 20;
      }
      
      // Ensure score does not exceed 90
      // if it does, cap it at 90
      return {
        ...job,
        matchScore: score,
        matchPercentage: Math.round((score / 90) * 100)
      };
    });
    
    // Sort by match score (highest first)
    return scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
  }
  
  // Display explanation of matches
  function displayMatchExplanation(userData, matchCount) {
    const matchExplanation = document.getElementById('matchExplanation');
    const firstName = userData.firstName || "there";
    
    // create personalized greeting based on survey data and the number of matched jobs
    let html = `
      <h3>Hello, ${firstName}!</h3>
      <p>Based on your survey responses, we've found ${matchCount} potential employment opportunities that might be a good fit for you.</p>
      <p>Jobs are ranked by how well they match your experience, job type preference, wage requirements, and transportation needs.</p>
    `;
    
    matchExplanation.innerHTML = html;
  }
  
  // Display job listings
  function displayJobListings(jobs) {
    const jobListingsContainer = document.getElementById('jobListings');
    
    // Clear existing content
    jobListingsContainer.innerHTML = '';
    
    // If no jobs match
    if (jobs.length === 0) {
      jobListingsContainer.innerHTML = `
        <div class="no-match-message">
          <h3>No Exact Matches Found</h3>
          <p>We don't have any positions that perfectly match your criteria right now. Please check back later or adjust your preferences.</p>
          <p>You can also contact our employment team for personalized assistance.</p>
          <button class="btn-apply" onclick="window.location.href='contact.html'">Contact Support</button>
        </div>
      `;
      return;
    }
    
    // create job cards
    jobs.forEach(job => {
      const jobCard = document.createElement('div');
      jobCard.className = 'job-card';
      
      // create match badge if score is available
      let matchBadge = '';
      if (job.matchScore !== undefined) {
        matchBadge = `<span class="job-match">${job.matchPercentage}% Match</span>`;
      }
      
      // map wage range to human-readable format
      let wageDisplay = '';
      switch(job.wage) {
        case "$10-15": wageDisplay = "$10-15/hour"; break;
        case "$15-20": wageDisplay = "$15-20/hour"; break;
        case "$20-25": wageDisplay = "$20-25/hour"; break;
        default: wageDisplay = job.wage;
      }
      
      // map job type to human-readable format
      let jobTypeDisplay = '';
      switch(job.type) {
        case "full-time": jobTypeDisplay = "Full-time"; break;
        case "part-time": jobTypeDisplay = "Part-time"; break;
        case "either": jobTypeDisplay = "Full-time or Part-time"; break;
        default: jobTypeDisplay = job.type;
      }
      
      // Create job card HTML
      // this includes the job title, company, type, wage, location, description, requirements, and experience tags
      // The match badge is included if the job has a match score
      jobCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <h3 class="job-title">${job.title}</h3>
          ${matchBadge}
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
        
        <p>${job.description}</p>
        
        <div>
          <strong>Requirements:</strong>
          <ul>
            ${job.requirements.map(req => `<li>${req}</li>`).join('')}
          </ul>
        </div>
        <div style="margin-bottom: 15px;">
          ${job.experience.map(exp => {
            let displayName = '';
            // case statement to map experience types to display names
            // This can be expanded as needed for more experience types
            switch(exp) {
              case "retail": displayName = "Retail/Sales"; break;
              case "food-service": displayName = "Food Service"; break;
              case "customer-service": displayName = "Customer Service"; break;
              case "warehouse": displayName = "Warehouse"; break;
              case "construction": displayName = "Construction"; break;
              case "office": displayName = "Office Work"; break;
              case "healthcare": displayName = "Healthcare"; break;
              case "transportation": displayName = "Transportation"; break;
              default: displayName = exp;
            }
            return `<span class="job-tag">${displayName}</span>`;
          }).join('')}
        </div>
        
        <button class="btn-apply" data-job-id="${job.id}">Apply Now</button>
      `;
      // append the job card to the container
      jobListingsContainer.appendChild(jobCard);
    });
    
    // add event listeners to apply buttons
    const applyButtons = document.querySelectorAll('.btn-apply');
    applyButtons.forEach(button => {
      button.addEventListener('click', function() {
        const jobId = this.getAttribute('data-job-id');
        const job = jobs.find(j => j.id == jobId);
        
        // For now, just show an alert - in a real app you'd handle the application
        alert(`Thank you for your interest in the ${job.title} position at ${job.company}. We'll contact you with next steps!`);
      });
    });
  }
  
  // set up filter and sort functionality
  function setupFilters(allJobs) {
    const jobTypeFilter = document.getElementById('jobTypeFilter');
    const sortOrder = document.getElementById('sortOrder');
    
    // function to apply filters and sort
    function applyFiltersAndSort() {
      // filter by job type
      let filteredJobs = [...allJobs];
      
      if (jobTypeFilter.value !== 'all') {
        filteredJobs = filteredJobs.filter(job => 
          job.type === jobTypeFilter.value || job.type === 'either'
        );
      }
      
      // sorting the jobs
      switch(sortOrder.value) {
        case 'match':
          filteredJobs.sort((a, b) => b.matchScore - a.matchScore);
          break; // sort by match score
        case 'wage-high':
          filteredJobs.sort((a, b) => {
            const wageA = parseWage(a.wage);
            const wageB = parseWage(b.wage);
            return wageB - wageA;
          });
          break;
        case 'wage-low':
          filteredJobs.sort((a, b) => {
            const wageA = parseWage(a.wage);
            const wageB = parseWage(b.wage);
            return wageA - wageB;
          });
          break;
      }
      
      // display filtered and sorted jobs
      displayJobListings(filteredJobs);
    }
    
    // helper to parse wage ranges
    function parseWage(wage) {
      if (wage === "$10-15") return 12.5;
      if (wage === "$15-20") return 17.5;
      if (wage === "$20-25") return 22.5;
      return 0;
    }
    
    // aadd event listeners to filter controls
    jobTypeFilter.addEventListener('change', applyFiltersAndSort);
    sortOrder.addEventListener('change', applyFiltersAndSort);
  }