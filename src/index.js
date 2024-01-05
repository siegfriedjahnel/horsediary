
const spNotifyOn = document.getElementById("notifyOn");
const spNotifyOff = document.getElementById("notifyOff");
const spLogin = document.getElementById("login");

spNotifyOn.addEventListener("click",()=>{
    spNotifyOn.style.display = "none";
    spNotifyOff.style.display = "inline";
})

spNotifyOff.addEventListener("click",()=>{
    spNotifyOn.style.display = "inline";
    spNotifyOff.style.display = "none";
})

function hideNotify(){
    spNotifyOn.style.display = "none";
    spNotifyOff.style.display = "block";
}