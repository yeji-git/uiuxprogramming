// 파일이 실행되는지 확인하는 임시 로그입니다.
// console.log("JavaScript가 연결되었습니다.");

// 찾은 버튼 객체를 확인합니다.
// console.log(saveButton);

// 1. 변하지 않는 값은 const로 저장합니다.
const panelTitle = "알림 설정";

// 2. 저장 전후로 바뀌는 상태는 let으로 저장합니다.
let isSaved = false;

// console.log("isSaved 변수의 자료형:", typeof isSaved);

// 3. JavaScript가 바꿀 요소를 id로 찾습니다.
const saveMessage = document.querySelector("#saveMessage");
const saveButton = document.querySelector("#saveButton");
const emailInput = document.querySelector("#email"); // ✨ 이메일 입력창 요소 추가

// 4. 상태에 맞는 문구를 반환합니다.
function makeSaveMessage(saved) {
  if (saved === true) {
    return "알림 설정이 저장되었습니다.";
  }
  return "알림 설정을 저장해 주세요.";
}

// 5. 클릭 순간 실행할 동작입니다.
function saveSettings() {
  const emailValue = emailInput.value.trim();

  // 5-1. 빈 값 및 이메일 형식 유효성 검사
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

  // 5-2. 유효성 검사 통과 시 저장 완료 처리
  isSaved = true;
  saveMessage.textContent = makeSaveMessage(isSaved);
  saveMessage.classList.add("is-saved");
  saveButton.textContent = "저장됨";
  saveButton.disabled = true;
}

// 6. click 이벤트와 함수를 연결합니다.
saveButton.addEventListener("click", saveSettings);

// 6주차 : 서비스 이용 설정의 요소 선택
const themeButton = document.querySelector("#themeButton");
const userNameInput = document.querySelector("#userName");
const userNameCount = document.querySelector("#userNameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

// click으로 테마와 버튼 문구 전환
function handleThemeClick() {
  const isDark = document.body.classList.toggle("dark");

  themeButton.textContent = isDark
    ? "밝은 테마로 바꾸기"
    : "어두운 테마로 바꾸기";
}

themeButton.addEventListener("click", handleThemeClick);

// input으로 현재 글자 수 표시
function handleUserNameInput() {
  const currentLength = userNameInput.value.length;
  userNameCount.textContent = currentLength + " / 10";
}

userNameInput.addEventListener("input", handleUserNameInput);

// change로 안내 문구와 버튼 상태 변경
function handleAgreeChange() {
  const agreed = agreeCheck.checked;

  startButton.disabled = !agreed;
  agreeMessage.textContent = agreed
    ? "확인이 완료되었습니다. 서비스를 시작할 수 있습니다."
    : "안내 확인 후 서비스를 시작할 수 있습니다.";

  agreeMessage.classList.toggle("is-ready", agreed);
}

agreeCheck.addEventListener("change", handleAgreeChange);

// 탭 UI 동적 기능 구현
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
