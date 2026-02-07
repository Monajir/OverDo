document.addEventListener('DOMContentLoaded', () => {
    // --- POMODORO TIMER LOGIC ---
    const timeDisplay = document.getElementById('timeDisplay');
    const timerProgress = document.getElementById('timerProgress');
    const timerToggleBtn = document.getElementById('timerToggle');
    const timerResetBtn = document.getElementById('timerReset');

    // Only run timer logic if elements exist (dashboard page)
    if (timeDisplay && timerProgress && timerToggleBtn) {
        let timeLeft = 25 * 60; // 25 minutes in seconds
        let totalTime = 25 * 60;
        let timerId = null;
        let isRunning = false;

        // Circle circumference for progress calculation (r=100 -> 2*PI*100 ≈ 628)
        const circumference = 628;
        timerProgress.style.strokeDasharray = `${circumference} ${circumference}`;
        timerProgress.style.strokeDashoffset = circumference; // Start empty or full? Design shows full usually. Let's make it full to empty.
        // Actually design shows "0% complete", so maybe it starts empty and fills up?
        // Let's assume fills up for "complete".
        // 0% complete = full offset. 100% complete = 0 offset.
        timerProgress.style.strokeDashoffset = circumference;

        function updateDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            // Calculate progress
            // If "Remaining Time", then progress is (total - left) / total
            const progress = (totalTime - timeLeft) / totalTime;
            const offset = circumference - (progress * circumference);
            timerProgress.style.strokeDashoffset = offset;

            // Update percentage text if exists
            const percentageText = timeDisplay.nextElementSibling;
            if (percentageText) {
                percentageText.textContent = `${Math.floor(progress * 100)}% complete`;
            }
        }

        function toggleTimer() {
            if (isRunning) {
                clearInterval(timerId);
                timerToggleBtn.innerHTML = '<span class="material-icons-round" style="margin-right: 8px;">play_arrow</span> Start';
                timerToggleBtn.style.backgroundColor = 'var(--primary-orange)';
                timerToggleBtn.style.color = 'white';
                timerToggleBtn.style.border = 'none';
            } else {
                timerId = setInterval(() => {
                    if (timeLeft > 0) {
                        timeLeft--;
                        updateDisplay();
                    } else {
                        clearInterval(timerId);
                        isRunning = false;
                        alert("Focus session complete! Take a break.");
                    }
                }, 1000);
                timerToggleBtn.innerHTML = '<span class="material-icons-round" style="margin-right: 8px;">pause</span> Pause';
                timerToggleBtn.style.backgroundColor = 'transparent';
                timerToggleBtn.style.color = 'var(--text-main)';
                timerToggleBtn.style.border = '2px solid #ddd';
                timerResetBtn.style.display = 'flex';
            }
            isRunning = !isRunning;
        }

        function resetTimer() {
            clearInterval(timerId);
            isRunning = false;
            timeLeft = 25 * 60;
            updateDisplay();
            timerToggleBtn.innerHTML = '<span class="material-icons-round" style="margin-right: 8px;">play_arrow</span> Start Focus';
            timerToggleBtn.style.backgroundColor = 'var(--primary-orange)';
            timerToggleBtn.style.color = 'white';
            timerToggleBtn.style.border = 'none';
            timerResetBtn.style.display = 'none';
        }

        timerToggleBtn.addEventListener('click', toggleTimer);
        timerResetBtn.addEventListener('click', resetTimer);

        // Initial render logic adjust for "Start Focus" state
        timerToggleBtn.innerHTML = '<span class="material-icons-round" style="margin-right: 8px;">play_arrow</span> Start Focus';
        timerToggleBtn.style.backgroundColor = 'var(--primary-orange)';
        timerToggleBtn.style.color = 'white';
        timerToggleBtn.style.border = 'none';
    }

    // --- TASK LOGIC ---
    const taskList = document.getElementById('taskList');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const newTaskInput = document.getElementById('newTaskInput');

    if (taskList && addTaskBtn && newTaskInput) {
        addTaskBtn.addEventListener('click', () => {
            const title = newTaskInput.value.trim();
            if (title) {
                const taskItem = document.createElement('div');
                taskItem.className = 'task-item';
                taskItem.innerHTML = `
                    <div class="checkbox">
                        <span class="material-icons-round" style="font-size: 16px; color: white; display: none;">check</span>
                    </div>
                    <div class="task-content">
                        <div class="flex justify-between items-start">
                            <div class="task-title">${title}</div>
                            <span class="xp-reward">+20 XP</span>
                        </div>
                        <div class="task-meta">
                            <div>Added just now</div>
                        </div>
                    </div>
                `;

                // Add click event for checkbox to new item
                const checkbox = taskItem.querySelector('.checkbox');
                checkbox.addEventListener('click', function (e) {
                    e.stopPropagation(); // prevent parent click
                    this.classList.toggle('checked');
                    if (this.classList.contains('checked')) {
                        this.querySelector('span').style.display = 'block';
                        taskItem.classList.add('completed');
                    } else {
                        this.querySelector('span').style.display = 'none';
                        taskItem.classList.remove('completed');
                    }
                });

                taskList.prepend(taskItem);
                newTaskInput.value = '';
            }
        });

        // Delegate checking logic for existing static items
        const checks = document.querySelectorAll('.checkbox');
        checks.forEach(check => {
            check.addEventListener('click', function (e) {
                e.stopPropagation();
                const parent = this.closest('.task-item');
                this.classList.toggle('checked');
                const icon = this.querySelector('span');

                if (this.classList.contains('checked')) {
                    if (icon) icon.style.display = 'block';
                    if (parent) parent.classList.add('completed');
                } else {
                    if (icon) icon.style.display = 'none';
                    if (parent) parent.classList.remove('completed');
                }
            });
        });
    }
});
