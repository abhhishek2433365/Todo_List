document.addEventListener('DOMContentLoaded', () => {
    const taskinput = document.getElementById('taskinput');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todosContainer = document.querySelector('.todos-container');
    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');

    
    const saveTasks = () => {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            const text = li.querySelector('span').textContent;
            const completed = li.querySelector('.checkbox').checked;
            tasks.push({ text, completed });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTask(task.text, task.completed, false));
    };

    const toggleEmptyState = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
        todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    };

 const updateProgress = () => {
    const totalTasks = taskList.children.length;
    const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;

    progressBar.style.width = totalTasks 
        ? `${(completedTasks / totalTasks) * 100}%`
        : '0%';

    progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;

    if (totalTasks > 0 && completedTasks === totalTasks) {
        confettiSettings();
    }
};


    const addTask = (text, completed = false, save = true) => {
        const taskText = text || taskinput.value.trim();
        if (!taskText) return;

        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}/>
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');

        if (completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? '0.5' : '1';
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
            saveTasks();
            updateProgress();
        });

        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskinput.value = li.querySelector('span').textContent;
                li.remove();
                toggleEmptyState();
                saveTasks();
                updateProgress();
            }
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            saveTasks();
            updateProgress();
        });

        taskList.appendChild(li);
        taskinput.value = '';
        toggleEmptyState();
        updateProgress();

        if (save) saveTasks();
    };

    addTaskBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addTask();
    });

    taskinput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    loadTasks();
    toggleEmptyState();
    updateProgress();
});



