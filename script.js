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
// 내 서재 상태 변경 및 기록
// ==========================================
const statusButtons = document.querySelectorAll(".status-btn");
const libraryMessage = document.querySelector("#libraryMessage");

function handleStatusChange(event) {
  const card = event.currentTarget.closest(".feature-card");
  const statusTextSpan = card.querySelector(".status-text");
  const gameTitle = card.querySelector("h3").textContent;

  const isCompleted = card.classList.toggle("is-completed");

  if (isCompleted) {
    statusTextSpan.textContent = "완결";
    event.currentTarget.textContent = "상태 변경 (플레이 중)";
    libraryMessage.textContent = `'${gameTitle}' 게임이 [완결] 상태로 업데이트되었습니다!`;
  } else {
    statusTextSpan.textContent = "플레이 중";
    event.currentTarget.textContent = "상태 변경 (완결)";
    libraryMessage.textContent = `'${gameTitle}' 게임이 [플레이 중] 상태로 변경되었습니다.`;
  }
}

statusButtons.forEach(function (button) {
  button.addEventListener("click", handleStatusChange);
});

// ==========================================
// 9주차: 조건부 입력 영역 제어 (DLC 확장팩 선택)
// ==========================================
const dlcOption = document.querySelector("#dlc-option");
const dlcOptions = document.querySelector("#dlc-options");
const dlcStepInputs = [...document.querySelectorAll('input[name="dlc_step"]')];

function syncDlcFields() {
  const open = dlcOption.checked;
  dlcOption.setAttribute("aria-expanded", String(open));
  dlcOptions.hidden = !open;
  dlcStepInputs.forEach((input) => {
    input.disabled = !open;
  });
}

if (dlcOption) {
  dlcOption.addEventListener("change", syncDlcFields);
  syncDlcFields();
}

// ==========================================
// 9주차: 입력 경험 & 실시간 글자 수 / 상태 갱신 및 검증
// ==========================================
const titleField = document.querySelector("#title-field");
const newGameTitleInput = document.querySelector("#newGameTitle");
const titleHelp = document.querySelector("#title-help");
const titleCount = document.querySelector("#title-count");
const titleError = document.querySelector("#title-error");
const addGameForm = document.querySelector("#addGameForm");
const addGameMessage = document.querySelector("#addGameMessage");
const submitStatus = document.querySelector("#submit-status");
const addGameButton = document.querySelector("#addGameButton");
const totalGamesStat = document.querySelector(
  "#stats .stat-card:nth-child(1) strong",
);
const featuresList = document.querySelector(".features-list");

// URL 파라미터로 ?save-error=1 주면 강제 저장 실패
const forceSaveFailure = new URLSearchParams(location.search).has("save-error");
let totalGameCount = 124;

function updateTitleExperience() {
  const length = newGameTitleInput.value.length;
  const enough = newGameTitleInput.value.trim().length >= 2;
  const invalid = newGameTitleInput.getAttribute("aria-invalid") === "true";

  titleCount.textContent = `${length} / 30자`;
  titleField.classList.toggle("is-valid", enough && !invalid);

  if (!invalid) {
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
  titleError.textContent = message;
  titleField.classList.remove("is-valid");
  titleField.classList.add("has-error");
  return false;
}

function clearTitleError() {
  newGameTitleInput.removeAttribute("aria-invalid");
  titleError.textContent = "";
  titleField.classList.remove("has-error");
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
  addGameForm.setAttribute("aria-busy", String(loading));
  addGameButton.disabled = loading;
  addGameButton.textContent = loading
    ? "서재에 등록하는 중…"
    : "서재에 추가하기";
  submitStatus.textContent = message;
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

// ==========================================
// 9주차: 통합 Submit 이벤트 (검증 -> 비동기 저장 -> 결과/에러 핸들링)
// ==========================================
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

      const newCard = document.createElement("li");
      newCard.className = "feature-card";
      newCard.innerHTML = `
        <h3>${titleValue}</h3>
        <p>장르: ${genreDisplay}</p>
        <p class="status">상태: <span class="status-text">플레이 중</span></p>
        <button type="button" class="status-btn">상태 변경 (완결)</button>
      `;

      const newStatusBtn = newCard.querySelector(".status-btn");
      newStatusBtn.addEventListener("click", handleStatusChange);

      if (featuresList) {
        featuresList.prepend(newCard);
      }

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
