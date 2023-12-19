$(document).ready(function () {
    const currentDayEl = $('#currentDay');
    dayjs.extend(window.dayjs_plugin_advancedFormat);
    currentDayEl.text(dayjs().format('ddd Do MMMM'));

    const createTask = function (hour, task) {
        return { hour, task };
    };

    // render timeblocks upon loading the page and style based on time
    const render = function () {
        const container = $('.container');
        container.html('');
        const currentTime = dayjs().format('H');

        for (let i = 9; i <= 17; i++) {
            const taskTime = dayjs().startOf('day').hour(i);
            const hour = taskTime.format('ha');

            const timeBlock = $('<div>').addClass('time-block');
            const hourDiv = $('<div>').addClass('hour').text(hour);
            const rowDiv = $('<div>').addClass('row');
            const textarea = $('<textarea>').attr('name', 'task').attr('cols', '30').attr('rows', '3');
            const saveDiv = $('<div>').addClass('save saveBtn').html('<i class="fa-regular fa-floppy-disk fa-xl"></i>');

            rowDiv.append(textarea);
            timeBlock.append(hourDiv, rowDiv, saveDiv);

            container.append(timeBlock);

            if (i < currentTime) {
                rowDiv.addClass('row past').removeClass('present future');
            } else if (i === currentTime) {
                rowDiv.addClass('row present').removeClass('past future');
            } else {
                rowDiv.addClass('row future').removeClass('past present');
            }
        }

        // retrieving previously saved timeblocks and rendering them
        const savedTasks = JSON.parse(localStorage.getItem('savedTasks')) || [];

        savedTasks.forEach((savedTask) => {
            const hour = savedTask.hour;
            const task = savedTask.task;
            const textarea = $(`.container .hour:contains(${hour})`).siblings('.row').find('textarea');
            textarea.val(task);
        });
    };

    render();

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

        // Save the updated tasks to local storage
        localStorage.setItem('savedTasks', JSON.stringify(savedTasks));
    };

    // save event listener
    $('.container').on('click', '.save', function () {
        const hour = $(this).siblings('.hour').text(); // Get the hour text
        const task = $(this).siblings('.row').find('textarea').val(); // Get the task content
        saveTask(hour, task);
    });
});
