//工具类

function isMobile(){
    return navigator.userAgent.toLowerCase().indexOf("mobile") !== -1 || navigator.userAgent.toLowerCase().indexOf("android") !== -1  || navigator.userAgent.toLowerCase().indexOf("pad") !== -1;
}