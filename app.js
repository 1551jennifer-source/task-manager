// ===== Data Store =====
const employees = [
    { id: 1, name: '김민수', role: '개발팀', color: '#6366f1', initial: '김' },
    { id: 2, name: '이영희', role: '디자인팀', color: '#8b5cf6', initial: '이' },
    { id: 3, name: '박지훈', role: '마케팅팀', color: '#06b6d4', initial: '박' }
];

let tasks = [
    {
        id: 1,
        title: '신규 기능 개발',
        description: '사용자 인증 시스템 구현',
        assigneeId: 1,
        status: 'in-progress',
        priority: 'high',
        deadline: '2026-02-05',
        createdAt: new Date('2026-01-25')
    },
    {
        id: 2,
        title: '홈페이지 디자인 리뉴얼',
        description: '메인 페이지 UI/UX 개선',
        assigneeId: 2,
        status: 'pending',
        priority: 'medium',
        deadline: '2026-02-10',
        createdAt: new Date('2026-01-26')
    },
    {
        id: 3,
        title: 'SNS 마케팅 캠페인',
        description: '신제품 런칭 홍보 콘텐츠 제작',
        assigneeId: 3,
        status: 'completed',
        priority: 'high',
        deadline: '2026-01-28',
        createdAt: new Date('2026-01-20')
    },
    {
        id: 4,
        title: 'API 문서 작성',
        description: 'REST API 엔드포인트 문서화',
        assigneeId: 1,
        status: 'pending',
        priority: 'low',
        deadline: '2026-02-15',
        createdAt: new Date('2026-01-27')
    }
];

let taskIdCounter = 5;
let currentFilter = 'all';

// ===== DOM Elements =====
const navButtons = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view');
const filterButtons = document.querySelectorAll('.filter-btn');
const taskModal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');
const assigneeSelect = document.getElementById('task-assignee');

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initFilters();
    populateAssigneeSelect();
    renderAll();
});

// ===== Navigation =====
function initNavigation() {
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const viewName = btn.dataset.view;
            switchView(viewName);
        });
    });
}

function switchView(viewName) {
    // Update nav buttons
    navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // Update views
    views.forEach(view => {
        view.classList.toggle('active', view.id === `${viewName}-view`);
    });

    renderAll();
}

// ===== Filters =====
function initFilters() {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            filterButtons.forEach(b => b.classList.toggle('active', b === btn));
            renderTasksTable();
        });
    });
}

// ===== Populate Assignee Select =====
function populateAssigneeSelect() {
    assigneeSelect.innerHTML = '<option value="">담당자를 선택하세요</option>';
    employees.forEach(emp => {
        const option = document.createElement('option');
        option.value = emp.id;
        option.textContent = `${emp.name} (${emp.role})`;
        assigneeSelect.appendChild(option);
    });
}

// ===== Render Functions =====
function renderAll() {
    renderStats();
    renderEmployeesSummary();
    renderRecentTasks();
    renderEmployeesCards();
    renderTasksTable();
}

function renderStats() {
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;

    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-progress').textContent = inProgress;
    document.getElementById('stat-completed').textContent = completed;
    document.getElementById('stat-total').textContent = tasks.length;
}

function renderEmployeesSummary() {
    const container = document.getElementById('employees-summary');
    container.innerHTML = employees.map(emp => {
        const empTasks = tasks.filter(t => t.assigneeId === emp.id);
        const pending = empTasks.filter(t => t.status === 'pending').length;
        const inProgress = empTasks.filter(t => t.status === 'in-progress').length;
        const completed = empTasks.filter(t => t.status === 'completed').length;

        return `
            <div class="employee-item">
                <div class="employee-info">
                    <div class="employee-avatar" style="background: ${emp.color}">${emp.initial}</div>
                    <div class="employee-details">
                        <h4>${emp.name}</h4>
                        <span>${emp.role}</span>
                    </div>
                </div>
                <div class="employee-stats">
                    <div class="mini-stat">
                        <span class="mini-stat-value">${pending}</span>
                        <span class="mini-stat-label">대기</span>
                    </div>
                    <div class="mini-stat">
                        <span class="mini-stat-value">${inProgress}</span>
                        <span class="mini-stat-label">진행</span>
                    </div>
                    <div class="mini-stat">
                        <span class="mini-stat-value">${completed}</span>
                        <span class="mini-stat-label">완료</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderRecentTasks() {
    const container = document.getElementById('recent-tasks-list');
    const recentTasks = [...tasks]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5);

    container.innerHTML = recentTasks.map(task => {
        const assignee = employees.find(e => e.id === task.assigneeId);
        return `
            <div class="task-item">
                <div class="task-info">
                    <div class="employee-avatar" style="background: ${assignee?.color || '#666'}; width: 36px; height: 36px; font-size: 14px;">
                        ${assignee?.initial || '?'}
                    </div>
                    <div>
                        <h4>${task.title}</h4>
                        <span>${assignee?.name || '미배정'} • ${formatDate(task.deadline)}</span>
                    </div>
                </div>
                <div class="task-meta">
                    <span class="status-badge ${task.status}" onclick="cycleStatus(${task.id})">
                        ${getStatusText(task.status)}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

function renderEmployeesCards() {
    const container = document.getElementById('employees-cards');
    container.innerHTML = employees.map(emp => {
        const empTasks = tasks.filter(t => t.assigneeId === emp.id);
        const pending = empTasks.filter(t => t.status === 'pending').length;
        const inProgress = empTasks.filter(t => t.status === 'in-progress').length;
        const completed = empTasks.filter(t => t.status === 'completed').length;

        return `
            <div class="employee-card">
                <div class="avatar-large" style="background: linear-gradient(135deg, ${emp.color}, ${adjustColor(emp.color, 30)})">
                    ${emp.initial}
                </div>
                <h3>${emp.name}</h3>
                <p class="role">${emp.role}</p>
                <div class="stats-row">
                    <div class="stat">
                        <span class="stat-num">${pending}</span>
                        <span class="stat-text">대기중</span>
                    </div>
                    <div class="stat">
                        <span class="stat-num">${inProgress}</span>
                        <span class="stat-text">진행중</span>
                    </div>
                    <div class="stat">
                        <span class="stat-num">${completed}</span>
                        <span class="stat-text">완료</span>
                    </div>
                </div>
                <div class="employee-tasks-list">
                    <h4>현재 업무</h4>
                    ${empTasks.filter(t => t.status !== 'completed').map(t => `
                        <div class="task-item" style="margin-top: 8px;">
                            <div class="task-info" style="gap: 8px;">
                                <span class="priority-badge ${t.priority}">${getPriorityText(t.priority)}</span>
                                <span style="font-size: 13px;">${t.title}</span>
                            </div>
                            <span class="status-badge ${t.status}" onclick="cycleStatus(${t.id})" style="font-size: 11px;">
                                ${getStatusText(t.status)}
                            </span>
                        </div>
                    `).join('') || '<p style="color: var(--text-secondary); font-size: 13px;">배정된 업무가 없습니다</p>'}
                </div>
            </div>
        `;
    }).join('');
}

function renderTasksTable() {
    const container = document.getElementById('all-tasks-list');
    let filteredTasks = tasks;

    if (currentFilter !== 'all') {
        filteredTasks = tasks.filter(t => t.status === currentFilter);
    }

    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
                <p style="font-size: 48px; margin-bottom: 16px;">📭</p>
                <p>표시할 업무가 없습니다</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredTasks.map(task => {
        const assignee = employees.find(e => e.id === task.assigneeId);
        return `
            <div class="task-row">
                <div class="task-title">
                    ${task.title}
                    <small>${task.description || '-'}</small>
                </div>
                <div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div class="employee-avatar" style="background: ${assignee?.color || '#666'}; width: 28px; height: 28px; font-size: 12px;">
                            ${assignee?.initial || '?'}
                        </div>
                        <span style="font-size: 14px;">${assignee?.name || '미배정'}</span>
                    </div>
                </div>
                <div>
                    <span class="priority-badge ${task.priority}">${getPriorityText(task.priority)}</span>
                </div>
                <div style="font-size: 14px; color: var(--text-secondary);">
                    ${formatDate(task.deadline)}
                </div>
                <div>
                    <span class="status-badge ${task.status}" onclick="cycleStatus(${task.id})">
                        ${getStatusText(task.status)}
                    </span>
                </div>
                <div>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

// ===== Task Actions =====
function cycleStatus(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const statusOrder = ['pending', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(task.status);
    task.status = statusOrder[(currentIndex + 1) % statusOrder.length];

    renderAll();
}

function deleteTask(taskId) {
    if (confirm('정말 이 업무를 삭제하시겠습니까?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        renderAll();
    }
}

// ===== Modal =====
function openNewTaskModal() {
    taskModal.classList.add('active');
    taskForm.reset();

    // Set default deadline to today + 7 days
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    document.getElementById('task-deadline').value = defaultDate.toISOString().split('T')[0];
}

function closeNewTaskModal() {
    taskModal.classList.remove('active');
}

function handleTaskSubmit(e) {
    e.preventDefault();

    const newTask = {
        id: taskIdCounter++,
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        assigneeId: parseInt(document.getElementById('task-assignee').value),
        priority: document.getElementById('task-priority').value,
        deadline: document.getElementById('task-deadline').value,
        status: 'pending',
        createdAt: new Date()
    };

    tasks.push(newTask);
    closeNewTaskModal();
    renderAll();
}

// Close modal on outside click
taskModal.addEventListener('click', (e) => {
    if (e.target === taskModal) {
        closeNewTaskModal();
    }
});

// ===== Utility Functions =====
function getStatusText(status) {
    const statusMap = {
        'pending': '대기중',
        'in-progress': '진행중',
        'completed': '완료'
    };
    return statusMap[status] || status;
}

function getPriorityText(priority) {
    const priorityMap = {
        'high': '높음',
        'medium': '보통',
        'low': '낮음'
    };
    return priorityMap[priority] || priority;
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
}

function adjustColor(hex, percent) {
    // Lighten or darken a hex color
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
}
