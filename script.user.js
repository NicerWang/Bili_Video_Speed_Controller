// ==UserScript==
// @name         Bili_Video_Speed_Controller
// @namespace    https://github.com/NicerWang
// @version      0.1
// @description  自定义Bilibili视频播放速度（新版播放器）
// @author       NicerWang
// @match        https://www.bilibili.com/video/*
// ==/UserScript==

(function() {
    'use strict';
    let speeds;
    let speed = 2;
    let selected = false;
    async function registerVideoChangeHandler() {
        const observer = new MutationObserver(e => {
            if (e[0].target.src) {
                speeds = document.querySelectorAll("li.bilibili-player-video-btn-speed-menu-list");
                init();
            }
        });
        observer.observe(document.querySelector('.bilibili-player-video video'), {attributes:true});
    }
    let timer = setInterval(()=>{
        speeds = document.querySelectorAll("li.bilibili-player-video-btn-speed-menu-list");
        if(speeds.length != 0){
            clearInterval(timer);
            speeds[3].click();
            init();
            registerVideoChangeHandler();
        }
    },200)
    let speedLabelSetter = ()=>{
        speeds[0].dataset.value = speed;
        speeds[0].innerText = speed + 'x(自定义)';
    }
    const init = ()=>{
        speeds[0].addEventListener('click',(e)=>{
            if(!selected){
                selected = true;
                speedLabelSetter();
            }else{
                let input = prompt("播放速度：（请输入[0.1,10]之内的数字）");
                if(input == null){
                    e.stopPropagation();
                    return;
                }
                input = Number(input);
                if( isNaN(input) || input < 0.1 || input > 10 ){
                    alert("请输入[0.1,10]之内的数字，速度已置为1.0x");
                    speed = 1;
                }
                else{
                    speed = input;
                }
                speedLabelSetter();
            }
        },true);
        for(let i = 1; i < speeds.length; i++){
            speeds[i].addEventListener('click',()=>{
                selected = false;
            })
        }
        if(speed){
            speeds[0].innerText = speed + 'x(自定义)';
        }
        else{
            speeds[0].innerText = '自定义';
        }
    }
})();