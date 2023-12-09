$(document).ready(function () {
  const currentDayEl = $('#currentDay');
  dayjs.extend(window.dayjs_plugin_advancedFormat);
  currentDayEl.text(dayjs().format('ddd Do MMMM'));

  const createTask = function (hour, task) {
    return { hour, task };
  };

  const render = function () {
    const container = $('.container');
    container.html('');
    const currentTime = 15;

    for (let i = 9; i <= 17; i++) {
      const taskTime = dayjs().startOf('day').hour(i);
      const hour = taskTime.format('ha');

      const timeBlock = $('<div>').addClass('time-block');
      const hourDiv = $('<div>').addClass('hour').text(hour);
      const rowDiv = $('<div>').addClass('row');
      const textarea = $('<textarea>').attr('name', 'task').attr('cols', '30').attr('rows', '3');
      const saveDiv = $('<div>').addClass('save').html('<i class="fa-regular fa-floppy-disk fa-2xl"></i>');

      rowDiv.append(textarea);
      timeBlock.append(hourDiv, rowDiv, saveDiv);

      // Append the time block to the container
      container.append(timeBlock);

      // styling based on current time
      if (i < currentTime) {
        rowDiv.toggleClass('past').removeClass('present future');
      } else if (i === currentTime) {
        rowDiv.toggleClass('present').removeClass('past future');
      } else {
        rowDiv.toggleClass('future').removeClass('past present');
      }
    }

    const saveTask = function (hour, task) {
      let savedTasks = JSON.parse(localStorage.getItem('savedTasks')) || [];

      // Check if the hour already exists in saved tasks
      const existingTaskIndex = savedTasks.findIndex((savedTask) => savedTask.hour === hour);

      if (existingTaskIndex !== -1) {
        // Update the task if the hour already exists
        savedTasks[existingTaskIndex].task = task;
      } else {
        // Add a new task if the hour doesn't exist
        savedTasks.push({ hour, task });
      }

      // Save the updated tasks array to local storage
      localStorage.setItem('savedTasks', JSON.stringify(savedTasks));
    };
  };

  render();
});
