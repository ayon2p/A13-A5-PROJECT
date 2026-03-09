const loginBtn = document.getElementById('login-btn');

if (loginBtn) {
    loginBtn.addEventListener('click', function() {
        const inputUsername = document.getElementById('input-username');
        const inputPassword = document.getElementById('input-password');

        if (inputUsername && inputPassword) {
            const inputName = inputUsername.value;
            const pass = inputPassword.value;

            if (inputName === "admin" && pass === "admin123") {
              localStorage.setItem('isLoggedIn', 'true');
                window.location.href = "home.html";
            } else {
                alert('your password is incorrect!');
            }
        }
    });
}

if (window.location.pathname.includes('home.html')) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn !== 'true') {
        alert('again try this');
        window.location.href = "index.html"; 
    } else {
     
        loadInitialData();
    }
}


let allIssues = [];
function loadInitialData() {
    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
        .then(res => res.json())
        .then(res => {
            allIssues = res.data;
            displayIssues(allIssues);
        });
}

function displayIssues(issues) {
    const container = document.getElementById("issuesContainer");
    const issueCount = document.getElementById("issueCount");
    
    if (!container) return;
    container.innerHTML = "";
    issueCount.innerText = `${issues.length} Issues`;

    issues.forEach(issue => {
        const card = document.createElement('div');
        const borderClass = issue.status === 'open' ? 'border-[#22c55e]' : 'border-[#a855f7]';
        card.className = `card bg-white shadow-sm border-t-4 ${borderClass} p-5 rounded-lg cursor-pointer transition-none`;

     
        const statusImg = issue.status === 'open' ? 'assets/Open-Status.png' : 'assets/Closed- Status .png';
        const labels = issue.labels || [];

        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <img src="${statusImg}" alt="status" class="w-6 h-6">
                <span class="text-[10px] font-bold px-2 py-1 rounded bg-orange-50 text-orange-400 uppercase">
                    ${issue.priority || 'MEDIUM'}
                </span>
            </div>
            <h2 class="font-bold text-[15px] mb-2 text-gray-800 line-clamp-1">${issue.title}</h2>
            <p class="text-gray-400 text-[13px] mb-4 line-clamp-2">${issue.description || 'No description'}</p>
            
            <div class="flex flex-wrap gap-2 mb-6">
                ${labels.map(label => {
                    const color = label.toLowerCase() === 'bug' ? 'border-red-200 text-red-400' : 'border-orange-200 text-orange-400';
                    return `<span class="border ${color} text-[9px] font-bold px-2 py-1 rounded-md uppercase">${label}</span>`;
                }).join('')}
            </div>
            
            <div class="pt-4 border-t border-gray-100 text-[11px] text-gray-400">
                <p>#${issue.id} by <span class="text-gray-600 font-medium">${issue.author}</span></p>
                <p>${issue.createdAt}</p>
            </div>
        `;

        card.onclick = () => openModalWithSingleIssue(issue.id);
        container.appendChild(card);
    });
}