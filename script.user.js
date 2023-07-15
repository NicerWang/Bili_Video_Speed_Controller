// ==UserScript==
// @name         BiliBili视频速度控制
// @namespace    https://github.com/NicerWang
// @version      0.3
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
                speeds = document.querySelectorAll("li.bpx-player-ctrl-playbackrate-menu-item");
                init();
            }
        });
        observer.observe(document.querySelector('#bilibili-player video'), {attributes:true});
    }
    // 初始化
    let timer = setInterval(()=>{
        speeds = document.querySelectorAll("li.bpx-player-ctrl-playbackrate-menu-item");
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
        speeds[0].style.wordBreak = 'keep-all';
        speeds[0].style.overflow = 'hidden';
        speeds[0].style.textOverflow = 'ellipsis';
    }
    const init = ()=>{
        speeds[0].addEventListener('click',(e)=>{
            if(!selected){
                // 如果没有被选中，则被正常选中
                selected = true;
                speedLabelSetter();
            }else{
                // 如果已经被选中，则弹出提示框
                let input = prompt("播放速度：（请输入[0.25,4.00]之内的数字）");
                if(input == null){
                    e.stopPropagation();
                    return;
                }
                input = Number(input);
                if( isNaN(input) || input < 0.25 || input > 4 ){
                    alert("数字超出范围");
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