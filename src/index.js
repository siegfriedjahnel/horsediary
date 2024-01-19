if (navigator.serviceWorker) {
  // Register the SW
  navigator.serviceWorker.register('/firebase-messaging-sw.js').then(function(registration){
  }).catch(console.log);
}


const btnNotify = document.getElementById("notify");
const btnLogin = document.getElementById("login");
const btnMenu = document.getElementById("btnMenu");
const dvCalendar = document.getElementById("dvCalendar");
const dvAppBody = document.getElementById("appBody");
const infoBox = document.getElementById("infoBox");
let entries = [];
const users = ['Sigi','Heike','Verena','Nina','Mia'];
let selectedHorse = "Blondie";
document.getElementById("blondie").classList.add("blueBorder");
let entries_filtered = [];
//-----------------------------------------------
weekdays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const today = new Date();
const apiUrl = "https://sj-sam.de/apps/horsediary/api.php";
//---------------------------------------------
if (localStorage.user) {
  btnLogin.innerHTML = "<img src='assets/logout-24.png'>";
} else {
  btnLogin.innerHTML = "<img src='assets/face-24.png'>";
}

if (localStorage.isSubscribed) {
  btnNotify.innerHTML = "<img src='assets/notif-off-24.png'>";
} else {
  console.log(localStorage.isSubscribed);
  btnNotify.innerHTML = "<img src='assets/notify-24.png'>";
}


//-------------------------------------------------------------------------------
btnMenu.addEventListener("click", (e) => {
  toggleMenu();
});
//-------------------------------------------------------------------------------

btnNotify.addEventListener("click", (e) => {
  if(!localStorage.tokenSaved){//no token yet
    if(confirm("willst du Push-Nachrichten über neue Einträge erhalten? ")){

      //show notification popup 
      if(Notification.permission === 'granted') {
      } else if(Notification.permission !== 'denied') {
        Notification.requestPermission(permission => {
          if(permission === 'granted') {
            console.log(permission);
          }
        })
      }
      messaging.getToken({ vapidKey: 'BKbiASBPlVaLh1_OFeonF7yOcRpmEaIOyAH1cFRVvqGCAcYhkDQJ_lNr2B4w2J4Yp5baLUUJp0gv98TWRkoOeBo' }).then((currentToken) => {
        if (currentToken) {
          // Send the token to your server and update the UI if necessary
          const response = fetch(`https://sj-sam.de/apps/horsediary/api.php?action=saveToken&user=Sigi&topic=horsediary&isSubscribed=1&token=${currentToken}`).then((res)=>{
            if(res){
              localStorage.token = currentToken;
              localStorage.tokenSaved = true;
              localStorage.isSubscribed = true;
              //update UI
              btnNotify.innerHTML = "<img src='assets/notif-off-24.png'>";
            }
          });
          console.log(currentToken);
          return currentToken;
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
          // ...
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
      });
    }else{
      return;
    }
     

  }else{//token is saved switch isSubsribed
    if(localStorage.isSubscribed){
      if(confirm("du wirst keine Benachrichtigungen mehr erhalten")){
        const token = localStorage.token;
        fetch(`https://sj-sam.de/apps/horsediary/api.php?action=updateSubscription&isSubscribed=0&token=${token}`).then((res)=>{
          if(res){
            localStorage.removeItem("isSubscribed");
            btnNotify.innerHTML = "<img src='assets/notify-24.png'>";
          }
        });
      }else{
        return;
      }
    }else{
      if(confirm("du wirst wieder Benachrichtigungen mehr erhalten")){
        const token = localStorage.token;
        fetch(`https://sj-sam.de/apps/horsediary/api.php?action=updateSubscription&isSubscribed=1&token=${token}`).then((res)=>{
          if(res){
            localStorage.isSubscribed = true;
            btnNotify.innerHTML = "<img src='assets/notif-off-24.png'>";
          }
        });
      }else{
        return;
      }

    }
  }
  //if not localStorage.token -> ask for permission and get token
  //then save token fetch('https://sj-sam.de/apps/horsediary/api.php?action=saveToken&user=Sigi&topic=horsediary&isSubscribed=1&token=wkwjwudzhbcezegdu')
  //then localStorage.token = token and localStorage.isSubscribede = 1
  //update UI showToast

  //if localStorage.token AND localStorage.isSubscribede = 1
  //then fetch('https://sj-sam.de/apps/horsediary/api.php?action=updateSubscription&isSubscribed=0&token=wkwjwudzhbcezegdu')
  //then localStorage.isSubscribed = 0 update UI showToast
  
  //if localStorage.token AND localStorage.isSubscribede = 0
  //then fetch('https://sj-sam.de/apps/horsediary/api.php?action=updateSubscription&isSubscribed=1&token=wkwjwudzhbcezegdu')
  //then localStorage.isSubscribed = 1 update UI showToast

})
function selectHorse(horse){
  selectedHorse = horse;
  if(selectedHorse == "Willy"){
    document.getElementById("willy").classList.add("blueBorder");
    document.getElementById("blondie").classList.remove("blueBorder");
  }
  if(selectedHorse == "Blondie"){
    document.getElementById("blondie").classList.add("blueBorder");
    document.getElementById("willy").classList.remove("blueBorder");
  }
  draw();
}


//-------------------------------------------------------------------------------
btnLogin.addEventListener("click", (e) => {
  if (!localStorage.user) {
    const user = prompt("Benutzername");
    //const pw = prompt("PIN");
    if (!users.includes(user)) {
      showToast("Diesen user gibt es nicht");
      return;
    } else {
      localStorage.user = user;
      showToast("Du bist jetzt angemeldet");
      //alert("du bist eingeloggt");
      btnLogin.innerHTML = "<img src='assets/logout-24.png'>";
      draw();
    }
  } else {
    if (confirm("Achtung! Du wirst abgemeldet")) {
      localStorage.removeItem("user");
      btnLogin.innerHTML = "<img src='assets/face-24.png'>";
      showToast("Du bist jetzt angemeldet");
      //dvCalendar.innerHTML = "";
      draw();
    }
  }
});

//--------------------------------------------------------------------------------
getData().then(() => {
  draw();
});
//-----------------------------------------------------------------------------
function draw() {
  dvCalendar.innerHTML = "";
  infoBox.innerHTML = "";
  if(!localStorage.user){
    console.log("kein user");
    infoBox.innerHTML = `Du musst dich anmelden um daten zu sehen. Clicke auf das Gesicht  <img src="assets/face-24.png" >`;
    return;
  }
  entries_filtered = entries.filter((entry) => entry.horse == selectedHorse);
  //console.log(entries_filtered);
  const daynames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  // const dvCalendar = document.getElementById("dvCalendar");
  const jetzt = new Date();
  for (let i = -10; i < 12; i++) {
    const datum = new Date();
    datum.setDate(datum.getDate() + i);
    const dd = datum.toISOString().split("T")[0]; //yyyy-mm-dd
    const daynumber = datum.getDay();
    const de = datum.toLocaleDateString("de-DE"); //d.m.yyyy
    const ddd = de.slice(0, de.length - 4) + de.slice(de.length - 2, de.length); //d.m.yy
    const dayname = daynames[daynumber];
    let text = "";
    //console.log(dd);
    if (entries_filtered.find((entry) => entry.day == dd)) {
      const e = entries_filtered.find((entry) => entry.day == dd);
      text = e.user + ": " + e.text;
    }
    const dv = document.createElement("div");
    dv.classList.add("card");
    dv.id = i;
    if(i==0) dv.classList.add("blueBorder");
    dv.innerHTML = `<div class="c1"><b>${dayname}</b><br>${ddd}</div>
  <div class = "c2">${text}</div>
  <div class = "c3" onClick = "edit('${dd}')"><img src='assets/edit-24.png'></div>`;
    dvCalendar.appendChild(dv);
  }
  const idf = document.getElementById("-6");
 
  idf.scrollIntoView();
}

//-----------------------------------
async function getData() {
  const url = "https://sj-sam.de/apps/horsediary/api.php?action=getAllEntries";
  const res = await fetch(url);
  const data = await res.json();
  entries = data;
}

//--------------------------------
async function edit(day) {
  let action = "";
  let newText = "";
  let oldText = "";
  const e = entries_filtered.find((entry) => entry.day == day);
  

  //----------------------------------------------
  if(e){//-----------------there is an entry----------
    action = "updateEntry";
    oldText = e.text;
    newText = prompt("neuer Eintrag", oldText);
  }else{//-------------no entry ------------
    action = "insertEntry";
    newText = prompt("neuer Eintrag");
  }
  //-----------------------------------------------

  if (newText != null && newText != oldText) {//-------------------send request only if something has canged
    const url = apiUrl + encodeURI("?action="+action+"&day=" + day + "&horse=" + selectedHorse +"&user=" + localStorage.user + "&text=" + newText );
    console.log("call  api", url);
    const response = await fetch(url);
    console.log("response",response.statusText);
    if (response.statusText == "OK") {
      getData().then(() => {
        draw();
      });
      showToast("Daten gespeichert");
    }else{
      showToast("Fehler beim speichern");
    }
  }
  
}
//-----------------
function showToast(text) {
  let t = document.getElementById("toast");
  t.innerHTML = text;
  t.className = "show";
  setTimeout(function () {
    t.className = "";
  }, 3000);
}
//----------------------------------------
function toggleMenu() {
  let m = document.getElementById("menu");
  if (m.className == "") {
    m.className = "show";
  } else {
    m.className = "";
  }
}
//-------------------------------------------

async function subscribe(){
  confirm();
  const token = "wertfku87gbvvfhk04jjz";
  localStorage.token = token;
  localStorage.isSubscribede = 1;
  //return token;
}
