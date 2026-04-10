document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('contribution-grid');
  if (!grid) return;

  const LC_USERNAME = 'Harsh_tadokar';
  const API_URL = `https://leetcode-stats-api.herokuapp.com/${LC_USERNAME}`;

  try {
    // 1. Fetch live stats
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.status === 'success') {
      // 2. Update Stats UI
      document.getElementById('lc-total').textContent = data.totalSolved || 0;
      document.getElementById('lc-easy').textContent = data.easySolved || 0;
      document.getElementById('lc-medium').textContent = data.mediumSolved || 0;
      document.getElementById('lc-hard').textContent = data.hardSolved || 0;

      // 3. Generate Contribution Heat Map
      // Data provides submissionCalendar which is a map of unix timestamps to counts
      const submissions = data.submissionCalendar || {};
      
      generateHeatMap(grid, submissions);
    } else {
      handleApiError(grid);
    }
  } catch (error) {
    console.error("Error fetching LeetCode stats:", error);
    handleApiError(grid);
  }
});

function generateHeatMap(grid, submissions) {
  grid.innerHTML = ''; // clear any existing
  const monthLabelsContainer = document.getElementById('month-labels');
  if (monthLabelsContainer) monthLabelsContainer.innerHTML = '';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dailyCounts = {};
  for (const [timestampStr, count] of Object.entries(submissions)) {
    const timestamp = parseInt(timestampStr, 10) * 1000;
    const dateObj = new Date(timestamp);
    dateObj.setHours(0, 0, 0, 0); 
    const dateKey = dateObj.getTime();
    dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + count;
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let lastMonth = -1;

  for (let i = 363; i >= 0; i--) {
    const squareDate = new Date(today);
    squareDate.setDate(today.getDate() - i);
    const squareKey = squareDate.getTime();
    
    // Check for month label once every 7 days (start of a column)
    if (i % 7 === 0 || i === 363) {
        const currentMonth = squareDate.getMonth();
        if (currentMonth !== lastMonth) {
            if (monthLabelsContainer) {
                const label = document.createElement('span');
                label.classList.add('month-label');
                // Calculate which column (1-52) we are currently creating
                const colIndex = Math.floor((363 - i) / 7) + 1;
                label.style.gridColumn = colIndex;
                label.textContent = months[currentMonth];
                monthLabelsContainer.appendChild(label);
            }
            lastMonth = currentMonth;
        }
    }

    const count = dailyCounts[squareKey] || 0;
    const square = document.createElement('div');
    square.classList.add('contrib-square');
    
    let level = 0;
    if (count > 0 && count <= 2) level = 1;
    else if (count > 2 && count <= 4) level = 2;
    else if (count > 4 && count <= 6) level = 3;
    else if (count > 6) level = 4;

    if (level > 0) {
      square.setAttribute('data-level', level);
    }
    
    const dateStr = squareDate.toDateString();
    square.setAttribute('title', `${count} submissions on ${dateStr}`);
    
    grid.appendChild(square);
  }
}

function handleApiError(grid) {
  document.getElementById('lc-total').textContent = "-";
  document.getElementById('lc-easy').textContent = "-";
  document.getElementById('lc-medium').textContent = "-";
  document.getElementById('lc-hard').textContent = "-";

  // Generate empty grid on error
  grid.innerHTML = '';
  for (let i = 0; i < 364; i++) {
    const square = document.createElement('div');
    square.classList.add('contrib-square');
    grid.appendChild(square);
  }
}

