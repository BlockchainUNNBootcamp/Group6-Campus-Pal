// Shared Functions
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('campusPalUser'));
    if (!user && !window.location.pathname.includes('auth.html')) {
      window.location.href = 'auth.html';
    }
    return user;
  }
  
  function updateUserGreeting() {
    const greeting = document.getElementById('user-greeting');
    if (greeting) {
      const user = JSON.parse(localStorage.getItem('campusPalUser'));
      greeting.textContent = user ? `Hi, ${user.username}!` : '';
    }
  }
  
  function logout() {
    localStorage.removeItem('campusPalUser');
    window.location.href = 'auth.html';
  }
  
  // Index Page
  if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  
    // Navbar shadow
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('navbar');
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }
  
  // Auth Page
  if (window.location.pathname.includes('auth.html')) {
    function showTab(tab) {
      document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.auth-form').forEach(form => form.classList.add('hidden'));
      document.getElementById(`${tab}-form`).classList.remove('hidden');
      document.querySelector(`[onclick="showTab('${tab}')"]`).classList.add('active');
    }
  
    window.signup = function(event) {
      event.preventDefault();
      const username = document.getElementById('signup-username').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      localStorage.setItem('campusPalUser', JSON.stringify({ username, email, password }));
      alert('Signed up! Welcome to Campus Pal!');
      window.location.href = 'index.html';
    };
  
    window.login = function(event) {
      event.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const user = JSON.parse(localStorage.getItem('campusPalUser'));
      if (user && user.email === email && user.password === password) {
        alert(`Welcome back, ${user.username}!`);
        window.location.href = 'index.html';
      } else {
        alert('Invalid email or password.');
      }
    };
  }
  
  // Forum Page
  if (window.location.pathname.includes('forum.html')) {
    checkAuth();
    updateUserGreeting();
  
    let posts = JSON.parse(localStorage.getItem('campusPalPosts')) || [];
  
    function addPost(event) {
      event.preventDefault();
      const content = document.getElementById('post-content').value;
      const user = JSON.parse(localStorage.getItem('campusPalUser'));
      posts.push({
        id: Date.now(),
        username: user.username,
        content,
        date: new Date().toLocaleString()
      });
      localStorage.setItem('campusPalPosts', JSON.stringify(posts));
      document.getElementById('post-form').reset();
      updatePosts();
    }
  
    function updatePosts() {
      document.getElementById('posts').innerHTML = posts.map(post => `
        <div class="post">
          <p><strong>${post.username}</strong> <span>${post.date}</span></p>
          <p>${post.content}</p>
        </div>
      `).join('');
    }
  
    window.addPost = addPost;
    updatePosts();
  }
  
  // Events Page
  if (window.location.pathname.includes('events.html')) {
    checkAuth();
    updateUserGreeting();
  
    let events = JSON.parse(localStorage.getItem('campusPalEvents')) || [];
  
    function addEvent(event) {
      event.preventDefault();
      const title = document.getElementById('event-title').value;
      const date = document.getElementById('event-date').value;
      const description = document.getElementById('event-description').value;
      events.push({
        id: Date.now(),
        title,
        date,
        description
      });
      localStorage.setItem('campusPalEvents', JSON.stringify(events));
      document.getElementById('event-form').reset();
      updateEvents();
    }
  
    function deleteEvent(id) {
      events = events.filter(e => e.id !== id);
      localStorage.setItem('campusPalEvents', JSON.stringify(events));
      updateEvents();
    }
  
    function updateEvents() {
      document.getElementById('events-list').innerHTML = events.map(event => `
        <div class="event">
          <h3>${event.title}</h3>
          <p>Date: ${event.date}</p>
          <p>${event.description || 'No description'}</p>
          <button onclick="deleteEvent(${event.id})" class="btn secondary">Delete</button>
        </div>
      `).join('');
    }
  
    window.addEvent = addEvent;
    window.deleteEvent = deleteEvent;
    updateEvents();
  }
  
  // Matching Page
  if (window.location.pathname.includes('matching.html')) {
    checkAuth();
    updateUserGreeting();
  
    let profiles = JSON.parse(localStorage.getItem('campusPalProfiles')) || [];
  
    function updateProfile(event) {
      event.preventDefault();
      const interests = document.getElementById('profile-interests').value;
      const user = JSON.parse(localStorage.getItem('campusPalUser'));
      profiles = profiles.filter(p => p.email !== user.email);
      profiles.push({ email: user.email, username: user.username, interests });
      localStorage.setItem('campusPalProfiles', JSON.stringify(profiles));
      updateMatches();
    }
  
    function updateMatches() {
      const user = JSON.parse(localStorage.getItem('campusPalUser'));
      const userProfile = profiles.find(p => p.email === user.email);
      const matches = profiles.filter(p => p.email !== user.email && userProfile && p.interests.includes(userProfile.interests.split(',')[0]));
      document.getElementById('matches').innerHTML = matches.length ? matches.map(p => `
        <div class="match">
          <p>${p.username} shares your interest in ${p.interests.split(',')[0]}</p>
        </div>
      `).join('') : '<p>No matches yet—update your interests!</p>';
    }
  
    window.updateProfile = updateProfile;
    updateMatches();
  }
  
  // Tracker Page
  if (window.location.pathname.includes('tracker.html')) {
    checkAuth();
    updateUserGreeting();
  
    let tasks = JSON.parse(localStorage.getItem('campusPalTasks')) || [];
  
    function addTask(event) {
      event.preventDefault();
      const title = document.getElementById('task-title').value;
      const due = document.getElementById('task-due').value;
      tasks.push({
        id: Date.now(),
        title,
        due,
        completed: false
      });
      localStorage.setItem('campusPalTasks', JSON.stringify(tasks));
      document.getElementById('task-form').reset();
      updateTasks();
    }
  
    function toggleTask(id) {
      tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      localStorage.setItem('campusPalTasks', JSON.stringify(tasks));
      updateTasks();
    }
  
    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      localStorage.setItem('campusPalTasks', JSON.stringify(tasks));
      updateTasks();
    }
  
    function updateTasks() {
      document.getElementById('tasks').innerHTML = tasks.map(task => `
        <div class="task ${task.completed ? 'completed' : ''}">
          <p>${task.title} (Due: ${task.due})</p>
          <div>
            <button onclick="toggleTask(${task.id})" class="btn secondary">${task.completed ? 'Undo' : 'Complete'}</button>
            <button onclick="deleteTask(${task.id})" class="btn secondary">Delete</button>
          </div>
        </div>
      `).join('');
    }
  
    window.addTask = addTask;
    window.toggleTask = toggleTask;
    window.deleteTask = deleteTask;
    updateTasks();
  }