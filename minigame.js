let street;
let ending_0;

let scene = "info";

let power = 15;

let winTimer = 0;
let loseTimer = 0;
let select = 0;

function preload() {

  street = loadImage("street.png");
  ending_0 = loadImage("ending0.png");
}

function setup() {

  createCanvas(windowWidth, windowHeight);

  fullscreen(true);

}

function draw() {

  if(scene == "info"){

    infoScene();

  }

  else if(scene == "game"){

    miniScene();

  }

  else if(scene == "win"){

    winScene();

  }

  else if(scene == "lose"){

    loseScene();

  } else if(scene == "ending_0")
    ending0();
}

function infoScene() {

  image(street, 0, 0, width, height);

  // 반투명 레이어
  push();

  fill(255, 150);

  rectMode(CORNER);

  rect(0, 0, width, height);

  pop();

  // 설명창
  rectMode(CENTER);

  fill(255);

  rect(
    windowWidth/2,
    windowHeight/3,
    windowWidth / 1.3,
    windowHeight / 3.8
  );

  // 제목
  fill(0);

  textAlign(CENTER, CENTER);

  textSize(38);

  text(
    "[스페이스바 연타!]\n도둑을 밀어내라!",
    windowWidth/2,
    windowHeight/8.5
  );

  // 설명
  textSize(27);
  text(
    "도둑을 밀어내는 미니게임 입니다."+
    "\n스페이스바를 최대한 빠르게 연타하여"+
    "\n도둑을 무찌르세요!",
    windowWidth/2,
    windowHeight/3
  );
  // 주의 문구
  textSize(20);

  text(
    "*주의: 플레이어의 승패에 따라 엔딩이 달라질 수 있습니다.",
    windowWidth/2,
    windowHeight/1.5
  );

  // 시작 문구
  push();

  fill(80);

  text(
    "시작하려면 아무곳이나 클릭하세요.",
    windowWidth/1.7,
    windowHeight/2
  );

  // 깜빡이는 >>
  if(frameCount % 60 < 30){

    strokeWeight(2);

    text(
      ">>",
      windowWidth/1.19,
      windowHeight/2
    );

  }

  pop();

}

function miniScene() {

  image(street, 0, 0, width, height);

  // 어둡게
  push();

  fill(0, 100);

  rectMode(CORNER);

  rect(0, 0, width, height);

  pop();


  // 승패 확정 전까지만 감소
  if(winTimer == 0 && loseTimer == 0){

    power -= 0.35;

  }

  power = constrain(power, 0, 100);

  // 제목
  fill(255);

  textAlign(CENTER);

  textSize(50);

  text(
    "스페이스바를 연타하세요!",
    width/2,
    100
  );
  
  //게이지바 배경
  fill(80); 
  rect(width/2, height/1.2, width/1.3, 50); 
  // 게이지 
  fill(200, 50, 50); rect(width/2, height/1.2, power * 5, 50);

  // 상태 텍스트
  fill(255);

  // 매우 위험
  if(power < 10){

    push();

    fill(255,0,0);

    textSize(55 + sin(frameCount*0.2)*5);

    text(
      "이러다 지겠어!",
      width/2,
      200
    );

    pop();

  }

  // 위험
  else if(power < 30){

    push();

    textSize(50 + sin(frameCount*0.2)*5);

    text(
      "크윽... 힘이 너무 세잖아!",
      width/2,
      200
    );

    pop();

  }

  // 중간
  else if(power < 70){

    text(
      "버티는 중!",
      width/2,
      200
    );

  }

  // 거의 승리
  else if(power < 100){

    push();

    textSize(50 + sin(frameCount*0.2)*5);

    text(
      "조금만 더!",
      width/2,
      200
    );

    pop();

  }

  // 승리
  if(power >= 100){

    power = 100;

    textSize(60);

    fill(255);

    text(
      "나의 승리다!!",
      width/2,
      200
    );

    // 최초 1회만 저장
    if(winTimer == 0){

      winTimer = millis();

    }

    // 2초 뒤 이동
    if(millis() - winTimer > 2000){

      scene = "win";

    }

  }

  // 패배
  if(power <= 0){

    power = 0;

    textSize(60);

    fill(255,0,0);

    text(
      "젠장... 패배했다...",
      width/2,
      280
    );

    // 최초 1회만 저장
    if(loseTimer == 0){

      loseTimer = millis();

    }

    // 2초 뒤 이동
    if(millis() - loseTimer > 2000){

      scene = "lose";

    }

  }

}

function winScene() {

  background(20);

  fill(255);

  textAlign(CENTER, CENTER);

  textSize(70);

  text(
    "승리!",
    width/2,
    height/2
  );

  textSize(40);

  text(
    "도둑을 몰아냈다.",
    width/2,
    height/1.7
  );

}

function loseScene() {

  background(0);

  fill(255,0,0);

  textAlign(CENTER, CENTER);

  textSize(70);

  text(
    "패배...",
    width/2,
    height/2
  );

  textSize(40);

  fill(255);

  text(
    "도둑에게 패배했다.",
    width/2,
    height/1.7
  );
  push()
  textSize(20);
  text(
    "엔딩을 보려면 아무곳이나 클릭하세요.",
    windowWidth/1.7,
    windowHeight/1.3
  );

  // 깜빡이는 >>
  if(frameCount % 60 < 30){

    strokeWeight(2);

    text(
      ">>",
      windowWidth/1.19,
      windowHeight/1.3
    );
  }
  pop()
}
function ending0() {
  image(ending_0, 0, 0, width, height);
  fill(255, 180);
  rect(
    windowWidth / 2,
    windowHeight / 1.8,
    windowWidth / 1.3,
    windowHeight / 2
  );
  textAlign(LEFT);
  textSize(50);
  fill(255)
  text("#엔딩0",windowWidth / 13,windowHeight / 8)
  textSize(30);
  fill(0)
  text("개선사항: hp에러 고치기,\n디자인 개선",windowWidth / 6,windowHeight / 1.8)
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
function mousePressed() { 
  if(scene == "info"){
    scene = "game"; 
  } else if(scene == "lose"){ 
    scene = "ending_0"; 
  } if(mouseX<=windowWidth / 1.8 && mouseX>=windowWidth/2.2 && mouseY<=windowHeight / 1.05&&mouseY>=windowHeight / 1.12) { 
    scene = "info" 
  } 
}

function keyPressed() {

  // 미니게임
  if(scene == "game"){

    if(key == ' '){

      power += 5;

    }

  }

  // 엔딩 선택지
  else if(scene == "ending_0"){

    // 아래 방향키
    if(keyCode == DOWN_ARROW){

      select++;

      if(select > 1){
        select = 0;
      }

    }

    // 위 방향키
    else if(keyCode == UP_ARROW){

      select--;

      if(select < 0){
        select = 1;
      }

    }

    // 엔터키
    else if(keyCode == ENTER){

      // 네
      if(select == 0){

        power = 15;

        winTimer = 0;
        loseTimer = 0;

        select = 0;

        scene = "info";

      }

      // 아니오
      else if(select == 1){

        scene = "info";

      }

    }

  }

}