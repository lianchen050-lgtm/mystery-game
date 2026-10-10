const posts = [
  {
    id: "p1",
    author: "Mira Chen",
    avatarClass: "a1",
    handle: "@mirachen",
    time: "2 hours ago",
    body: "At 10:47 PM, the dormitory alarm suddenly went off, but I definitely saw the corridor lights on the 3rd floor. Someone at the stairwell turned to look at me as if they were waiting for me to leave.",
    tags: ["#night", "#dorm", "#something's-wrong"],
    clue: {
      title: "Alarm Timeline",
      text: "The 10:47 PM alarm and the 3rd-floor corridor light suggest someone deliberately created a disturbance to draw attention away from the real action."
    }
  },
  {
    id: "p2",
    author: "Avery Lin",
    avatarClass: "a2",
    handle: "@averylin",
    time: "5 hours ago",
    body: "I saw a photo in the 6th-floor class group chat: someone was standing on the balcony, and the background was a blurred ceiling. The photo was sent and deleted instantly. I still remember the person was wearing a black jacket with a small white band on the sleeve.",
    tags: ["#photo", "#floor6", "#black-jacket"],
    clue: {
      title: "White Sleeve Band",
      text: "A black jacket with a white band on the sleeve may be the key identifying mark for a suspect or a hidden accomplice."
    }
  },
  {
    id: "p3",
    author: "Sofia Lee",
    avatarClass: "a3",
    handle: "@sofia_lee",
    time: "this morning",
    body: "Someone said the teacher had a problem and the elevator stopped at 9th floor. The door had a red jelly candy stuck in it. I only saw that kind of candy once before—in the dormitory lost-and-found box behind the office.",
    tags: ["#jelly-candy", "#lost-and-found", "#office"],
    clue: {
      title: "Lost-and-Found Box",
      text: "The red jelly candy along with the lost-and-found box suggests the evidence was hidden near the management office."
    }
  },
  {
    id: "p4",
    author: "Admin Noah",
    avatarClass: "a4",
    handle: "@admin_noah",
    time: "last night",
    body: "After lunch today, the conference room door was slightly open. The whiteboard had been wiped clean, but one sentence remained in a faint trace: '10/10 of secret'. I’m not sure if it was a prank, but that phrase made me feel uneasy.",
    tags: ["#whiteboard", "#secret", "#10/10"],
    clue: {
      title: "Whiteboard Message",
      text: "The phrase '10/10 of secret' is likely the main clue and the final hidden answer."
    }
  },
  {
    id: "p5",
    author: "Ethan Ross",
    avatarClass: "a5",
    handle: "@ethan_ross",
    time: "2 minutes ago",
    body: "Someone in the edit log saw a comment: 'If you cannot see the real answer, treat every person as the same person.' This message feels like a warning: don’t trust appearances, the true secret is hidden in plain sight.",
    tags: ["#clue", "#hidden", "#truth"],
    clue: {
      title: "The Real Answer",
      text: "All evidence points to the same conclusion: the answer is not just a phrase, but the acknowledgment of a hidden truth behind the obvious."
    }
  }
];

const discoveredClues = [];
const secretKey = "10/10的秘密";
const state = {
  activeTab: "all",
  clueCount: 0,
  progress: 0,
  unlocked: false
};

const postList = document.getElementById("post-list");
const clueList = document.getElementById("clue-list");
const modal = document.getElementById("post-modal");
const modalBody = document.getElementById("modal-body");
const clueCountText = document.getElementById("clue-count");
const progressText = document.getElementById("progress-text");
const answerInput = document.getElementById("answer-input");
const answerFeedback = document.getElementById("answer-feedback");
const mysteryText = document.getElementById("mystery-text");
const secretModal = document.getElementById("secret-modal");
const secretTitle = document.getElementById("secret-title");
const secretMessage = document.getElementById("secret-message");
const secretReward = document.getElementById("secret-reward");

function renderPosts() {
  postList.innerHTML = "";

  posts.forEach((post) => {
    const card = document.createElement("article");
    card.className = "post-card";

    const header = document.createElement("div");
    header.className = "post-header";

    const avatar = document.createElement("div");
    avatar.className = `avatar ${post.avatarClass}`;
    avatar.textContent = post.author.charAt(0);

    const meta = document.createElement("div");
    meta.className = "user-meta";
    meta.innerHTML = `
      <div class="user-name">${post.author}</div>
      <div class="user-tag">${post.handle} · ${post.time}</div>
    `;

    header.appendChild(avatar);
    header.appendChild(meta);

    const body = document.createElement("p");
    body.className = "post-body";
    body.textContent = post.body;

    const tags = document.createElement("div");
    tags.className = "post-highlight";
    post.tags.forEach(tag => {
      const elem = document.createElement("span");
      elem.className = "hash-tag";
      elem.textContent = tag;
      tags.appendChild(elem);
    });

    const metaRow = document.createElement("div");
    metaRow.className = "post-meta";
    metaRow.innerHTML = `
      <span>💬 28</span>
      <span>❤️ 412</span>
      <span>🔁 19</span>
    `;

    const actions = document.createElement("div");
    actions.className = "post-actions";
    actions.innerHTML = `
      <button class="action-chip" data-read="${post.id}">閱讀</button>
      <button class="action-chip" data-clue="${post.id}">標記線索</button>
    `;

    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(tags);
    card.appendChild(metaRow);
    card.appendChild(actions);

    postList.appendChild(card);
  });

  bindPostActions();
}

function bindPostActions() {
  document.querySelectorAll("[data-read]").forEach(btn => {
    btn.addEventListener("click", () => {
      const post = posts.find(item => item.id === btn.dataset.read);
      openPostModal(post);
    });
  });

  document.querySelectorAll("[data-clue]").forEach(btn => {
    btn.addEventListener("click", () => {
      const post = posts.find(item => item.id === btn.dataset.clue);
      addClue(post.clue);
    });
  });
}

function openPostModal(post) {
  modalBody.innerHTML = `
    <div class="post-detail">
      <div class="post-header">
        <div class="avatar ${post.avatarClass}">${post.author.charAt(0)}</div>
        <div class="user-meta">
          <div class="user-name">${post.author}</div>
          <div class="user-tag">${post.handle} · ${post.time}</div>
        </div>
      </div>
      <p class="post-body">${post.body}</p>
      <div class="post-highlight">
        ${post.tags.map(tag => `<span class="hash-tag">${tag}</span>`).join("")}
      </div>
      <div class="post-meta">
        <span>💬 28</span>
        <span>❤️ 412</span>
        <span>🔁 19</span>
      </div>
    </div>
  `;
  modal.classList.remove("hidden");
}

function addClue(clue) {
  if (!clue || discoveredClues.some(item => item.title === clue.title)) {
    answerFeedback.textContent = "這個線索你已經記錄過了。";
    answerFeedback.className = "answer-feedback";
    return;
  }

  discoveredClues.push(clue);
  state.clueCount = discoveredClues.length;
  clueCountText.textContent = String(state.clueCount);

  updateProgress();
  renderClues();
  answerFeedback.textContent = `已記錄線索：${clue.title}`;
  answerFeedback.className = "answer-feedback success";
}

function renderClues() {
  clueList.innerHTML = "";

  if (discoveredClues.length === 0) {
    clueList.innerHTML = `
      <div class="empty-state">
        <p>還沒有發現任何線索</p>
        <span class="empty-icon">👀</span>
      </div>
    `;
    return;
  }

  discoveredClues.forEach((clue) => {
    const item = document.createElement("div");
    item.className = "clue-item";
    item.innerHTML = `
      <h3>${clue.title}</h3>
      <p>${clue.text}</p>
    `;
    clueList.appendChild(item);
  });
}

function updateProgress() {
  const maxClues = 5;
  const progressValue = Math.min(100, Math.round((state.clueCount / maxClues) * 100));
  state.progress = progressValue;
  progressText.textContent = `${progressValue}%`;

  if (state.clueCount >= 5) {
    mysteryText.textContent = "所有線索已蒐集完成，現在輸入正確答案來解鎖真相。";
  } else {
    mysteryText.textContent = "根據所有線索，輸入正確答案來解開秘密。";
  }
}

function bindTabs() {
  document.querySelectorAll(".tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.tab;
      state.activeTab = tab;

      document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn === button);
      });

      document.querySelectorAll(".tab-panel").forEach(panel => {
        panel.classList.toggle("active", panel.id === `tab-${tab}`);
      });
    });
  });
}

function handleAnswerSubmit() {
  const input = answerInput.value.trim();

  if (!input) {
    answerFeedback.textContent = "請先輸入答案。";
    answerFeedback.className = "answer-feedback error";
    return;
  }

  if (input === secretKey) {
    answerFeedback.textContent = "答案正確！秘密已解鎖。";
    answerFeedback.className = "answer-feedback success";
    showSecretModal();
  } else {
    answerFeedback.textContent = "答案錯誤，請再檢查貼文與線索。";
    answerFeedback.className = "answer-feedback error";
  }
}

function showSecretModal() {
  state.unlocked = true;
  secretTitle.textContent = "秘密已解鎖";
  secretMessage.textContent = "原來，『10/10的秘密』不是個單純的字串，而是所有證據中最明確的訊息。這場事件背後，真正的關鍵是：有人刻意用相似的訊息來掩蓋真相，而你已經看見了它。";
  secretReward.textContent = "完成獎勵：你已揭開校舍事件的真相，獲得「真相觀察者」徽章。";
  secretModal.classList.remove("hidden");
}

function resetGame() {
  discoveredClues.length = 0;
  state.clueCount = 0;
  state.progress = 0;
  state.unlocked = false;
  answerInput.value = "";
  answerFeedback.textContent = "";
  answerFeedback.className = "answer-feedback";
  mysteryText.textContent = "根據所有線索，輸入正確答案來解開秘密。";
  progressText.textContent = "0%";
  clueCountText.textContent = "0";
  secretModal.classList.add("hidden");
  renderClues();
  updateProgress();
}

document.getElementById("submit-answer").addEventListener("click", handleAnswerSubmit);
document.getElementById("close-modal").addEventListener("click", () => modal.classList.add("hidden"));
document.getElementById("close-secret").addEventListener("click", () => secretModal.classList.add("hidden"));
document.getElementById("restart-game").addEventListener("click", resetGame);

answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleAnswerSubmit();
  }
});

renderPosts();
renderClues();
bindTabs();
updateProgress();
