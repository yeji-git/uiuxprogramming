// ==========================================
// 할인 이메일 저장 설정
// ==========================================
let isSaved = false;

const saveMessage = document.querySelector("#saveMessage");
const saveButton = document.querySelector("#saveButton");
const emailInput = document.querySelector("#email");

function makeSaveMessage(saved) {
  if (saved === true) {
    return "알림 설정이 저장되었습니다.";
  }
  return "알림 설정을 저장해 주세요.";
}

function saveSettings() {
  const emailValue = emailInput.value.trim();

  if (emailValue === "") {
    alert("이메일 주소를 입력해 주세요.");
    emailInput.focus();
    return;
  }

  if (!emailInput.checkValidity()) {
    alert("올바른 이메일 형식을 입력해 주세요. (예: name@example.com)");
    emailInput.focus();
    return;
  }

  isSaved = true;
  saveMessage.textContent = makeSaveMessage(isSaved);
  saveMessage.classList.add("is-saved");
  saveButton.textContent = "저장됨";
  saveButton.disabled = true;
}

if (saveButton) {
  saveButton.addEventListener("click", saveSettings);
}

// ==========================================
// 서비스 이용 설정 (테마, 글자 수, 동의 체크)
// ==========================================
const themeButton = document.querySelector("#themeButton");
const userNameInput = document.querySelector("#userName");
const userNameCount = document.querySelector("#userNameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

function handleThemeClick() {
  const isDark = document.body.classList.toggle("dark");
  themeButton.textContent = isDark
    ? "밝은 테마로 바꾸기"
    : "어두운 테마로 바꾸기";
}

if (themeButton) {
  themeButton.addEventListener("click", handleThemeClick);
}

function handleUserNameInput() {
  const currentLength = userNameInput.value.length;
  userNameCount.textContent = currentLength + " / 10";
}

if (userNameInput) {
  userNameInput.addEventListener("input", handleUserNameInput);
}

function handleAgreeChange() {
  const agreed = agreeCheck.checked;

  startButton.disabled = !agreed;
  agreeMessage.textContent = agreed
    ? "확인이 완료되었습니다. 서비스를 시작할 수 있습니다."
    : "안내 확인 후 서비스를 시작할 수 있습니다.";

  agreeMessage.classList.toggle("is-ready", agreed);
}

if (agreeCheck) {
  agreeCheck.addEventListener("change", handleAgreeChange);
}

// ==========================================
// 탭 UI 동적 기능 구현
// ==========================================
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
  tabs.forEach(function (tab) {
    tab.classList.remove("is-active");
    tab.setAttribute("aria-selected", "false");
  });

  panels.forEach(function (panel) {
    panel.classList.remove("is-active");
    panel.hidden = true;
  });
}

function activateTab(clickedTab) {
  const targetSelector = clickedTab.dataset.target;
  const targetPanel = document.querySelector(targetSelector);

  clickedTab.classList.add("is-active");
  clickedTab.setAttribute("aria-selected", "true");

  targetPanel.classList.add("is-active");
  targetPanel.hidden = false;
}

function handleTabClick(event) {
  resetTabsAndPanels();
  activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
  tab.addEventListener("click", handleTabClick);
});

// ==========================================
// 10주차: 내비게이션 현재 위치 표시 기능
// ==========================================
const navLinks = document.querySelectorAll(".main-nav a");
const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");

function updateCurrentNav() {
  const currentHash = window.location.hash;

  navLinks.forEach((link) => {
    const current = currentHash
      ? link.getAttribute("href") === currentHash
      : link === navLinks[0];

    link.classList.toggle("is-current", current);

    if (current) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

window.addEventListener("hashchange", updateCurrentNav);
updateCurrentNav();

// 모바일 메뉴 열고 닫기 이벤트
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.textContent = isOpen ? "메뉴 닫기" : "메뉴 열기";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // 메뉴 링크를 누르면 모바일 메뉴가 자동으로 닫히도록 처리
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.textContent = "메뉴 열기";
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ==========================================
// 10주차: 서재 목록 상태 필터링 기능 (전체 / 플레이 중 / 완결)
// ==========================================
const filterButtons = document.querySelectorAll(".filter-button");
let currentFilter = "all"; // 'all', 'active'(플레이 중), 'completed'(완결)

// 게임 리스트 관리를 위한 동적 배열 (기본 카드들로부터 초기화)
let dynamicGames = [
  {
    id: "1",
    title: "스타듀 밸리",
    genre: "시뮬레이션 / 인디",
    status: "active",
    completed: false,
  },
  {
    id: "2",
    title: "하데스",
    genre: "액션 / 로그라이크",
    status: "completed",
    completed: true,
  },
  {
    id: "3",
    title: "발더스 게이트 3",
    genre: "RPG",
    status: "active",
    completed: false,
  },
];

const planList = document.querySelector("#plan-list");
const emptyState = document.querySelector("#empty-state");
const planCount = document.querySelector("#plan-count");
const libraryMessage = document.querySelector("#libraryMessage");

function getVisibleGames() {
  return dynamicGames.filter((game) => {
    if (currentFilter === "all") return true;
    if (currentFilter === "completed") return game.completed;
    return !game.completed; // active (플레이 중)
  });
}

function renderPlans() {
  const visibleGames = getVisibleGames();

  if (planList) {
    planList.replaceChildren();
  }

  if (emptyState) {
    emptyState.hidden = visibleGames.length !== 0;
  }
  if (planList) {
    planList.hidden = visibleGames.length === 0;
  }

  if (visibleGames.length === 0 && emptyState) {
    const filtered = currentFilter !== "all";
    const emptyTitle = emptyState.querySelector("h3");
    const emptyDescription = emptyState.querySelector("p");
    const emptyAction = emptyState.querySelector("a");

    emptyTitle.textContent = filtered
      ? "선택한 상태의 게임이 없어요."
      : "아직 저장한 게임이 없어요.";
    emptyDescription.textContent = filtered
      ? "다른 상태를 선택해 보세요."
      : "새 게임을 직접 추가해 이곳에서 관리해 보세요.";
    if (emptyAction) emptyAction.hidden = filtered;
  }

  if (planCount) {
    planCount.textContent = String(visibleGames.length);
    planCount.setAttribute(
      "aria-label",
      `현재 표시 중인 게임 ${visibleGames.length}개`,
    );
  }

  visibleGames.forEach((game) => {
    const li = document.createElement("li");
    li.className = `feature-card ${game.completed ? "is-completed" : ""}`;
    li.innerHTML = `
      <h3>${game.title}</h3>
      <p>장르: ${game.genre}</p>
      <p class="status">상태: <span class="status-text">${game.completed ? "완결" : "플레이 중"}</span></p>
      <button type="button" class="status-btn">상태 변경 (${game.completed ? "플레이 중" : "완결"})</button>
    `;

    // 상태 변경 버튼 이벤트 연결
    const btn = li.querySelector(".status-btn");
    btn.addEventListener("click", () => {
      game.completed = !game.completed;
      game.status = game.completed ? "completed" : "active";
      renderPlans();
      if (libraryMessage) {
        libraryMessage.textContent = `'${game.title}' 게임이 [${game.completed ? "완결" : "플레이 중"}] 상태로 업데이트되었습니다!`;
      }
    });

    if (planList) {
      planList.appendChild(li);
    }
  });
}

// 필터 버튼 클릭 이벤트 연결
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    renderPlans();
  });
});

// ==========================================
// 9주차/10주차: 조건부 입력 및 새 게임 서재 직접 추가
// ==========================================
const dlcOption = document.querySelector("#dlc-option");
const dlcOptions = document.querySelector("#dlc-options");
const dlcStepInputs = [...document.querySelectorAll('input[name="dlc_step"]')];

function syncDlcFields() {
  const open = dlcOption.checked;
  if (dlcOption) dlcOption.setAttribute("aria-expanded", String(open));
  if (dlcOptions) dlcOptions.hidden = !open;
  dlcStepInputs.forEach((input) => {
    input.disabled = !open;
  });
}

if (dlcOption) {
  dlcOption.addEventListener("change", syncDlcFields);
  syncDlcFields();
}

const titleField = document.querySelector("#title-field");
const newGameTitleInput = document.querySelector("#newGameTitle");
const titleHelp = document.querySelector("#title-help");
const titleCount = document.querySelector("#title-count");
const titleError = document.querySelector("#title-error");
const addGameForm = document.querySelector("#addGameForm");
const submitStatus = document.querySelector("#submit-status");
const addGameButton = document.querySelector("#addGameButton");
const totalGamesStat = document.querySelector(
  "#stats .stat-card:nth-child(1) strong",
);

const forceSaveFailure = new URLSearchParams(location.search).has("save-error");
let totalGameCount = 124;

function updateTitleExperience() {
  if (!newGameTitleInput) return;
  const length = newGameTitleInput.value.length;
  const enough = newGameTitleInput.value.trim().length >= 2;
  const invalid = newGameTitleInput.getAttribute("aria-invalid") === "true";

  if (titleCount) titleCount.textContent = `${length} / 30자`;
  if (titleField) titleField.classList.toggle("is-valid", enough && !invalid);

  if (!invalid && titleHelp) {
    titleHelp.textContent = enough
      ? "입력 조건을 충족했습니다."
      : "구분할 수 있도록 2자 이상 입력해 주세요.";
  }
}

if (newGameTitleInput) {
  newGameTitleInput.addEventListener("input", () => {
    updateTitleExperience();
    if (newGameTitleInput.getAttribute("aria-invalid") === "true") {
      validateTitle();
    }
  });
}

function showTitleError(message) {
  newGameTitleInput.setAttribute("aria-invalid", "true");
  if (titleError) titleError.textContent = message;
  if (titleField) {
    titleField.classList.remove("is-valid");
    titleField.classList.add("has-error");
  }
  return false;
}

function clearTitleError() {
  newGameTitleInput.removeAttribute("aria-invalid");
  if (titleError) titleError.textContent = "";
  if (titleField) titleField.classList.remove("has-error");
  updateTitleExperience();
}

function validateTitle() {
  const title = newGameTitleInput.value.trim();
  if (!title) {
    return showTitleError("게임 제목을 입력해 주세요.");
  }
  if (title.length < 2) {
    return showTitleError("게임 제목을 2자 이상 입력해 주세요.");
  }
  clearTitleError();
  return true;
}

function setSubmitState(loading, message) {
  if (addGameForm) addGameForm.setAttribute("aria-busy", String(loading));
  if (addGameButton) {
    addGameButton.disabled = loading;
    addGameButton.textContent = loading
      ? "서재에 등록하는 중…"
      : "서재에 추가하기";
  }
  if (submitStatus) submitStatus.textContent = message;
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

if (addGameForm) {
  addGameForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateTitle()) {
      window.requestAnimationFrame(() => {
        addGameForm.querySelector('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    const titleValue = newGameTitleInput.value.trim();
    const genreValue = document.querySelector("#newGameGenre").value.trim();
    const genreDisplay = genreValue === "" ? "기타 / 인디" : genreValue;

    setSubmitState(true, "서재 데이터베이스에 등록하고 있습니다.");

    try {
      await wait(600);
      if (forceSaveFailure) {
        throw new Error("서버 저장 실패 시뮬레이션");
      }

      // 새 게임 데이터 배열에 추가 후 렌더링 갱신
      dynamicGames.unshift({
        id: `${Date.now()}`,
        title: titleValue,
        genre: genreDisplay,
        status: "active",
        completed: false,
      });

      renderPlans();

      if (totalGamesStat) {
        totalGameCount++;
        totalGamesStat.textContent = totalGameCount + "개";
      }

      setSubmitState(
        false,
        `'${titleValue}' 게임이 성공적으로 등록되었습니다!`,
      );
      addGameForm.reset();
      syncDlcFields();
      updateTitleExperience();
    } catch (error) {
      setSubmitState(
        false,
        "저장하지 못했습니다. 입력한 내용은 그대로 두었습니다. 다시 시도해 주세요.",
      );
    }
  });
}

// 최초 로드 시 서재 목록 렌더링 실행
renderPlans();
