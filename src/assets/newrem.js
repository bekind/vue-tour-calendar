//designWidth:设计稿的实际宽度值，需要根据实际设置
;(function (designWidth) {
    var uAgent = window.navigator.userAgent,
        tid;
    var isIOS = uAgent.match(/iphone/i);
    var wWidth = (screen.width > 0) ? (window.innerWidth >= screen.width || window.innerWidth == 0) ? screen.width :
        window.innerWidth : window.innerWidth,
        wDpr, wFsize;
    var wHeight = (screen.height > 0) ? (window.innerHeight >= screen.height || window.innerHeight == 0) ?
        screen.height : window.innerHeight : window.innerHeight;
    designWidth = designWidth || 750;
    if (window.devicePixelRatio) {
        wDpr = window.devicePixelRatio;
    } else {
        wDpr = isIOS ? wWidth > 818 ? 3 : wWidth > 480 ? 2 : 1 : 1;
    }
    if (isIOS) {
        wWidth = screen.width;
        wHeight = screen.height;
    }
    // 横屏
    if (wWidth > wHeight) {
        wWidth = wHeight;
    }
    refreshRem();
    function refreshRem() {
        var width = document.documentElement.getBoundingClientRect().width;
        if (wWidth && wWidth != width) {
            wWidth = width;
        }
        wFsize = wWidth * 100 / designWidth; //1rem
        // wFsize = Math.floor(wFsize);
        wFsize = wFsize > 32 ? wFsize : 32;
        document.getElementsByTagName('html')[0].dataset.dpr = wDpr;
        document.getElementsByTagName('html')[0].style.fontSize = wFsize + 'px';
    }

    window.addEventListener("resize", function () {
        clearTimeout(tid); //防止执行两次
        tid = setTimeout(refreshRem, 300);
    }, false);

    window.addEventListener("pageshow", function (e) {
        if (e.persisted) { // 浏览器后退的时候重新计算
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    if (document.readyState === "complete") {
        document.getElementsByTagName('html')[0].style.fontSize = wFsize;
    } else {
        document.addEventListener("DOMContentLoaded", function (e) {
            document.getElementsByTagName('html')[0].style.fontSize = wFsize;
        }, false);
    }
})(750);