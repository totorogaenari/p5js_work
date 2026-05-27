let inputBox; //입력창
let words = []; //단어 목록
let score = 0; 
let mainCharIcon;
let mainPixel;
let mainPixel2;
let mainPixel3;
let monster_1;
let message;
let smallMoster1;
let player_effect1;
let player_effect2;
let player_effect3;
let speechBubble;
let currentBossDialogue = "";
let gameState = "play";

let bg;
let ending_bg;

let attackAnim = false;
let attackFrame = 0;
let attackTimer = 0;

let monsterAttackAnim = false;
let monsterAttackFrame = 0;
let monsterAttackTimer = 0;

let effectIndex = 0;
let showEffect = false;
let effectTimer = 0;
let monster_attack1;
let monster_attack2;
let monster_attack3;
let shield;

let bossHP = 100;
let playerHP = 100;

let pendingDamage = 0;
let damageTimer = 0;

let isInvincible = false;   // 피격 깜빡임
let lastBossAttackTime = 0;

let messageText = "";
let messageTimer = 0;
let isDefense = false;

let shieldActive = false;
let shieldTimer = 0;
let guardSuccess = false;

let bossDialogueTimer = 0;
let triggeredDialogues = [];

let playerHitBlinkTimer = 0;
let monsterHitBlinkTimer = 0;

let bloodEffects = [];

let screenShake = 0;

const wordList = [
  "사과",
  "조용한",
  "커다랗다",
  "공격",
  "역사",
  "곱하다"
];

//말풍선 대사
let bossDialogues = [
  { hp: 85, text: "전쟁은 곧 신의 언어다." },
  { hp: 60, text: "이건 전쟁이다. \n아름다운 전쟁이다." },
  { hp: 30, text: "왜 쓰러지지 않는가… \n이것도 신의 뜻인가?" },
  { hp: 10,  text: "심판은 아직 \n끝나지 않았다!!!" }
];
//몬스터 공격시 대사
let playerAttackLines = [
  "신의 이름으로!",
  "빛이 너를 꿰뚫는다!"
];
//몬스터 피격시 대사
let playerHitLines = [
  "크윽!!"
];
function setup() {
  createCanvas(windowWidth, windowHeight);

  rectMode(CENTER);

  // 입력창 생성
  inputBox = createInput();
  inputBox.position(windowWidth / 2 - 100, windowHeight - 60);
  inputBox.size(200, 40);

  // 엔터 입력 감지
  inputBox.elt.addEventListener("keydown", checkEnter);

  // 단어 생성
  setInterval(makeWord, 3000);
}

function preload() {
  bg = loadImage("bg.png")
  ending_bg = loadImage("ending_bg.png")
  mainCharIcon = loadImage("mainCharIcon.png")
  mainPixel = loadImage("mainPixel.png")
  mainPixel2 = loadImage("mainPixel2.png")
  mainPixel3 = loadImage("mainPixel3.png")
  
  monster_1 = loadImage("monster1.png")
  message = loadImage("message.png")
  smallMonster1 = loadImage("smallMonster1.png")
  player_effect1 = loadImage("player_effect1.png")
  player_effect2 = loadImage("player_effect2.png")
  player_effect3 = loadImage("player_effect3.png")
  monster_attack1 = loadImage("monster_attack1.png")
  monster_attack2 = loadImage("monster_attack2.png")
  monster_attack3 = loadImage("monster_attack3.png")
  shield = loadImage("shield.png")
  speechBubble = loadImage("bubble.png")
}

function draw() {

  if (gameState === "play") {
    if (inputBox) inputBox.show(); 
    let shakeX = 0;
    let shakeY = 0;

    if (screenShake > 0) {
      shakeX = random(-screenShake, screenShake);
      shakeY = random(-screenShake, screenShake);
      screenShake *= 0.9;
    }

    push();
    translate(shakeX, shakeY);

    bossHP = constrain(bossHP, 0, 100);
    playerHP = constrain(playerHP, 0, 100);

    stage1();
    monster1();
    player();
    drawShield();
    handlePendingDamage();
    drawBlood();

    updateBossDialogue();
    bossAttackSystem();
    updateMonsterAttackAnimation();

    if (frameCount % 120 === 0) {
      smallMonsterAttack();
    }

    updateAttackAnimation();
    pop();
    drawMessage();

    // 상태 전환만 하고 종료 안 함
    if (playerHP <= 0) {
      gameState = "lose";
    }

    if (bossHP <= 0) {
      gameState = "win";
    }
  }

  else if (gameState === "lose") {
    if (inputBox) inputBox.hide(); 
    ending2();
  }

  else if (gameState === "win") {
    winScene();
    if (inputBox) inputBox.hide(); 
  }
}
function resetGame() {

  bossHP = 100;
  playerHP = 100;

  words = [];
  bloodEffects = [];
  score = 0;

  pendingDamage = 0;
  damageTimer = 0;
  triggeredDialogues = [];

  bossDialogueTimer = 0;
  currentBossDialogue = "";

  screenShake = 0;

  gameState = "play";

  inputBox.show(); // 다시 등장
  inputBox.value(""); // 입력 초기화
}
 function drawMessage() { 
   if (messageTimer <= 0) 
     return; fill(0, 180); 
   rect( windowWidth / 2, windowHeight * 0.08, 400, 60, 10 );     fill(255); 
   textAlign(CENTER, CENTER); 
   textSize(28); 
   text( messageText, windowWidth / 2, windowHeight * 0.08 );
   messageTimer--; 
 }
function handlePendingDamage() {

  if (damageTimer > 0) {
    damageTimer--;
  }

  if (damageTimer === 0 && pendingDamage > 0) {

    if (guardSuccess) {
      showMessage("완벽히 방어했다!");
    } else {
      playerHP -= pendingDamage;
      showMessage("으악 공격 당했다!");

      
      playerHitBlinkTimer = 30;
    }

    pendingDamage = 0;
  }
}

function updateAttackAnimation() { 
  if (!attackAnim) 
    return; 
    attackTimer++; 
  // 프레임 속도 조절 (느리게/빠르게 조절 가능) 
  if (attackTimer % 8 === 0) 
  { attackFrame++; 
  } 
  // 이펙트 출력 
  imageMode(CENTER); 
  if (attackFrame === 0) { 
    image(player_effect1, windowWidth/2.5, windowHeight/1.5, 200, 200); 
  } else if (attackFrame === 1) { 
    image(player_effect3, windowWidth/1.8, windowHeight/1.5, 200, 200); 
  } else if (attackFrame === 2) { 
    image(player_effect2, windowWidth/1.5, windowHeight/1.4, 200, 200); 
  } 
  // 종료 
  else if (attackFrame > 2) { attackAnim = false;
  } 
}

function monster1() {

  // 피격 타이머 감소
  if (monsterHitBlinkTimer > 0) {
    monsterHitBlinkTimer--;
  }

  imageMode(CENTER);

  // 깜빡임 효과
  if (monsterHitBlinkTimer > 0 && frameCount % 6 < 3) {
    tint(255, 100);
  } else {
    noTint();
  }

  image(
    monster_1,
    windowWidth * 0.85,
    windowHeight * 0.65,
    220,
    230
  );

  noTint();

  // 보스 말풍선만 출력
  if (bossDialogueTimer > 0) {

  drawSpeechBubble(
    windowWidth * 0.7,
    windowHeight * 0.65 - 160,
    currentBossDialogue
  );
}
}

function attak_message() {
  image(message, windowWidth/2, windowHeight * 0.27,
      270, 80)
  textSize(30)
  fill(255,255,0)
  text("앗!        당했다!",windowWidth / 2.8, windowHeight * 0.27)
  fill("255")
  text("공격",windowWidth / 2.35, windowHeight * 0.27)
}

function player() {

  if (playerHitBlinkTimer > 0 && frameCount % 6 < 3) {
    return;
  }

  imageMode(CENTER);

  let img;

  // HP 상태에 따라 이미지 변경
  if (playerHP <= 0) {
    img = mainPixel3; // 쓰러짐
  } 
  else if (playerHP <= 40) {
    img = mainPixel2; // 부상
  } 
  else {
    img = mainPixel;  // 기본
  }

  image(
    img,
    windowWidth / 7,
    windowHeight / 1.5,
    180, 180
  );

  if (playerHitBlinkTimer > 0) {
    playerHitBlinkTimer--;
  }
}
function stage1() {
  background(bg,width/2,height/2,width,height);

  // -------------------------
  // 전체 체력바 UI
  // -------------------------
  fill(255);
  rect(windowWidth / 2,
       windowHeight * 0.15,
       windowWidth - windowWidth * 0.3,
       windowHeight * 0.1);

  push();
  rectMode(CORNER);

  let bossBarX = windowWidth * 0.5;
  let bossBarY = windowHeight / 7.5;

  let playerBarX = windowWidth * 0.2;
  let playerBarY = windowHeight / 7.5;

  bossHP = constrain(bossHP, 0, 100);
  playerHP = constrain(playerHP, 0, 100);

  // 보스 HP
  fill(255, 0, 0);
  rect(
    bossBarX,
    bossBarY,
    map(bossHP, 0, 100, 0, windowWidth * 0.3),
    windowHeight * 0.05
  );

  // 플레이어 HP
  fill(0, 0, 255);
  rect(
    playerBarX,
    playerBarY,
    map(playerHP, 0, 100, 0, windowWidth * 0.3),
    windowHeight * 0.05
  );

  pop();

  // -------------------------
  // 이름 UI
  // -------------------------
  fill(255);
  rect(windowWidth / 3.5, windowHeight * 0.09,
       windowWidth / 6, windowHeight * 0.05);

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(30);
  text("나", windowWidth / 3.5, windowHeight * 0.09);

  fill(255);
  rect(windowWidth - windowWidth / 3.5,
       windowHeight * 0.09,
       windowWidth / 3.6,
       windowHeight * 0.05);

  fill(0);
  textSize(22);
  text("전쟁광 수도사",
       windowWidth - windowWidth / 3.2,
       windowHeight * 0.09);

  // 캐릭터 + VS
// 캐릭터 아이콘 
  fill(255); 
  ellipse(windowWidth * 0.13, windowHeight * 0.15, 140, 140);   imageMode(CENTER) 
  image(mainCharIcon, windowWidth * 0.13, windowHeight * 0.15, 140, 140) 
  ellipse(windowWidth * 0.87, windowHeight * 0.15, 140, 140); // VS 
  fill(255); 
  ellipse(windowWidth / 2, windowHeight * 0.15, 80, 80);         textAlign(CENTER, CENTER); 
  fill(0); 
  textSize(45); 
  text("VS", windowWidth / 2, windowHeight * 0.16);

  // -------------------------
  // 🎯 작은 몬스터 (타자 RPG 핵심)
  // -------------------------
  for (let i = words.length - 1; i >= 0; i--) {

    let w = words[i];

    let floatY = w.y + sin(frameCount * w.floatSpeed) * 10;

    imageMode(CENTER);

    // -------------------------
    // 작은 몬스터 이미지
    // -------------------------
    image(smallMonster1,
          w.x,
          floatY + w.offsetY - 20,
          100, 100);


    // -------------------------
    // 단어 박스
    // -------------------------
    let boxWidth = textWidth(w.text) + 30;
    let boxHeight = 50;

    fill(50);
    rect(w.x, w.y, boxWidth, boxHeight, 10);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text(w.text, w.x, w.y);

    // -------------------------
    // 이동
    // -------------------------
    w.x -= w.speed;

    // -------------------------
    // 플레이어 도달 데미지
    // -------------------------
    if (!w.hitPlayer && w.x < windowWidth * 0.25) {
      playerHP -= 10;
      showMessage("처형견에게 물렸다!");
      playerHitBlinkTimer = 30;
      w.hitPlayer = true;
    }

    // -------------------------
    // 몬스터 사망 처리
    // -------------------------
    if (w.hp <= 0) {

      bloodEffects.push({
        x: w.x,
        y: w.y,
        life: 25
      });

      showMessage("처치!");

      words.splice(i, 1);
      score++;

      continue;
    }

    // -------------------------
    // 💀 화면 밖 제거
    // -------------------------
    if (w.x < -200) {
      words.splice(i, 1);
    }
  }
}
//보스 공격
function attackBoss() {

  bossHP -= 5;

  monsterHitBlinkTimer = 20;

  // 랜덤 피격 대사 출력
  currentBossDialogue = random(playerHitLines);

  // 말풍선 2초 출력
  bossDialogueTimer = 120;
  effectIndex = (effectIndex + 1) % 3;
  effectTimer = 10;

  isInvincible = true;

  setTimeout(() => {
    isInvincible = false;
  }, 200);
}
//방어
function defend() {

  shieldActive = true;
  shieldTimer = 40;

  guardSuccess = true; //: 방어 성공 저장

  showMessage("방어했다!");

  setTimeout(() => {
    guardSuccess = false; // 일정 시간 후 해제
  }, 1000); // 1초 유지 (데미지 타이밍 커버)
}
//말풍선
function drawSpeechBubble(x, y, textStr) {

  noTint();

  imageMode(CENTER);

  image(
    speechBubble,
    x - 20,
    y - 70,
    330,
    220
  );

  fill(0);

  textAlign(CENTER, CENTER);

  textSize(20);

  text(textStr, x-17, y - 57);
}
function drawShield() {

  if (!shieldActive) return;

  push();

  imageMode(CENTER);

  // 펄스 효과
  let pulse = 1 + sin(frameCount * 0.2) * 0.1;

  // 반투명
  tint(255, 180);

  image(
    shield,
    windowWidth/7,
    windowHeight/1.5,
    220 * pulse,
    220 * pulse
  );

  pop();

  shieldTimer--;

  if (shieldTimer <= 0) {
    shieldActive = false;
  }
}
//적 공격 시스템 
function bossAttackSystem() {

  if (millis() - lastBossAttackTime > 6000) {

    lastBossAttackTime = millis();

    screenShake = 20;

    monsterAttackAnim = true;
    monsterAttackFrame = 0;
    monsterAttackTimer = 0;

    // ❌ 여기서 HP 안 깎음 (중요)
    pendingDamage = 25;
    damageTimer = 60;

    showMessage("공격이 들어온다!");
  }
}

//몬스터 공격 애니메이션
function updateMonsterAttackAnimation() {

  if (!monsterAttackAnim) return;

  monsterAttackTimer++;

  // 프레임 속도 조절
  if (monsterAttackTimer % 18 === 0) {
    monsterAttackFrame++;
  }

  imageMode(CENTER);

  let img;

  // 왼쪽으로 점점 이동 (프레임이 올라갈수록 -값 증가)
  let offsetX = monsterAttackFrame * 140; 
  // 0 → 30 → 60 이런 식으로 왼쪽으로 이동

  if (monsterAttackFrame === 0) {
    img = monster_attack3;
  } 
  else if (monsterAttackFrame === 1) {
    img = monster_attack2;
  } 
  else if (monsterAttackFrame === 2) {
    img = monster_attack1;
  } 
  else {
    monsterAttackAnim = false;
    return;
  }

  image(img,
    windowWidth * 0.75 - offsetX,  // 여기 핵심
    windowHeight * 0.65,
    300, 300
  );
}
//메시지 출력
function showMessage(msg) {
  messageText = msg;
  messageTimer = 60; // 약 1초
}

//작은 몬스터 공격 
function smallMonsterAttack() {

  for (let i = 0; i < words.length; i++) {

    if (!words[i].hitPlayer && words[i].x < windowWidth * 0.25) {

      playerHP -= 10;
      showMessage("작은 몬스터에게 맞았다!");
      playerHitBlinkTimer = 30;

      words[i].hitPlayer = true;
    }
  }
}
// 단어 생성
function makeWord() {
  let randomWord = random(wordList);

  words.push({
    text: randomWord,
    x: width + 100,
    y: random(250, height - 100),
    speed: random(1, 2),
    hp: 3,
    maxHp: 3,
    offsetY: random(-30, 30),
    floatSpeed: random(0.01, 0.03),
    hitPlayer: false
  });
}
function updateBossDialogue() {

  // 타이머 감소
  if (bossDialogueTimer > 0) {
    bossDialogueTimer--;
  } 
  else {
    currentBossDialogue = "";
  }

  // 새로운 대사 체크
  for (let i = 0; i < bossDialogues.length; i++) {

    let d = bossDialogues[i];

    // 아직 안 나온 대사 + HP 조건 만족
    if (
      bossHP <= d.hp &&
      !triggeredDialogues.includes(i)
    ) {

      currentBossDialogue = d.text;

      bossDialogueTimer = 180; // 3초 정도

      triggeredDialogues.push(i);

      break;
    }
  }
}
// 엔터 입력
function checkEnter(event) {

  if (event.key === "Enter") {

    let typed = inputBox.value();

    for (let i = words.length - 1; i >= 0; i--) {

      if (words[i].text === typed) {

        let w = words[i];

        // 피 효과
        bloodEffects.push({
          x: w.x,
          y: w.y,
          life: 20
        });

        words.splice(i, 1);  // 딱 1번만 삭제
        score++;
        break;
      }
    }

    inputBox.value("");
  }
}

//피 그리는 함수
function drawBlood() {

  for (let i = bloodEffects.length - 1; i >= 0; i--) {

    let b = bloodEffects[i];

    fill(255, 0, 0);
    noStroke();

    ellipse(b.x, b.y, random(10, 20), random(10, 20));

    b.life--;

    if (b.life <= 0) {
      bloodEffects.splice(i, 1);
    }
  }
}

function keyPressed() {

  if (gameState === "play") {

    if (keyCode === RIGHT_ARROW) {
      attackBoss();
      attackAnim = true;
      attackFrame = 0;
      attackTimer = 0;
    }

    if (keyCode === LEFT_ARROW) {
      defend();
    }
  }

  else if (gameState === "lose") {

    if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
      select = 1 - select; // 토글
    }

    if (keyCode === ENTER) {
      if (select === 0) {
        resetGame(); // 재시작
      } else {
        location.reload(); // 처음으로
      }
    }
  }
}
//플레이어의 체력이 0이 되면 엔딩씬 불러오기
function ending2() {
  image(ending_bg, 0, 0, width, height);
  fill(255, 180);
  rect(
    windowWidth / 2,
    windowHeight / 1.8,
    windowWidth / 1.1,
    windowHeight / 2
  );
  textAlign(LEFT);
  textSize(50);
  fill(255)
  text("#엔딩2",windowWidth / 13,windowHeight / 8)
  textSize(30);
  fill(0)
  text(
  "개선사항: 난이도 조절\nhp마다 인물의 아이콘 바꾸기\n작은 몬스터 터지는 애니메이션 수정\n플레이어 쿨타임 설정 및 화면에 넣기\n디자인 개선",
  windowWidth / 6,
  windowHeight / 1.8
);
  textAlign(CENTER);
  fill(255)
  text("다시 시도하겠습니까?", windowWidth / 2, windowHeight / 1.18)
  textSize(25)
  
  
  textAlign(LEFT);

textSize(30);

fill(255);

// 네
if(select == 0){

  text(
    ">> 네",
    windowWidth / 2.3,
    windowHeight / 1.1
  );

}
else{

  text(
    "네",
    windowWidth / 2.2,
    windowHeight / 1.1
  );

}

// 아니오
if(select == 1){

  text(
    ">> 아니오 (처음으로 돌아가기)",
    windowWidth / 2.3,
    windowHeight / 1.03
  );

}
else{

  text(
    "아니오 (처음으로 돌아가기)",
    windowWidth / 2.2,
    windowHeight / 1.03
  );

}
}
//이긴 씬
function winScene() {

  image(bg, 0, 0, width, height);

  fill(0, 180);

  rect(
    windowWidth / 2,
    windowHeight / 2,
    windowWidth / 1.3,
    windowHeight / 2
  );

  fill(255);

  textAlign(CENTER, CENTER);

  textSize(70);

  text(
    "#승리",
    width / 2,
    height / 3.5
  );

  textSize(35);

  text(
    "전쟁광 수도승을 쓰러뜨렸습니다.\n\n" +
    "폐허가 된 수도원에는\n" +
    "더 이상 광기의 기도 소리가 들리지 않습니다...",
    width / 2,
    height / 1.8
  );
}
// 창 크기 변경 대응
function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

  inputBox.position(windowWidth / 2 - 100,
                    windowHeight - 60);
}