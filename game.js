var divCharactors = document.getElementById("charactors");

//一些配置
var config = {
  ContainerWidth: 512, //容器宽度
  ContaninerHeight: 480, //容器高度
  durationForMove: 16, //移动计时器时间间隔
  durationForCreateMonster: 3000, //产生怪物的计时器的间隔
  durationForTime: 16, //计算时间的计时间隔
};
var timeForMove; //让英雄和怪物移动的定时器
var timeForCreateMonster;  //产生怪物的定时器
var monsters = [];  //定义怪物的集合
var timeForTime; //用于计算时间的定时器


//英雄人物对象
var hero = {
  width: 32,
  height: 32,
  left: 0,
  top: 0,
  speed: 150,
  dom: document.createElement("div"),
  xSpeed: 0,
  ySpeed: 0,
  isInit: false,
  key: "",
  //显示英雄
  show: function () {
    //未进行初始化
    if (!this.isInit) {
      divCharactors.appendChild(this.dom);
      this.dom.className = "hero";
      this.isInit = true; //已初始化
      //设置初始位置
      this.left = config.ContainerWidth / 2 - this.width / 2 ;
      this.top = config.ContaninerHeight / 2 - this.height / 2 ;
    }
    this.dom.style.left = this.left + "px";
    this.dom.style.top = this.top + "px";
  },

  /**
   * 根据英雄当前的速度，和经过的时间 移动英雄（改变英雄的横纵坐标）
   * @param {*} duartion 经过的时间，单位是 秒
   */
  move: function (duartion) {
    xDis = this.xSpeed * duartion;
    yDis = this.ySpeed * duartion;
    newLeft = this.left + xDis;
    newTop = this.top + yDis;
    if (newLeft < 0) {
      newLeft = 0;
    } else if (newLeft > config.ContainerWidth - this.width) {
      newLeft = config.ContainerWidth - this.width
    }
    if (newTop < 0) {
      newTop = 0;
    } else if (newTop > config.ContaninerHeight - this.height) {
      newTop = config.ContaninerHeight - this.height
    }

    this.left = newLeft;
    this.top = newTop;
    this.show(); //重新显示
  },

  //添加事件处理
  addEvent: function () {
    //键盘按下事件
    document.onkeydown = (e) => {
      this.key = e.key;
      switch (e.key) {
        case "ArrowLeft":
          this.xSpeed = -this.speed;
          this.ySpeed = 0;
          break;
        case "ArrowUp":
          this.ySpeed = -this.speed;
          this.xSpeed = 0;
          break;
        case "ArrowRight":
          this.xSpeed = this.speed;
          this.ySpeed = 0;
          break;
        case "ArrowDown":
          this.ySpeed = this.speed;
          this.xSpeed = 0;
          break;
      }
    };
    //键盘弹起事件
    document.onkeyup = (e) => {
      if (e.key == this.key && (e.key == "ArrowLeft" || e.key == "ArrowRight")) {
        this.xSpeed = 0;
      }
      else if (e.key == this.key && (e.key == "ArrowUp" || e.key == "ArrowDown")) {
        this.ySpeed = 0;
      }
    }
  }
};

//获取任意一个介于两个数之间的值
function getRandom (min , max) {
  return Math.floor(Math.random() * (max - min) + min);
}

//创建一个怪物
var createMonster = function () {
  var monster = {
    width: 30,
    height: 32,
    left: 0,
    top: 0,
    dom: document.createElement("div"),
    xSpeed: getRandom(40, 100),
    ySpeed: getRandom(40, 100),
    isInit: false,
    //显示怪物
    show: function () {
      //未进行初始化
      if (!this.isInit) {
        divCharactors.appendChild(this.dom);
        this.dom.className = "monster";
        this.isInit = true; //已初始化
      }
      this.dom.style.left = this.left + "px";
      this.dom.style.top = this.top + "px";
    },

    /**
     * 根据怪物当前的速度，和经过的时间 移动英雄（改变英雄的横纵坐标）
     * @param {*} duartion 经过的时间，单位是 秒
     */
    move: function (duartion) {
      xDis = this.xSpeed * duartion;
      yDis = this.ySpeed * duartion;
      newLeft = this.left + xDis;
      newTop = this.top + yDis;
      if (newLeft < 0) {
        newLeft = 0;
        this.xSpeed = -this.xSpeed;
      } else if (newLeft > config.ContainerWidth - this.width) {
        newLeft = config.ContainerWidth - this.width;
        this.xSpeed = -this.xSpeed;
      }
      if (newTop < 0) {
        newTop = 0;
        this.ySpeed = -this.ySpeed;
      } else if (newTop > config.ContaninerHeight - this.height) {
        newTop = config.ContaninerHeight - this.height;
        this.ySpeed = -this.ySpeed;
      }

      this.left = newLeft;
      this.top = newTop;
      this.show(); //重新显示
    },
  };
  //显示怪物并返回
  monster.show();
  return monster;
};

//计时器对象
var time = {
  dom: document.getElementById("time"),
  miliSec: 0, //计算经过的毫秒数
  start: function () {
    //开始计时
    let result;
    timeForTime = setInterval(() => {
      this.miliSec += config.durationForTime;
      this.dom.innerText = this.toString();
    }, config.durationForTime)
  },
  toString: function () {
    //将当前计时器的毫秒，转换为一个友好的字符串返回
    //1000  ->   00:01:00
    //1520  ->   00:01:52
    let temp = this.miliSec;
    let minute = Math.floor(temp / 60000); //得到分钟的整数
    temp %= 60000;
    let second = Math.floor(temp / 1000); //得到秒钟的整数
    temp %= 1000;
    let miliSec = temp; //得到剩余的毫秒数

    //分，秒，毫秒均得为两位数
    //padStart 如果给定的字符串不满足指定的位数，则向该字符串左边填充指定的字符
    minute = minute.toString().padStart(2, 0);
    second = second.toString().padStart(2, 0);
    miliSec = Math.floor(miliSec / 10).toString().padStart(2, 0);

    return minute + ":" + second + ":" + miliSec;
  }
};


//初始化游戏
function init() {
  hero.show(); //显示英雄
  hero.addEvent(); //键盘操作英雄

  //每隔一段时间产生一个怪物
  timeForCreateMonster = setInterval(function () {
    let m = createMonster();
    monsters.push(m)
  }, config.durationForCreateMonster)

  //启动移动的计时器
  timeForMove = setInterval(function () {
    let second = config.durationForMove / 1000;
    //英雄移动
    hero.move(second);
    //所有怪物移动
    for (let i =0; i< monsters.length; i++) {
      let m = monsters[i];
      m.move(second);
    }
    //如果英雄与怪物接触，游戏结束
    if (isHit()) {
      gameOver();
    }
  }, config.durationForMove);

  //启动计时器
  time.start();
}

//游戏结束，关闭所有定时器
function gameOver() {
  clearInterval(timeForMove);
  clearInterval(timeForCreateMonster);
  clearInterval(timeForTime);
  alert("用时：" + time.toString() + "\n游戏结束！！！");
}

//检测英雄是否与怪物发生碰撞
function isHit() {
  for(let i=0; i<monsters.length; i++) {
    let m = monsters[i];
    if(hitNow(m)) {
      return true;
    }
  }
  return false;

  //英雄与怪物发生碰撞
  function hitNow(m) {
    //矩形碰撞检查：实际上，检测的是两个矩形是否相交
    //矩形中心点横向距离绝对值 < 矩形的宽度之和 / 2    并且     矩形中心点纵向距离绝对值 < 矩形高度之和 / 2
    var heroCentenX = hero.left + hero.width / 2;  //英雄中心点横坐标
    var heroCentenY = hero.top + hero.height / 2;  //英雄中心点纵坐标
    var mCentenX = m.left + m.width / 2;  //怪物中心点横坐标
    var mCentenY = m.top + m.height / 2;  //怪物中心点纵坐标
    var correct = 8;
    if (Math.abs(heroCentenX - mCentenX) < (hero.width + m.width - correct)/2 &&
      Math.abs(heroCentenY - mCentenY) < (hero.height + m.height - correct)/2) {
      return true;
    }
    return false;
  }
}

//开始游戏
init();
