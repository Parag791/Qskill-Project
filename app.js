const form = document.getElementById('taskForm');
const input = document.getElementById('taskInput');
const list = document.getElementById('taskList');
const status = document.getElementById('status');

async function request(url, options = {}) {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}
function showMessage(message) { status.textContent = message; }
async function loadTasks() {
  try {
    const tasks = await request('/api/tasks');
    list.replaceChildren();
    if (!tasks.length) { const empty = document.createElement('li'); empty.textContent = 'No tasks yet. Add your first task above!'; list.append(empty); return; }
    tasks.forEach(task => {
      const li = document.createElement('li');
      const check = document.createElement('input'); check.type = 'checkbox'; check.checked = task.completed; check.setAttribute('aria-label', 'Mark task complete');
      check.addEventListener('change', async () => { try { await request(`/api/tasks/${task.id}`, { method: 'PATCH', body: JSON.stringify({ completed: check.checked }) }); loadTasks(); } catch(e) { showMessage(e.message); } });
      const title = document.createElement('span'); title.className = 'title' + (task.completed ? ' done' : ''); title.textContent = task.title;
      const del = document.createElement('button'); del.className = 'delete'; del.textContent = 'Delete';
      del.addEventListener('click', async () => { try { await request(`/api/tasks/${task.id}`, { method: 'DELETE' }); showMessage('Task deleted.'); loadTasks(); } catch(e) { showMessage(e.message); } });
      li.append(check, title, del); list.append(li);
    });
  } catch (e) { showMessage(e.message); }
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  try { await request('/api/tasks', { method: 'POST', body: JSON.stringify({ title: input.value }) }); input.value = ''; showMessage('Task added.'); loadTasks(); }
  catch(e) { showMessage(e.message); }
});
loadTasks();
