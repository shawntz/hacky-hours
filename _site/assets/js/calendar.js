const calendarContainer = document.getElementById('calendar');
const startDate = new Date(); // Today's date
const endDate = new Date(startDate);
endDate.setDate(startDate.getDate() + 13); // Two weeks from now

fetch('/assets/data/schedule.json')
  .then(response => response.json())
  .then(data => {
    const tbody = calendarContainer.querySelector('tbody');
    let currentRow = null;

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
      const formattedDate = currentDate.toISOString().split('T')[0];
      cell.innerHTML = `<div>${currentDate.getDate()}</div>`;

      // Match events for the current date
      const events = data.filter(event => event.date === formattedDate);
      events.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event';
        eventDiv.innerHTML = `${event.time}<br><strong>${event.description}</strong>`;
        cell.appendChild(eventDiv);
      });

      // Add the cell to the current row
      currentRow.appendChild(cell);

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });