import Framework7 from 'framework7/framework7.esm.bundle';
import $$ from 'dom7';
import firebase from 'firebase/app';
import app from "./F7App.js";
import 'firebase/database';
import 'firebase/auth';


var selectedImage="";
$$("#tab2").on("tab:show", () => {
    //put in firebase ref here
    const sUser = firebase.auth().currentUser.uid;
    firebase.database().ref("cruditems/" + sUser).on("value", (snapshot) =>{
        const oItems = snapshot.val();
        const aKeys = Object.keys(oItems);
        $$("#BooksList").html("");
        for(let n = 0; n < aKeys.length; n++){
            let sCard="";
            if(oItems[aKeys[n]]["datePurchased"]!=null)
            {
             sCard = `
            <div class="card fontbold">
                <strike>
                    <div float="left" class="card-content-padding column">Book Title: ${oItems[aKeys[n]]["title"]}</div><br>
                    <div float="left" class="card-content-padding column">Book Author: ${oItems[aKeys[n]]["author"]}</div><br>
                    <div float="left" class="card-content-padding column">Book Published On: ${oItems[aKeys[n]]["published"]}</div>
                </strike>
                <div float="left" class="card-content-padding"><img src="${oItems[aKeys[n]]["image"]}"></div>
                <div float="right">
                    <button id="bought_${aKeys[n]}" disabled class="column greycolor button button-active buttoncontent add">I bought this</button>
                    <button id="dontneed_${aKeys[n]}" class="column  buttoncontent  button button-active  delete">I don't need this</button>
                </div>
            </div>
            `
            }
            else
            { sCard = `
            <div class="card fontbold">
                <div float="left" class="card-content-padding column">Book Title: ${oItems[aKeys[n]]["title"]}</div><br>
                <div float="left" class="card-content-padding column">Book Author: ${oItems[aKeys[n]]["author"]}</div><br>
                <div float="left" class="card-content-padding column">Book Published On: ${oItems[aKeys[n]]["published"]}</div>
                <div float="left" class="card-content-padding"><img src="${oItems[aKeys[n]]["image"]}"></div>
                <div float="right">
                    <button id="bought_${aKeys[n]}" class="column button button-active buttoncontent add">I need this</button>
                    <button id="dontneed_${aKeys[n]}"  class="column button button-active buttoncontent delete">I don't need this</button>
                </div>
            </div>
            `
        }
            
            $$("#BooksList").append(sCard);
        }
    });
});

/*$$("#image").on("change",function(event){
    selectedImage=event.target.files[0];
});*/

$$(".my-sheet").on("submit", e => {
    //submitting a new note
    const oData = app.form.convertToData("#addItem");
    const sUser = firebase.auth().currentUser.uid;
    const sId = new Date().toISOString().replace(".", "_");
    firebase.database().ref("cruditems/" + sUser + "/" + sId).set(oData);
    app.sheet.close(".my-sheet", true);
});


function hasClass(elem,className){
    return elem.classList.contains(className);
}

document.getElementById("BooksList").addEventListener("click",(evt)=>{

    if(hasClass(evt.target,"add")){
        const sUser = firebase.auth().currentUser.uid;
        var CurrentDate=new Date();
        var datePurchased=CurrentDate.getDate()+"-"+(CurrentDate.getMonth()+1)+"-"+CurrentDate.getFullYear();
        firebase.database().ref("cruditems//"+sUser+"/"+evt.target.id.replace("bought_","")).update({datePurchased:datePurchased});
        document.getElementById(evt.target.id).value = "I bought this";
        document.getElementById(evt.target.id).disabled = true;
    }
    else if(hasClass(evt.target,"delete")){
        const sUser = firebase.auth().currentUser.uid;
        firebase.database().ref("cruditems//"+sUser+"/"+evt.target.id.replace("dontneed_","")).remove();
    }
});