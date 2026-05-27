let inputBox; //입력창
let words = []; //단어 목록
let score = 0; 
let mainCharIcon;
let monster2Icon;
let mainPixel;
let mainPixel2;
let mainPixel3;
let monster_2;
let message;
let smallMonster2;
let player_effect1;
let player_effect2;
let player_effect3;
let speechBubble;
let currentBossDialogue = "";
let layer;

let bg2;
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

let frontLineX;
let gameOver = false;

const DEAD_LINE = 120; // 전선 패배선

let bossDead = false;
let bossDeathTimer = 0;
let fadeAlpha = 0;

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
  { hp: 85, text: "맥박이 빠르군. 공포인가?" },
  { hp: 60, text: "면역 개체인가? \n실험 결과를 수정해야겠어." },
  { hp: 30, text: "왜 감염되지 않는 거지…?" },
  { hp: 10,  text: "예상보다 오래 버티는군." },
  { hp: 1,  text: "격리 실패. 전원 처분한다…" }
];
//몬스터 공격시 대사
let playerAttackLines = [
  "신의 이름으로!",
  "빛이 너를 꿰뚫는다!"
];
//몬스터 피격시 대사
let playerHitLines = [
  "흥미로운 저항이군…"
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
  
  frontLineX = windowWidth/2;
}

function preload() {
  bg2 = loadImage("bg2.png")
  ending_bg = loadImage("ending_bg.png")
  mainCharIcon = loadImage("mainCharIcon.png")
  monster2Icon = loadImage(" monster2Icon.png")
  mainPixel = loadImage("mainPixel.png")
  mainPixel2 = loadImage("mainPixel2.png")
  mainPixel3 = loadImage("mainPixel3.png")
  
  monster_2 = loadImage("monster2.png")
  message = loadImage("message.png")
  smallMonster2 = loadImage("smallMonster2.png")
  player_effect1 = loadImage("player_effect1.png")
  player_effect2 = loadImage("player_effect2.png")
  player_effect3 = loadImage("player_effect3.png")
  monster_attack1 = loadImage("monster_attack1.png")
  monster_attack2 = loadImage("monster_attack2.png")
  monster_attack3 = loadImage("monster_attack3.png")
  shield = loadImage("shield.png")
  speechBubble = loadImage("bubble.png")
  layer = loadImage("layer.gif")
}

function draw() {

  // 게임오버 체크
  if (playerHP <= 0) {
    ending2();
    return;
  }

  // 화면 흔들림 적용
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

  stage2();
  monster2();
  player();
  drawShield(); 
  handlePendingDamage(); 

  drawBlood();

  updateBossDialogue();
  bossAttackSystem();
  updateMonsterAttackAnimation();

  updateFrontLine();
  drawFrontLine();
  checkGameOver();
  updateBossDeathScene();

  updateAttackAnimation();

  pop();

  drawMessage();
}

function checkGameOver() {

  if (frontLineX <= DEAD_LINE) {

    gameOver = true;

    playerHP = 0;
  }
}

//전선 시스템
function updateFrontLine() {

  // 자동으로 계속 왼쪽 압박
  frontLineX -= 0.15;

  // 화면 제한
  frontLineX = constrain(
    frontLineX,
    0,
    width
  );
}

function updateBossDeathScene() {

  if (!bossDead) return;

  let elapsed = millis() - bossDeathTimer;


  if (elapsed > 2000) {

    fadeAlpha += 2;

    fill(0, fadeAlpha);
    rectMode(CORNER);
    rect(0, 0, width, height);
  }

  // 총 5초 뒤 승리씬
  if (elapsed > 5000) {

    winScene();

    noLoop();
  }
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

function drawFrontLine() {

  push();

  imageMode(CORNER);

  tint(255, 180);

  // 오른쪽 영역 전체를 레이어로 덮음
 image(
    layer,
    frontLineX+90,
    0,
    width - frontLineX,
    height
);

  pop();

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

      // 여기 수정
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

function monster2() {

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
    monster_2,
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
function stage2() {
  background(bg2,width/2,height/2,width,height);

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
  text("흑사병 ",
       windowWidth - windowWidth / 3.2,
       windowHeight * 0.09);

  // -------------------------
  // 캐릭터 + VS
  // -------------------------
// 캐릭터 아이콘 
  fill(255); 
  ellipse(windowWidth * 0.13, windowHeight * 0.15, 140, 140);   imageMode(CENTER) 
  image(mainCharIcon, windowWidth * 0.13, windowHeight * 0.15, 140, 140) 
  ellipse(windowWidth * 0.87, windowHeight * 0.15, 140, 140); // VS 
  fill(255); 
  ellipse(windowWidth / 2, windowHeight * 0.15, 80, 80);
  image(monster2Icon, windowWidth * 0.87, windowHeight * 0.15, 150, 161) 
  textAlign(CENTER, CENTER); 
  fill(0); 
  textSize(45); 
  text("VS", windowWidth / 2, windowHeight * 0.16);

 
  //  작은 몬스터 (타자 RPG 핵심)
  for (let i = words.length - 1; i >= 0; i--) {

    let w = words[i];

    let floatY = w.y + sin(frameCount * w.floatSpeed) * 10;

    imageMode(CENTER);

    // -------------------------
    // 작은 몬스터 이미지
    // -------------------------
    image(smallMonster2,
          w.x,
          floatY + w.offsetY - 20,
          100, 100);

    // -------------------------
    // HP BAR (몬스터 위)  -> 나중에 
    // -------------------------
    let barW = 50;
    let barH = 6;

    let hpRatio = w.hp / w.maxHp;

    fill(0);
    rect(w.x - barW / 2,
         floatY + w.offsetY - 60,
         barW,
         barH);

    fill(255, 0, 0);
    rect(
      w.x - barW / 2,
      floatY + w.offsetY - 60,
      barW * hpRatio,
      barH
    );

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
    if (!bossDead) {
      w.x -= w.speed;
    }

    // -------------------------
    // 플레이어 도달 데미지
    // -------------------------
    if (!bossDead &&!w.hitPlayer &&w.x < windowWidth * 0.25) {
      playerHP -= 10;
      showMessage("실험쥐에게 물렸다!");
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
    // 화면 밖 제거
    // -------------------------
    if (w.x < -200) {
      words.splice(i, 1);
    }
  }
}
//보스 공격
function attackBoss() {

  if (bossDead) return;

  bossHP -= 5;

  monsterHitBlinkTimer = 20;

  frontLineX += 25;

  frontLineX = constrain(
    frontLineX,
    0,
    width * 0.8
  );

  currentBossDialogue = random(playerHitLines);

  bossDialogueTimer = 120;

  //  보스 사망 처리
  if (bossHP <= 0) {

    bossHP = 0;

    bossDead = true;
    bossDeathTimer = millis();

    currentBossDialogue =
      "격리 실패. 전원 처분한다…";

    bossDialogueTimer = 180;

    // 입력 비활성화
    inputBox.attribute("disabled", true);

    // 남은 공격 제거
    pendingDamage = 0;

    // 공격 애니메이션 중단
    monsterAttackAnim = false;

    // 작은 몬스터 정지
    for (let w of words) {
      w.speed = 0;
    }
  }
}
//방어
function defend() {

  shieldActive = true;
  shieldTimer = 40;

  guardSuccess = true; // 핵심: 방어 성공 저장

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
    380,
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

    // 여기서 HP 안 깎음 (중요)
    pendingDamage = 25;
    damageTimer = 60;

    showMessage("공격이 들어온다!");
  }
}

//몬스터 공격 애니메이션
function updateMonsterAttackAnimation() {
  if (bossDead) return;
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

// 단어 생성
function makeWord() {
  if (bossDead) return;
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
  if (bossDead) return;
  
  if (event.key !== "Enter") return;

  let typed = inputBox.value();

  let success = false;

  // 단어 검사
  for (let i = words.length - 1; i >= 0; i--) {

    if (words[i].text === typed) {

      success = true;

      let w = words[i];

      // 피 효과
      bloodEffects.push({
        x: w.x,
        y: w.y,
        life: 20
      });

      // 몬스터 제거
      words.splice(i, 1);

      // 전선 넉백
      frontLineX += 120;

      // 최대 위치 제한
      frontLineX = constrain(
        frontLineX,
        0,
        width * 0.8
      );

      screenShake = 10;

      showMessage("몬스터 제거 완료!");

      score++;

      break;
    }
  }

  
  if (!success) {

    frontLineX -= 60;

    screenShake = 20;

    showMessage("으악! 오타냈다...");
  }

  inputBox.value("");
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

  if (bossDead) return;

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
  text("#엔딩4",windowWidth / 13,windowHeight / 8)
  textSize(30);
  fill(0)
  text(
  " 추후 수정 사항: \n 몬스터 사망 애니메이션,\n플레이어 쿨타임 설정 및 화면에 넣기,\n각각 스테이지 이어 붙이기,\디자인 개선,\n 엔딩 세부사항 추가",
  windowWidth / 7,
  windowHeight / 2
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
  imageMode(CORNER)
  image(bg2, 0, 0, width, height);

  fill(0, 180);
  rectMode(CENTER)
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
    height / 7
  );

  textSize(30);

  text(
    "추후 수정 사항: \n 몬스터 사망 애니메이션,\n플레이어 쿨타임 설정 및 화면에 넣기,\n각각 스테이지 이어 붙이기,\디자인 개선,\n 엔딩 세부사항 추가",
    width / 2,
    height / 2
  );
}
// 창 크기 변경 대응
function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

  inputBox.position(windowWidth / 2 - 100,
                    windowHeight - 60);
}