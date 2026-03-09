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



async function openModalWithSingleIssue(id) {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const result = await res.json();
    const issue = result.data;

    const modal = document.getElementById('issueModal');
    const modalContent = document.getElementById('modalDetails');
    const statusBg = issue.status === 'open' ? 'bg-[#22c55e]' : 'bg-[#a855f7]';
    
 
    const dateDisplay = issue.updatedAt ? `on ${issue.updatedAt}` : "";

    modalContent.innerHTML = `
        <div class="p-8 pb-4 text-left">
            <h2 class="text-2xl font-bold mb-2 text-gray-800">${issue.title}</h2>
            <div class="flex items-center gap-2 mb-4 text-sm text-gray-400">
                <span class="${statusBg} text-white px-3 py-0.5 rounded-full text-[10px] font-bold capitalize">${issue.status}</span>
                <span>• Opened by <b>${issue.author}</b> ${dateDisplay}</span>
            </div>
            <div class="flex gap-2 mb-6">
                ${(issue.labels || []).map(label => `<button class="border border-red-100 text-red-500 bg-red-50 px-3 py-1 rounded text-[10px] font-bold uppercase">${label}</button>`).join('')}
            </div>
            <p class="text-gray-500 text-sm mb-10 leading-relaxed text-left">${issue.description || 'No description available.'}</p>
        </div>

        <div class="bg-gray-50 p-8 flex justify-between items-center border-t border-gray-100">
            <div class="flex gap-16">
                <div>
                    <p class="text-xs text-gray-400 mb-1 font-medium">Assignee:</p>
                    <p class="font-bold text-gray-700">${issue.author}</p>
                </div>
                <div>
                    <p class="text-xs text-gray-400 mb-1 font-medium">Priority:</p>
                    <span class="bg-red-500 text-white px-4 py-1 rounded-md text-[10px] font-bold uppercase">${issue.priority || 'MEDIUM'}</span>
                </div>
            </div>
            <button onclick="closeModal()" class="btn btn-primary bg-[#6366f1] border-none px-10 rounded-lg text-white font-bold uppercase">Close</button>
        </div>
    `;
    modal.classList.add('modal-open');
}