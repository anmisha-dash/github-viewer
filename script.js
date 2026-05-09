async function searchUser() {
  const username = document.getElementById('usernameInput').value.trim();
  if (!username) return;
  fetchUser(username);
}

function quickSearch(username) {
  document.getElementById('usernameInput').value = username;
  fetchUser(username);
}

async function fetchUser(username) {
  showLoader();

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=5`)
    ]);

    if (!userRes.ok) {
      showError('User not found! Check the username.');
      return;
    }

    const user  = await userRes.json();
    const repos = await reposRes.json();

    displayProfile(user, repos);

  } catch (err) {
    showError('Something went wrong. Check your connection!');
  }
}

function displayProfile(user, repos) {
  document.getElementById('avatar').src           = user.avatar_url;
  document.getElementById('profileName').textContent  = user.name || user.login;
  document.getElementById('profileLogin').textContent = '@' + user.login;
  document.getElementById('profileBio').textContent   = user.bio || '';

  document.getElementById('profileLocation').textContent =
    user.location ? '📍 ' + user.location : '';
  document.getElementById('profileBlog').textContent =
    user.blog ? '🔗 ' + user.blog : '';
  document.getElementById('profileJoined').textContent =
    '📅 Joined ' + new Date(user.created_at).toLocaleDateString('en-IN', {
      month: 'short', year: 'numeric'
    });

  document.getElementById('repoCount').textContent      = user.public_repos;
  document.getElementById('followerCount').textContent  = formatNum(user.followers);
  document.getElementById('followingCount').textContent = user.following;
  document.getElementById('gistCount').textContent      = user.public_gists;
  document.getElementById('viewBtn').href               = user.html_url;

  const reposList = document.getElementById('reposList');
  reposList.innerHTML = '';

  repos.forEach(repo => {
    const a = document.createElement('a');
    a.className = 'repo-card';
    a.href      = repo.html_url;
    a.target    = '_blank';
    a.innerHTML = `
      <div class="repo-name">${repo.name}</div>
      <div class="repo-desc">${repo.description || 'No description'}</div>
      <div class="repo-meta">
        <span>⭐ ${repo.stargazers_count}</span>
        <span>🍴 ${repo.forks_count}</span>
        <span>${repo.language || 'Unknown'}</span>
      </div>
    `;
    reposList.appendChild(a);
  });

  hideAll();
  document.getElementById('profile').style.display = 'block';
}

function formatNum(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num;
}

function showLoader() {
  hideAll();
  document.getElementById('loader').style.display = 'flex';
}

function showError(msg) {
  hideAll();
  document.getElementById('errorBox').style.display = 'block';
  document.getElementById('errorMsg').textContent   = msg;
  document.getElementById('defaultState').style.display = 'block';
}

function hideAll() {
  document.getElementById('loader').style.display       = 'none';
  document.getElementById('errorBox').style.display     = 'none';
  document.getElementById('profile').style.display      = 'none';
  document.getElementById('defaultState').style.display = 'none';
}