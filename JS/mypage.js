function resetb(){
    location.reload(); 
}


function startTimer(){

    //初始化网页显示
    document.getElementById("vid").style.opacity = 1;
    document.getElementById("omg").style.opacity = 0;
    var element = document.getElementById("player");
    var speed;
    var yspeed=0.42;
    var di=0;
    var fd;
    document.getElementById("d").innerHTML="← 0.0000 格 →"
    //var positions = [{ top: 50, left: 50 }, { top: 100, left: 200 }, { top: 150, left: 100 }];
   // var currentPosition = 0;
    var times = 0;
    var bm= parseFloat(document.getElementById("bm").value);


    //检测输入是否符合条件（主操作区）
    if ((bm<=2&&bm>=0.5) || document.getElementById("mmlim").checked){
        document.getElementById("omg").style.zoom="20%"
        document.getElementById("vid").style.zoom="20%"
        document.getElementById("omg").pause();
        document.getElementById("bmp").innerHTML=bm;
        var J22 = 0.3274;
        var K22 = 1.274;
        var I22 = 12;
        document.getElementById("bmp").style.width=bm*100 + "px"

        //预处理玩家初始速度
        bm = bm+0.6;
        var result =((2025000*J22)+((450000*K22)*I22)+((4550000*K22)*(91/100)**(I22-2))-(5450000*K22)-(2025000*bm)-(4022109*(91/100)**(I22-2))+4022109)/((6707610*(91/100)**(I22-2))-9838260);    //来自某圈内人的 反向助跑 初速度计算公式
        var x=-60
        var y=0;
        speed = result
        x+=result*100
        element.style.left=x+"px"

        //预处理助跑和距离显示
        var C65 = result
        var D65 = 12;
        var E65 = 0.3274;
        var F65 = 1.274;
        var G65 = 1;

        //更高精度的函数拟合
        var fd = 0.6+E65 + 0.222222222222222 * F65 * (-2 + D65) + 1.91 * (((1 - Math.pow(0.6, G65) * Math.pow(0.91, D65) ** G65) * (0.6 * Math.pow(0.91, -1 + D65) * E65 + 0.222222222222222 * (1 - Math.pow(0.91, -1 + D65)) * F65)) / (1 - 0.6 * Math.pow(0.91, D65)) + Math.pow(0.6, 1 + G65) * Math.pow(0.91, D65) ** G65 * C65) + 5.52066666666666 * (1 - Math.pow(0.91, -2 + D65)) * (1.09890109890109 * E65 - 0.407000407000406 * F65 + ((1 - Math.pow(0.6, G65) * Math.pow(0.91, D65) ** G65) * (0.6 * Math.pow(0.91, -1 + D65) * E65 + 0.222222222222222 * (1 - Math.pow(0.91, -1 + D65)) * F65)) / (1 - 0.6 * Math.pow(0.91, D65)) + Math.pow(0.6, 1 + G65) * Math.pow(0.91, D65) ** G65 * C65);
        document.getElementById("ldp").style.left=((bm-0.6)*100+fd*100)+"px"
        document.getElementById("d").style.left=((fd*100)/2+(bm-0.6)*100-120)+"px"

        //初始化速度表格
        for(let i=1;i<12;i++){
            document.getElementById("s"+i).innerHTML="0"
            document.getElementById("d"+i).innerHTML="0"
        }
        document.getElementById("sound").currentTime = 2.8;

        //玩家运动递推部分
        var timer = setInterval(function() {
            startButton.disabled = true; //模拟途中禁用start按钮

            //垂直速度（Y轴）处理部分
            //玩家起跳时的处理 （初始化Y轴速度）
            if(times==0||times==I22){
                yspeed=0.42;
                y+=-yspeed*100
                element.style.top=y+"px"

            //玩家落地瞬间的处理
            }else if(times==I22-1||times>=23){
                document.getElementById("sound").currentTime = 0;
                document.getElementById("sound").play()
                
                yspeed=0;
                y=0
                element.style.top=y+"px"

            //正常情况下的递推
            }else{
                yspeed=(yspeed-0.08)*0.98
                y+=-yspeed*100
                element.style.top=y+"px"
            }


            //横向速度（x轴）处理部分
            //初始速度设置 （第1次起跳时的处理）
            if (times==0){
                speed = speed*0.91*0.6+0.1*1.3*0.98+0.2
                x+=speed*100   
                element.style.left=x+"px"

            //第1次起跳下一刻的滑度特判 (p.s. mc中方块滑度的影响会持续1tick，因此下一刻必须特判)
            }else if(times==1){
                speed=speed*0.6*0.91+0.02*1.3*0.98
                x+=speed*100  
                element.style.left=x+"px"

            //第2次起跳时的处理
            }else if(times==I22){
                speed=speed*0.91+0.1*1.3*0.98+0.2
                x+=speed*100   
                element.style.left=x+"px"

            //第2次起跳下一刻的滑度特判
            }else if(times==1+I22){
                speed=speed*0.6*0.91+0.02*1.3*0.98
                x+=speed*100  
                element.style.left=x+"px"

            //正常情况下的递推
            }else{
                speed=speed*1*0.91+0.02*1.3*0.98
                x+=speed*100  
                element.style.left=x+"px"
            }

            //模拟结束后的处理部分
            if (times >= 23) {

                //切换右上角视频
                document.getElementById("omg").style.opacity = 1;
                document.getElementById("vid").style.opacity = 0;

                document.getElementById("omg").play();
                document.getElementById("omg").currentTime = 0;

                //视频播放完毕后切换回去
                document.getElementById("omg").addEventListener("ended", function() {
                    document.getElementById("vid").style.opacity = 1;
                    document.getElementById("omg").style.opacity = 0;
                    x=-60
                    y=0;
                    element.style.left=x+"px"
                    element.style.top=y+"px"
                });

                startButton.disabled = false;  //再次允许使用start按钮
                clearInterval(timer); 
                return;
            }

            //屏幕中间距离的递推部分
            if (times==11){
                di+=speed;
            }
            if (times>=12){
                di+=speed
                document.getElementById("d"+(times-11)).innerHTML=di+0.6
                document.getElementById("s"+(times-11)).innerHTML=speed

                document.getElementById("d").innerHTML="← "+Math.round((di+0.6)*10000)/10000+" 格 →"
            }

            times++
        }, 50);
    }
}
