$(function(){
    $("#fail").hide();
    $("#mobile").hide();
    Game.init($('#game'));//开始游戏
})

var Game = {
    init:function(father){
        this.father = father;
        this.choseDiv = $("#chose");
        this.rechose = $("#rechose");
        this.fail = false;
        this.isPass = new Array(CONFIG.totalLevel);//存储过了那一关
        if(isMobile()){
            this.ceilSize = CONFIG.ceilSize;
            $("#game").children().css("width",this.ceilSize+"px");
            $("#game").children().css("height",this.ceilSize+"px");
        }
        else{
            this.ceilSize = 50;
        }
        this.choseDifficulty();
    },
    choseLevel:function(){//选择关卡
        document.title = "推箱子——选择关卡";
        this.father.empty();
        this.choseDiv.empty();
        this.rechose.empty();
        $("#mobile").hide();
        $("#fail").hide();
        this.fail = false;
        this.choseDiv.append("<p>选择关卡</p>");
        for(var i = 0;i < CONFIG.totalLevel;i++){
            this.choseDiv.append("<button class='level-btn'>"+(i+1)+"</button>")
        }
        this.bindLevel();
    },
    bindLevel:function(){//绑定选择关卡的按钮
        if(isMobile()){
            $("#chose").on("tap",$.proxy(function(e){
                if(e.target.nodeName === "BUTTON"){
                    if(e.target.className === "level-btn"){
                        this.level = parseInt($(e.target).text())-1;
                        this.createMap();
                    }
                }
            },this));
        }
        else{
            $("#chose").click($.proxy(function(e){
                if(e.target.nodeName === "BUTTON"){
                    if(e.target.className === "level-btn"){
                        this.level = parseInt($(e.target).text())-1;
                        this.createMap();
                    }
                }
            },this));
        }
    },
    choseDifficulty:function(){//选择难度
        document.title = "推箱子——选择难度";
        this.father.empty();
        this.choseDiv.empty();
        this.rechose.empty();
        $("#mobile").hide();
        $("#fail").hide();
        this.fail = false;
        this.choseDiv.append("<p>选择难度</p>");
        this.choseDiv.append("<p style='color:grey;font-size:12px'>简单和困难各有两关，通过任意难度两关即为通关。</p>");
        this.choseDiv.append("<button class='difficulty-btn'>简单</button>");
        this.choseDiv.append("<button class='difficulty-btn'>困难</button>");
        this.bindDifficulty();
    },
    bindDifficulty:function(){//绑定选择难度的关卡
        if(isMobile()){
            $("#chose").on("tap",$.proxy(function(e){
                if(e.target.nodeName === "BUTTON"){
                    if(e.target.className === "difficulty-btn"){
                        this.difficulty = $(e.target).text() === "简单" ? 0:1;
                        this.choseLevel();
                    }
                }
            },this));
        }
        else{
            $("#chose").click($.proxy(function(e){
                if(e.target.nodeName === "BUTTON"){
                    if(e.target.className === "difficulty-btn"){
                        this.difficulty = $(e.target).text() === "简单" ? 0:1;
                        this.choseLevel();
                    }
                }
            },this));
        }
    },
    createMap:function(){
        $("#fail").hide();
        this.father.empty();
        this.choseDiv.empty();
        this.rechose.empty();
        $("#mobile").hide();
        this.fail = false;
        this.rechose.append("<button class='rechoseDifficulty'>重选难度</button>");
        this.rechose.append("<button class='rechoseLevel'>重选关卡</button>");
        document.title = '第'+(this.level+1)+'关';
        this.nowJson = this.difficulty === 0? CONFIG.easyLevel[this.level] : CONFIG.hardLevel[this.level];
        //存放箱子位置，方便进行失败判断,会进行修改所以需要深拷贝
        this.boxPosition = JSON.parse(JSON.stringify(this.nowJson.box));

        this.father.css('width',Math.sqrt(this.nowJson.map.length)*this.ceilSize);
        $.each(this.nowJson.map,$.proxy(function(i,elem){
            this.father.append("<div class="+CONFIG.className[elem]+"></div>");
        },this));
        this.bindRechose();
        this.createBox();
        this.createPlayer();
    },
    bindRechose:function(){//重新选择关卡和难度
        if(isMobile()){
            $("#rechose").on("tap",$.proxy(function(e){
                if(e.target.className === "rechoseDifficulty"){
                    // this.choseDifficulty();
                    Game.init($('#game'));
                }
                else if(e.target.className === "rechoseLevel"){
                    this.choseLevel();
                }
            },this));
            $("#fail-btn").on("tap",$.proxy(function(e){
                this.createMap();
            },this));
        }
        else{
            $("#rechose").click($.proxy(function(e){
                if(e.target.className === "rechoseDifficulty"){
                    // this.choseDifficulty();
                    Game.init($('#game'));
                }
                else if(e.target.className === "rechoseLevel"){
                    this.choseLevel();
                }
            },this));
            $("#fail-btn").click($.proxy(function(e){
                this.createMap();
            },this));
        }
    },
    createBox:function(){//根据CONFIG创建箱子
        $.each(this.nowJson.box,$.proxy(function(i,elem){
            var box = $('<div class="box" id='+i+'box'+'></div>');
            box.css('left',elem.x * this.ceilSize);
            box.css('top',elem.y * this.ceilSize);
            this.father.append(box);
        },this));
    },
    createPlayer:function(){//根据CONFIG创建玩家
        var player = $("<div id='player'></div>");
        player.css("left",this.nowJson.player.x * this.ceilSize);
        player.css("top",this.nowJson.player.y * this.ceilSize);
        player.data("x",this.nowJson.player.x);
        player.data("y",this.nowJson.player.y);
        this.father.append(player);
        if(this.ceilSize === 50){
            $("#game").children().css("width",this.ceilSize+"px");
            $("#game").children().css("height",this.ceilSize+"px");
        }
        this.bindPlayer(player);
    },
    bindPlayer:function(player){
        if(isMobile()){
            $(document).on("swipeleft",$.proxy(function(e){
                if(!this.fail){
                    player.css('background','url(./img/left.png)');//切换玩家朝向
                    player.css('background-size','100% 100%');
                    this.runPlayer(player,{x:-1});
                }
            },this));
            $(document).on("swipeleft",$.proxy(function(e){
                if(!this.fail){
                    player.css('background','url(./img/left.png)');//切换玩家朝向
                    player.css('background-size','100% 100%');
                    this.runPlayer(player,{x:-1});
                }
            },this));
            $("#mobile").show();
            $("#mobile").on("tap",$.proxy(function(e){
                if(!this.fail){
                    switch($(e.target)[0].id){
                        case "left": //左
                        if(!this.fail){
                            player.css('background','url(./img/left.png)');//切换玩家朝向
                            player.css('background-size','100% 100%');
                            this.runPlayer(player,{x:-1});
                        }
                        break;
                    case "up"://上
                        if(!this.fail){
                            player.css('background','url(./img/top.png)');
                            player.css('background-size','100% 100%');
                            this.runPlayer(player,{y:-1});
                        }
                        break;
                    case "right"://右
                        if(!this.fail){
                            player.css('background','url(./img/right.png)');
                            player.css('background-size','100% 100%');
                            this.runPlayer(player,{x:1});
                        }
                        break;
                    case "down"://下
                        if(!this.fail){
                            player.css('background','url(./img/down.png)');
                            player.css('background-size','100% 100%');
                            this.runPlayer(player,{y:1});
                        }
                        break;
                    }
                }
            },this));
        }
        else{
            $(document).keydown($.proxy(function(e){
                switch(e.which){
                    case 37: //左
                        if(!this.fail){
                            player.css('background','url(./img/left.png)');//切换玩家朝向
                            player.css('background-size','100% 100%');
                            this.runPlayer(player,{x:-1});
                        }
                        break;
                    case 38://上
                        if(!this.fail){
                            player.css('background','url(./img/top.png)');
                            player.css('background-size','100% 100%');
                            this.runPlayer(player,{y:-1});
                        }
                        break;
                    case 39://右
                        if(!this.fail){
                            player.css('background','url(./img/right.png)');
                            player.css('background-size','100% 100%');
                            this.runPlayer(player,{x:1});
                        }
                        break;
                    case 40://下
                        if(!this.fail){
                            player.css('background','url(./img/down.png)');
                            player.css('background-size','100% 100%');
                            this.runPlayer(player,{y:1});
                        }
                        break;
                }
            },this));
        }
    },
    runPlayer:function(player,step){
        stepX = step.x || 0;
        stepY = step.y || 0;
        var boxMoveId = -1;
        //判断走向的地方是不是墙
        if(this.nowJson.map[(player.data('y')+stepY) * Math.sqrt(this.nowJson.map.length) + (player.data('x') + stepX)] != 1){//如果不是墙，走一步
            player.data('x',player.data('x')+stepX);
            player.data('y',player.data('y')+stepY);
            player.css('left',player.data('x')*this.ceilSize);
            player.css('top',player.data('y')*this.ceilSize);
            $('.box').each($.proxy(function(i,elem){
                //如果前面是箱子了，箱子前面不是墙，则推箱子
                if(this.pz(player,$(elem)) && this.nowJson.map[(player.data('y')+stepY) * Math.sqrt(this.nowJson.map.length) + (player.data('x') + stepX)] !=1){
                    $(elem).css('left',(player.data('x')+stepX)*this.ceilSize);
                    $(elem).css('top',(player.data('y')+stepY)*this.ceilSize);
                    this.boxPosition[i].x += stepX ? stepX:0;
                    this.boxPosition[i].y += stepY ? stepY:0;
                    boxMoveId = parseInt($(elem)[0].id);
                    $('.box').each($.proxy(function(j,elem2){
                    //如果箱子前面还是箱子，那么推不动，人不能走这一步，箱子也回归原位
                        if(this.pz( $(elem) , $(elem2) ) && elem != elem2){
                            $(elem).css('left',player.data('x')*this.ceilSize);
                            $(elem).css('top',player.data('y')*this.ceilSize);
                            this.boxPosition[i].x -= stepX ? stepX:0;//退回
                            this.boxPosition[i].y -= stepY ? stepY:0;
                            boxMoveId = -1;
                            player.data('x',player.data('x') - stepX);
                            player.data('y',player.data('y') - stepY);
                            player.css('left',player.data('x')*this.ceilSize);
                            player.css('top',player.data('y')*this.ceilSize);
                        }
                    },this));
                }else if(this.pz(player,$(elem))){//如果这个方向有箱子，箱子前面是墙，则不能走这一步，要退回去
                    player.data('x',player.data('x') - stepX);
                    player.data('y',player.data('y') - stepY);
                    player.css('left',player.data('x')*this.ceilSize);
                    player.css('top',player.data('y')*this.ceilSize);
                }
            },this));
        }
        this.winOne();
        this.failOne(boxMoveId);
    },
    pz : function(obj1,obj2){//判断玩家是否推了箱子
        var L1 = obj1.offset().left;
        var R1 = obj1.offset().left+obj1.width();
        var T1 = obj1.offset().top;
        var B1 = obj1.offset().top+obj1.height();

        var L2 = obj2.offset().left;
        var R2 = obj2.offset().left+obj2.width();
        var T2 = obj2.offset().top;
        var B2 = obj2.offset().top+obj2.height();

        if(L1 >= R2 || R1 <= L2 || B1 <= T2 || T1 >= B2){//若玩家推了箱子，行走后应不满足这些条件
            return false;
        }else{
            return true;
        }
    },
    winOne:function(){//赢了一关，重回选择关卡界面
        var num = 0;
        $('.target').each($.proxy(function(i,elem){
            $('.box').each($.proxy(function(j,elem2){
                if(this.pz( $(elem) , $(elem2) )){
                    num++;
                    $(elem2).css("background","url(./img/target.png)");
                    $(elem2).css("background-size","100% 100%");
                }
            },this));
        },this));
        if(num === this.nowJson.box.length){
            this.isPass[this.level] = 1;
            this.winAll();
        }
    },
    failOne:function(boxId){
    //如果有一个箱子相邻的两面都是墙x
    //两个箱子相邻且它们贴墙
        if(this.nextTo(boxId)){
            this.failPage();
        }
        for(var i = 0;i < this.nowJson.box.length;i++){
            if(i !== boxId){//判断是否有两个箱子相邻
                var dcn = this.nextTo(boxId,i);
                if(dcn !== -1){
                    if(this.nextTo(boxId,i,dcn)){//箱子上下相邻判断左右临墙否，反之判断上下临墙否
                        this.failPage();
                    }
                }
            }
        }
    },
    failPage:function(){
        document.title = "很遗憾";
        this.fail = true;
        $("#fail").show();
        $("#player").css("background","url(./img/die.png)");
        $("#player").css("background-size","100% 100%");
    },
    nextTo:function(obj1,obj2,dcn){//物体1，物体2，方向
        if(obj1 === -1)//没动箱子
            return 0;
        var tmpX = [0,1,0,-1];
        var tmpY = [-1,0,1,0];
        if(typeof(dcn) === "undefined"){
            if(typeof(obj2) !== "undefined"){
            //判断箱子相邻返回-1为不相邻，0为1上与2下相邻，1为右左相邻，2为下上相邻，3为左右相邻
                for(var i = 0;i < 4;i++){
                    if(this.boxPosition[obj1].x+tmpX[i] === this.boxPosition[obj2].x && this.boxPosition[obj1].y+tmpY[i] === this.boxPosition[obj2].y){
                        return i;
                    }
                }
                return -1;
            }
            else{//判断一个箱子是否相邻两面贴墙,1表示两面贴墙，0表示不贴
                var count = 0;
                for(var i = 0;i < 4;i++){//0表示outside，1表示wall，2表示floor，3表示target
                    var mapPosition = (this.boxPosition[obj1].y+tmpY[i])*Math.sqrt(this.nowJson.map.length)+(this.boxPosition[obj1].x+tmpX[i]);
                    var objPosition = (this.boxPosition[obj1].y)*Math.sqrt(this.nowJson.map.length)+(this.boxPosition[obj1].x);
                    var flag = (this.nowJson.map[mapPosition] === 1) && (this.nowJson.map[objPosition] !== 3);
                    if(count === 0){
                        count += flag ? 1:0;
                    }
                    else if(count === 1){
                        count = flag? 2:0;
                    }
                    if(count === 2){
                        return 1;
                    }
                }
                return 0;
            }
        }
        else{
            var tmp = [1,-1];
            var obj1Position = (this.boxPosition[obj1].y)*Math.sqrt(this.nowJson.map.length)+(this.boxPosition[obj1].x);
            var obj2Position = (this.boxPosition[obj2].y)*Math.sqrt(this.nowJson.map.length)+(this.boxPosition[obj2].x);
            if(dcn % 2 === 0){//箱子上下相邻
                for(var i = 0;i < 2;i++){//当前位置不是目标且两个箱子相邻的方向的临边贴墙
                    var obj1NextPosition = (this.boxPosition[obj1].y)*Math.sqrt(this.nowJson.map.length)+(this.boxPosition[obj1].x+tmp[i]);
                    var obj2NextPosition = (this.boxPosition[obj2].y)*Math.sqrt(this.nowJson.map.length)+(this.boxPosition[obj2].x+tmp[i]);
                    if((this.nowJson.map[obj1NextPosition] === 1) && (this.nowJson.map[obj2NextPosition] === 1) && (this.nowJson.map[obj1Position] !== 3 && this.nowJson.map[obj2Position] !== 3)){
                        return 1;
                    }
                }
            }
            else{//箱子左右相邻
                for(var i = 0;i < 2;i++){
                    var obj1NextPosition = (this.boxPosition[obj1].y+tmp[i])*Math.sqrt(this.nowJson.map.length)+(this.boxPosition[obj1].x);
                    var obj2NextPosition = (this.boxPosition[obj2].y+tmp[i])*Math.sqrt(this.nowJson.map.length)+(this.boxPosition[obj2].x);
                    if((this.nowJson.map[obj1Position] === 1) && (this.nowJson.map[obj2Position] === 1) && (this.nowJson.map[obj1Position] !== 3 && this.nowJson.map[obj2Position] !== 3)){
                        return 1;
                    }
                }
            }
            return 0;
        }
    },
    winAll:function(){
        num = 0;
        for(var i = 0;i < CONFIG.totalLevel;i++){
            if(this.isPass[i] !== 1){
                this.choseLevel();
            }
            else{
                num += 1;
            }
        }
        if(num === CONFIG.totalLevel)
            this.winPage();
    },
    winPage:function(){
        document.title = "恭喜通关";
        this.father.empty();
        this.choseDiv.empty();
        this.rechose.empty();
        this.father.append("<h1>恭喜通关！！！</h1>");
    }
}