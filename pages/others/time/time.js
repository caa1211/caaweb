var time1 = new Date;

window.onload = function(){
    alert("秏時：" + (new Date - time1) + " 毫秒");
    time1 = new Date;
}
