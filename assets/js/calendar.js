const calendarContainer = document.getElementById('calendar');
const startDate = new Date("2025-01-05"); // First cell of the calendar (make it a Sunday even though Monday is the first day shown)
const endDate = new Date(startDate);
endDate.setDate(startDate.getDate() + 27); // Two weeks from now

const timestamp = new Date().getTime();

fetch(`/hacky-hours/assets/data/schedule.json?v=${timestamp}`)
  .then(response => response.json())
  .then(data => {
    const tbody = calendarContainer.querySelector('tbody');
    let currentRow = null;

    // Helper function to format date as YYYY-MM-DD in the local time zone
    const formatDateLocal = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Create a new loop counter starting from the first weekday
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();

      // Skip weekends (Saturday: 6, Sunday: 0)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      // Create a new row if it's the start of a week (Monday)
      if (dayOfWeek === 1 || !currentRow) {
        currentRow = document.createElement('tr');
        tbody.appendChild(currentRow);
      }

      // Create a cell for the current day
      const cell = document.createElement('td');
      const formattedDate = formatDateLocal(currentDate); // Use the local time zone
      cell.innerHTML = `<div>${currentDate.getDate()}</div>`;

      // Match events for the current date
      const events = data.filter(event => event.date === formattedDate);
      events.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event';

        // Conditionally include the Zoom link only if event.zoom is not an empty string
        let zoomLink = event.zoom ? `<br><a href="${event.zoom}" target="_blank">(Zoom Link)</a>` : '';
        eventDiv.innerHTML = `${event.time}<br><strong>${event.description}</strong>${zoomLink}`;

        // Check if the event date and time have passed
        const now = new Date(); // Current date and time
        const nowFormattedDate = formatDateLocal(now);

        console.log(formattedDate < nowFormattedDate);
        
        if (formattedDate < nowFormattedDate) {
          eventDiv.style.backgroundColor = '#cfcdcc';
          eventDiv.style.border = '1px solid #cfcdcc';
          eventDiv.style.color = '#878787';
          eventDiv.style.fontWeight = '100';
        }
        
        cell.appendChild(eventDiv);
      });

      // Add the cell to the current row
      currentRow.appendChild(cell);

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });
