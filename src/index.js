const btnNotify = document.getElementById("notify");
const btnLogin = document.getElementById("login");
const btnMenu = document.getElementById("btnMenu");
const tblCalendar = document.getElementById("tblCalendar");
const dvCalendar = document.getElementById("dvCalendar");
const dvAppBody = document.getElementById("appBody");

let entries = [];
let selectedHorse = "Blondie";
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

if (localStorage.isSubsribed) {
  btnNotify.innerHTML = "<img src='assets/notify-off-24.png'>";
} else {
  btnNotify.innerHTML = "<img src='assets/notify-24.png'>";
}
//-------------------------------------------------------------------------------
btnMenu.addEventListener("click", (e) => {
  toggleMenu();
});
//-------------------------------------------------------------------------------

function selectHorse(horse){
  selectedHorse = horse;
  draw();
}


//-------------------------------------------------------------------------------
btnLogin.addEventListener("click", (e) => {
  if (!localStorage.user) {
    const user = prompt("Benutzername");
    const pw = prompt("PIN");
    if (user != pw) {
      return;
    } else {
      localStorage.user = user;
      showToast("Du bist jetzt angemeldet");
      //alert("du bist eingeloggt");
      btnLogin.innerHTML = "<img src='assets/logout-24.png'>";
    }
  } else {
    if (confirm("Achtung! Du wirst abgemeldet")) {
      localStorage.removeItem("user");
      btnLogin.innerHTML = "<img src='assets/face-24.png'>";
    }
  }
});

//--------------------------------------------------------------------------------
getData().then(() => {
  draw();
});
//-----------------------------------------------------------------------------
function draw() {

  entries_filtered = entries.filter((entry) => entry.horse == selectedHorse);
  console.log(entries_filtered);
  const daynames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const dvCalendar = document.getElementById("dvCalendar");
  dvCalendar.innerHTML = "";
  const jetzt = new Date();
  for (let i = -19; i < 12; i++) {
    const datum = new Date();
    datum.setDate(datum.getDate() + i);
    const dd = datum.toISOString().split("T")[0]; //yyyy-mm-dd
    const daynumber = datum.getDay();
    const de = datum.toLocaleDateString("de-DE"); //d.m.yyyy
    const ddd = de.slice(0, de.length - 4) + de.slice(de.length - 2, de.length); //d.m.yy
    const dayname = daynames[daynumber];
    let text = "";
    console.log(dd);
    if (entries_filtered.find((entry) => entry.day == dd)) {
      const e = entries_filtered.find((entry) => entry.day == dd);
      text = e.user + ": " + e.text;
    }
    const dv = document.createElement("div");
    dv.classList.add("card");
    dv.id = i;

    dv.innerHTML = `<div class="c1"><b>${dayname}</b><br>${ddd}</div>
  <div class = "c2">${text}</div>
  <div class = "c3" onClick = "edit('${dd}')"><img src='assets/edit-24.png'></div>`;
    dvCalendar.appendChild(dv);
  }
  const idf = document.getElementById("-4");
 
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
