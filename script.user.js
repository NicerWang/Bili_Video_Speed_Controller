// ==UserScript==
// @name         BiliBili视频速度控制
// @namespace    https://github.com/NicerWang
// @version      0.2
// @description  自定义Bilibili视频播放速度（仅新版播放器）
// @author       NicerWang
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// ==/UserScript==

(function() {
    'use strict';
    let speeds;
    let speed = 2;
    let selected = false;
    // 分P切换检测函数
    async function registerVideoChangeHandler() {
        const observer = new MutationObserver(e => {
            if (e[0].target.src) {
                speeds = document.querySelectorAll("li.bilibili-player-video-btn-speed-menu-list");
                init();
            }
        });
        observer.observe(document.querySelector('.bilibili-player-video video'), {attributes:true});
    }
    // 初始化
    let timer = setInterval(()=>{
        speeds = document.querySelectorAll("li.bilibili-player-video-btn-speed-menu-list");
        if(speeds.length != 0){
            clearInterval(timer);
            // 默认恢复到1.0x
            speeds[3].click();
            init();
            registerVideoChangeHandler();
        }
    },200)
    // 更改自定义速度的标签名称
    let speedLabelSetter = ()=>{
        speeds[0].dataset.value = speed;
        speeds[0].innerText = speed + 'x(自定义)';
    }
    const init = ()=>{
        speeds[0].addEventListener('click',(e)=>{
            if(!selected){
                // 如果没有被选中，则被正常选中
                selected = true;
                speedLabelSetter();
            }else{
                // 如果已经被选中，则弹出提示框
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
        // 切换其他速度时，取消选中状态
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