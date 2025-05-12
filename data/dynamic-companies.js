/**
 * Gold IRA Website Dynamic Data Loader
 * This script loads company data from companies.json and populates website content dynamically
 */

// Load companies data from JSON file
async function loadCompaniesData() {
  try {
    const response = await fetch('/data/companies.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.companies;
  } catch (error) {
    console.error('Error loading companies data:', error);
    // Fallback to hardcoded data if loading fails
    return fallbackCompaniesData();
  }
}

// Populate home page companies table
function populateCompaniesTable(companies) {
  const tableBody = document.querySelector('.companies-table tbody');
  if (!tableBody) return;
  
  tableBody.innerHTML = ''; // Clear existing content
  
  companies.forEach(company => {
    const row = document.createElement('tr');
    
    // Create rank badge with special class for top rank
    const rankClass = company.rank === 1 ? 'top-rank' : '';
    
    row.innerHTML = `
      <td><div class="rank-badge ${rankClass}">${company.rank}</div></td>
      <td>
        <div class="company-name">
          <img src="/api/placeholder/40/40" alt="${company.name} Logo" class="company-logo">
          ${company.name}
        </div>
      </td>
      <td>${company.minInvestment}</td>
      <td>${company.annualFees}</td>
      <td><div class="rating">★★★★${company.ratingValue < 4.9 ? '☆' : '★'} (${company.rating})</div></td>
      <td>${company.bestFor}</td>
      <td><a href="#lead-form" class="company-link">Get Free Kit</a></td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Populate featured company section on homepage
function populateFeaturedCompany(companies) {
  const featuredCompanySection = document.querySelector('.featured-company');
  if (!featuredCompanySection) return;
  
  // Get the top ranked company
  const topCompany = companies.find(company => company.rank === 1);
  if (!topCompany) return;
  
  // Get the containers
  const featuredDetails = featuredCompanySection.querySelector('.featured-details');
  const featuredImage = featuredCompanySection.querySelector('.featured-image');
  
  if (featuredDetails) {
    // Generate HTML for pros list
    const prosList = topCompany.pros.map(pro => `<li>${pro}</li>`).join('');
    
    featuredDetails.innerHTML = `
      <h3>${topCompany.name}: Our Top Pick for 2025</h3>
      <p>${topCompany.description}</p>
      
      <ul class="benefits-list">
        ${prosList}
      </ul>
      
      <div class="customer-quote">
        <p>"<em>Their representatives helped me through every step of rolling over my 401k. They handle everything and educate you through the whole process so you feel confident in your decision.</em>"</p>
        <p class="quote-author">— Michael R., Verified Customer</p>
      </div>
      
      <a href="#lead-form" class="cta-primary">Request Your Free Gold Investment Kit</a>
    `;
  }
  
  if (featuredImage) {
    featuredImage.innerHTML = `
      <img src="/api/placeholder/300/200" alt="${topCompany.name} Review">
      <div class="rating">★★★★★ (${topCompany.rating})</div>
      <p><strong>BBB Rating: ${topCompany.bbbRating}</strong></p>
      <p><strong>TrustPilot Rating: ${topCompany.rating}</strong></p>
      <div class="featured-badges">
        <span class="badge">740+ Verified Reviews</span>
        <span class="badge">Zero Complaints</span>
      </div>
    `;
  }
}

// Populate companies comparison table on reviews page
function populateComparisonTable(companies) {
  const comparisonTable = document.querySelector('.comparison-table tbody');
  if (!comparisonTable) return;
  
  comparisonTable.innerHTML = '';
  
  companies.forEach(company => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td><strong>${company.rank}</strong></td>
      <td>${company.name}</td>
      <td>${company.minInvestment}</td>
      <td>${company.annualFees}</td>
      <td>${company.buybackProgram}</td>
      <td>${company.bbbRating}</td>
      <td>${company.bestFor}</td>
    `;
    
    comparisonTable.appendChild(row);
  });
}

// Populate quick links navigation on reviews page
function populateQuickLinks(companies) {
  const quickLinksGrid = document.querySelector('.quick-links-grid');
  if (!quickLinksGrid) return;
  
  quickLinksGrid.innerHTML = '';
  
  companies.forEach(company => {
    const quickLink = document.createElement('a');
    quickLink.href = `#${company.id}`;
    quickLink.className = 'quick-link';
    
    const rankClass = company.rank === 1 ? 'top-rank' : '';
    
    quickLink.innerHTML = `
      <span class="quick-link-rank ${rankClass}">${company.rank}</span>
      <span>${company.name}</span>
    `;
    
    quickLinksGrid.appendChild(quickLink);
  });
}

// Populate sticky navigation on reviews page
function populateStickyNav(companies) {
  const stickyCompanies = document.querySelector('.sticky-companies');
  if (!stickyCompanies) return;
  
  stickyCompanies.innerHTML = '';
  
  companies.forEach(company => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="#${company.id}" class="sticky-company-link" data-company="${company.id}">
        <span class="sticky-rank">${company.rank}</span>${company.name.split(' ')[0]}
      </a>
    `;
    
    stickyCompanies.appendChild(li);
  });
}

// Populate detailed company reviews on reviews page
function populateCompanyReviews(companies) {
  companies.forEach(company => {
    // Look for the review card
    const reviewCard = document.getElementById(company.id);
    if (!reviewCard) return;
    
    // Update company header details
    const headerDetails = reviewCard.querySelector('.company-header-details');
    if (headerDetails) {
      const badges = company.id === 'goldcrest' 
        ? '<span class="badge">A+ BBB Rating</span><span class="badge">Zero Complaints</span><span class="badge">Expert Advisory Team</span>'
        : `<span class="badge">${company.bbbRating} BBB Rating</span>`;
      
      headerDetails.innerHTML = `
        <h2 class="company-name">${company.name}</h2>
        <p class="company-tagline">${company.tagline}</p>
        <div class="company-ratings">
          <div class="rating">★★★★${company.ratingValue < 4.9 ? '☆' : '★'} (${company.rating})</div>
          <div class="badges">
            ${badges}
          </div>
        </div>
      `;
    }
    
    // Update company overview in main content
    const reviewSection = reviewCard.querySelector('.review-main .review-section:first-child');
    if (reviewSection && company.description && company.longDescription) {
      reviewSection.innerHTML = `
        <p>${company.description}</p>
        <p>${company.longDescription || ''}</p>
      `;
    }
    
    // Update pros and cons if they exist in our data
    if (company.pros && company.cons) {
      const prosList = reviewCard.querySelector('.pros-section .feature-list');
      const consList = reviewCard.querySelector('.cons-section .feature-list');
      
      if (prosList) {
        prosList.innerHTML = company.pros.map(pro => `<li>${pro}</li>`).join('');
      }
      
      if (consList) {
        consList.innerHTML = company.cons.map(con => `<li>${con}</li>`).join('');
      }
    }
    
    // Update sidebar facts if they exist
    if (company.companyFacts) {
      const factsSection = reviewCard.querySelector('.sidebar-section:nth-child(1)');
      if (factsSection) {
        const facts = company.companyFacts;
        
        factsSection.innerHTML = `
          <h3>Company Facts</h3>
          <div class="data-row">
            <span class="data-label">Founded:</span>
            <span class="data-value">${facts.founded}</span>
          </div>
          <div class="data-row">
            <span class="data-label">Headquarters:</span>
            <span class="data-value">${facts.headquarters}</span>
          </div>
          <div class="data-row">
            <span class="data-label">BBB Rating:</span>
            <span class="data-value">${facts.bbbRating}</span>
          </div>
          <div class="data-row">
            <span class="data-label">TrustPilot:</span>
            <span class="data-value">${facts.trustPilot}</span>
          </div>
          <div class="data-row">
            <span class="data-label">BCA Rating:</span>
            <span class="data-value">${facts.bcaRating}</span>
          </div>
        `;
      }
    }
    
    // Update key details in sidebar
    const keyDetailsSection = reviewCard.querySelector('.sidebar-section:nth-child(2)');
    if (keyDetailsSection) {
      keyDetailsSection.innerHTML = `
        <h3>Key Details</h3>
        <div class="data-row">
          <span class="data-label">Min. Investment:</span>
          <span class="data-value">${company.minInvestment}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Annual Fees:</span>
          <span class="data-value">${company.annualFees}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Storage Options:</span>
          <span class="data-value">Delaware Depository, Brink's</span>
        </div>
        <div class="data-row">
          <span class="data-label">Buyback Program:</span>
          <span class="data-value">${company.buybackProgram}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Shipping:</span>
          <span class="data-value">Free insured shipping</span>
        </div>
      `;
    }
    
    // Update rating breakdown in sidebar if we have ratings
    if (company.ratings) {
      const ratingsSection = reviewCard.querySelector('.sidebar-section:nth-child(3)');
      if (ratingsSection) {
        const ratings = company.ratings;
        
        ratingsSection.innerHTML = `
          <h3>Rating Breakdown</h3>
          <div class="rating-breakdown">
            <div class="rating-row">
              <span class="rating-category">Fee Transparency</span>
              <div class="rating-bar-container">
                <div class="rating-bar" style="width: ${ratings.feeTransparency * 20}%;"></div>
              </div>
              <span class="rating-value">${ratings.feeTransparency.toFixed(1)}/5</span>
            </div>
            <div class="rating-row">
              <span class="rating-category">Educational Resources</span>
              <div class="rating-bar-container">
                <div class="rating-bar" style="width: ${ratings.educationalResources * 20}%;"></div>
              </div>
              <span class="rating-value">${ratings.educationalResources.toFixed(1)}/5</span>
            </div>
            <div class="rating-row">
              <span class="rating-category">Customer Service</span>
              <div class="rating-bar-container">
                <div class="rating-bar" style="width: ${ratings.customerService * 20}%;"></div>
              </div>
              <span class="rating-value">${ratings.customerService.toFixed(1)}/5</span>
            </div>
            <div class="rating-row">
              <span class="rating-category">Product Selection</span>
              <div class="rating-bar-container">
                <div class="rating-bar" style="width: ${ratings.productSelection * 20}%;"></div>
              </div>
              <span class="rating-value">${ratings.productSelection.toFixed(1)}/5</span>
            </div>
            <div class="rating-row">
              <span class="rating-category">Value for Money</span>
              <div class="rating-bar-container">
                <div class="rating-bar" style="width: ${ratings.valueForMoney * 20}%;"></div>
              </div>
              <span class="rating-value">${ratings.valueForMoney.toFixed(1)}/5</span>
            </div>
          </div>
        `;
      }
    }
    
    // Update trust indicators in sidebar
    if (company.trustIndicators) {
      const trustSection = reviewCard.querySelector('.sidebar-section:nth-child(4)');
      if (trustSection) {
        const indicators = company.trustIndicators.map(indicator => `
          <div class="trust-badge">
            <div class="badge-icon">✓</div>
            <span>${indicator}</span>
          </div>
        `).join('');
        
        trustSection.innerHTML = `
          <h3>Trust Indicators</h3>
          ${indicators}
        `;
      }
    }
  });
}

// Update company order on the page based on rank
function updateCompanyOrder(companies) {
  const reviewContainer = document.querySelector('.container');
  if (!reviewContainer) return;
  
  const reviewCards = Array.from(document.querySelectorAll('.review-card'));
  if (reviewCards.length === 0) return;
  
  // Sort companies by rank
  companies.forEach(company => {
    const card = document.getElementById(company.id);
    if (card) {
      // Remove from current position
      card.parentNode.removeChild(card);
      // Add to the end of container
      reviewContainer.appendChild(card);
    }
  });
}

// Initialize all functionality
async function initializeDynamicContent() {
  // Load companies data
  const companies = await loadCompaniesData();
  
  // Sort by rank to ensure correct order
  companies.sort((a, b) => a.rank - b.rank);
  
  // Populate different components based on the current page
  const currentPage = window.location.pathname;
  
  // Home page components
  populateCompaniesTable(companies);
  populateFeaturedCompany(companies);
  
  // Reviews page components
  populateComparisonTable(companies);
  populateQuickLinks(companies);
  populateStickyNav(companies);
  populateCompanyReviews(companies);
  updateCompanyOrder(companies);
}

// Fallback data in case JSON loading fails
function fallbackCompaniesData() {
  return [
    {
      "id": "goldcrest",
      "rank": 1,
      "name": "GoldCrest",
      "tagline": "Best Overall: Industry-leading service with unmatched customer satisfaction",
      "minInvestment": "$20,000",
      "annualFees": "$150 all-inclusive",
      "buybackProgram": "Yes (30-day guarantee)",
      "rating": "4.99/5",
      "ratingValue": 4.99,
      "bbbRating": "A+",
      "bestFor": "Best overall service and value"
    },
    {
      "id": "augusta",
      "rank": 2,
      "name": "Augusta Precious Metals",
      "tagline": "Premium service with exceptional education",
      "minInvestment": "$50,000",
      "annualFees": "$180 flat fee",
      "buybackProgram": "Yes (best price guarantee)",
      "rating": "4.98/5",
      "ratingValue": 4.98,
      "bbbRating": "A+",
      "bestFor": "High-value investors seeking premium service"
    },
    {
      "id": "goldco",
      "rank": 3,
      "name": "Goldco",
      "tagline": "Best Value: Excellent service with moderate minimum investment",
      "minInvestment": "$25,000",
      "annualFees": "$175 + storage",
      "buybackProgram": "Yes",
      "rating": "4.97/5",
      "ratingValue": 4.97,
      "bbbRating": "A+",
      "bestFor": "Mid-level investors needing quality service"
    },
    {
      "id": "american-hartford",
      "rank": 4,
      "name": "American Hartford Gold",
      "tagline": "Best for Beginners: Low minimums with streamlined process",
      "minInvestment": "$10,000",
      "annualFees": "$180 + $100 storage",
      "buybackProgram": "Yes (price match)",
      "rating": "4.88/5",
      "ratingValue": 4.88,
      "bbbRating": "A+",
      "bestFor": "First-time gold investors needing guidance"
    },
    {
      "id": "noble",
      "rank": 5,
      "name": "Noble Gold Investments",
      "tagline": "Lowest Minimum Investment: Most accessible entry point",
      "minInvestment": "$2,000",
      "annualFees": "$225 + $150 for Texas storage",
      "buybackProgram": "Yes",
      "rating": "4.86/5",
      "ratingValue": 4.86,
      "bbbRating": "A-",
      "bestFor": "Small investors or Texas storage preference"
    }
  ];
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeDynamicContent);