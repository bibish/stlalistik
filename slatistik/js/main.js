(function () {
    $(".button-collapse").sideNav();
    let config = {
        apiKey: "AIzaSyCG2z670QWcYqfk-NLc0qPtkpWRqyxemH8",
        authDomain: "landing-1173e.firebaseapp.com",
        databaseURL: "https://landing-1173e.firebaseio.com",
        storageBucket: "landing-1173e.appspot.com",
        messagingSenderId: "609755608058"
    };
    firebase.initializeApp(config);
    const database = firebase.database()
    const provider = new firebase.auth.GoogleAuthProvider();


    let token ;
    let user ;
    let clicId = 0;

    //--------------------------------------
    //--------------------------------------
    //--------------- animation lolilol ----
    //--------------------------------------
    //--------------------------------------


    // on va le faire en css et l'ameliorer si on a le temps
if(document.querySelector('.home')) {

    let c1 = document.querySelector('.carte');
    let c2 = document.querySelector('.carte2');
    let c3 = document.querySelector('.carte3');

    c1.onmouseover = function () {
        document.getElementsByTagName('body')[0].style.background ="#1976d2";
    };

    $('html').on ('DOMMouseScroll', function (e) {
        let delta = e.originalEvent.detail;
        document.getElementsByTagName('body')[0].className = "lol";
    });
    $('html').on ('mousewheel', function (e) {
        let delta = e.originalEvent.wheelDelta;

        document.getElementsByTagName('body')[0].className = "lol";

    });

}


    //--------------------------------------
    //--------------------------------------
    //---------------connexion google-------
    //--------------------------------------
    //--------------------------------------
    if(document.getElementById('googleConnect')){
        document.getElementById('googleConnect').addEventListener("click", function(){
            firebase.auth().signInWithPopup(provider).then(function(result) {

                token = result.credential.accessToken;
                user = result.user;
                checkUser(user.uid);
                displayForm();
                //createUser(user.uid, user.displayName);


            }).catch(function(error) {
                // Handle Errors here.
                let errorCode = error.code;
                let errorMessage = error.message;
                // The email of the user's account used.
                let email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                let credential = error.credential;
                console.log(error);
                // ...
            });
        })
    };
    let checkUser = function () {

        firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
            let  data = snapshot.val();
            console.log(data);
            if (data == null){
                createUser(user.uid, user.displayName);

            }
            if(data.click != null){
                clicId =  data.click.length
            }


        });

    };

    let createUser = function(userId, name){
        firebase.database().ref('users/' + userId).set({
            username: name,

        });
    };
    //--------------------------------------
    //--------------------------------------
    //--------------- deconnexion google----
    //--------------------------------------
    //--------------------------------------

    if(document.querySelector('.deconnect-btn')){
        document.querySelector('.deconnect-btn').addEventListener('click',function () {
            firebase.auth().signOut().then(function() {
                // Sign-out successful.
            }, function(error) {
                // An error happened.
            });
            window.location.reload();
        });

    };






    //--------------------------------------
    //--------------------------------------
    //--------------- liste des stats ------
    //--------------------------------------
    //--------------------------------------

    let writeList = function () {


        firebase.database().ref('/users').once('value').then(function(snapshot) {
            let  data = snapshot.val();

            if (data == null){
                console.log('pas de stats')

            }
            if(data != null){

                for (let key in data) {
                    if (data.hasOwnProperty(key)) {
                        //ga.innerHTML = data[key].username;
                        if(data[key].click != null) {
                            let main = document.getElementsByTagName('main')[0];
                            let ga = document.createElement("ul");
                            ga.className = "collapsible";
                            ga.setAttribute("data-collapsible", "accordion");
                            main.appendChild(ga);

                            let gb = document.createElement('li');
                            ga.appendChild(gb);

                            let gc = document.createElement('div');
                            gc.className = "collapsible-header";
                            gc.innerHTML = data[key].username;
                            gb.appendChild(gc);

                            let blu = document.createElement('i');
                            blu.className ="material-icons";
                            blu.innerHTML ="assignment_ind";
                            gc.appendChild(blu);

                            let gcb = document.createElement('div');
                            gcb.className = "collapsible-body";
                            gb.appendChild(gcb);


                            let eachData = data[key].click;
                            eachData = eachData.length ;
                            for (let keydata in data[key].click){

                                if(data[key].click.hasOwnProperty(keydata)) {
                                    console.log(data[key].click[keydata].postData);
                                    let fuckthatshit = data[key].click[keydata].postData;
                                    let ga = document.createElement('span');
                                    ga.style.display="block";
                                    ga.style.margin = "10px 0";
                                    ga.innerHTML = fuckthatshit.text1 + " " + fuckthatshit.text2 + "% " + fuckthatshit.text3;
                                    gcb.appendChild(ga);
                                }
                            }






                            $('.collapsible').collapsible();
                        }

                    }
                }

      /*      <ul class="collapsible" data-collapsible="accordion">
                    <li>
                    <div class="collapsible-header"><i class="material-icons">filter_drama</i>First</div>
                    <div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
                </li>
                <li>
                <div class="collapsible-header"><i class="material-icons">place</i>Second</div>
                    <div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
                </li>
                <li>
                <div class="collapsible-header"><i class="material-icons">whatshot</i>Third</div>
                    <div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
                </li>
                </ul>
*/


            }


        });
    };
    if ( document.querySelector('.list_page')){

        writeList();
    };
    //--------------------------------------
    //--------------------------------------
    //--------------- partie stats ---------
    //--------------------------------------
    //--------------------------------------

    // affichage du formulaire a la connexion google
    let displayForm = function () {

        document.querySelector('.connect_container').style.display = "none";
        document.querySelector('.form_container').style.display ="block";
    };

    // affiche la stat et enleve le formulaire
    let writestats = function () {

        document.querySelector('.form_container').style.display ="none";
        document.querySelector('.resultat').style.display ="block";

        firebase.database().ref('/users/' + user.uid + '/click/').once('value').then(function(snapshot) {
            let  data = snapshot.val();
            let lastN = data.length -1;
            let lastData = data[lastN];
            console.log(lastData);

            document.querySelector('.stat_write').innerHTML = lastData.postData.text1 + " " +lastData.postData.text2 + "% " + lastData.postData.text3;
            document.getElementById('stat_fill').style.width = lastData.postData.text2 + "%";
            document.getElementById('stat_fill').innerHTML = lastData.postData.text2 + "%";




        });

    };

    // re creer une stat

    if (document.getElementById('again')){

        document.getElementById('again').addEventListener('click', function () {


            document.querySelector('.form_container').style.display ="block";
            document.querySelector('.resultat').style.display ="none";


        })
    }




    // recuperation des champs et push dans firebase
    if(document.getElementById('go_stat')) {
        document.getElementById('go_stat').addEventListener("click", function () {


            let input1 =document.getElementById('textarea1');

            let nInput =document.querySelector('.numberInput');

            let input3 =document.getElementById('textarea2');

            if (isNaN(nInput.value) == true || nInput.value < 0 || nInput.value > 100){

                return
            }



            let postData = {
                text1: input1.value,
                text2: nInput.value,
                text3: input3.value,
                date : JSON.stringify(new Date())
            };

            firebase.database().ref('users/' + user.uid + '/click/' + clicId).set({
                postData


            }).then(function () {
                clicId++;
            });

            writestats();



        });
    }

    if(document.querySelector('.home')) {
        let pis = 0;
        let newPis;
        let listcta = document.querySelector('.listLink');
        let propocta = document.querySelector('.propoLink');
        let statcta = document.querySelector('.statLink');
        let ctaclick;
        let cta;


        let ctaKpi = function () {

            firebase.database().ref('KPI/' + cta).set({
                click: ctaclick,

            })
        };
        listcta.addEventListener('click', function () {
            cta = "page liste";
            firebase.database().ref('KPI/' + cta).once('value').then(function (snapshot) {
                let data = snapshot.val();
                if (data == null) {
                    ctaclick = 0;
                } else {

                    ctaclick = parseInt(data.click);
                    ctaclick++;
                    console.log(pis)
                    console.log(newPis);

                }
                ctaKpi();

            });


        });

        statcta.addEventListener('click', function () {
            cta = "page creation";
            firebase.database().ref('KPI/' + cta).once('value').then(function (snapshot) {
                let data = snapshot.val();
                if (data == null) {
                    ctaclick = 0;
                } else {

                    ctaclick = parseInt(data.click);
                    ctaclick++;
                    console.log(pis)
                    console.log(newPis);

                }
                ctaKpi();

            });


        });

        propocta.addEventListener('click', function () {
            cta = "page a propos";
            firebase.database().ref('KPI/' + cta).once('value').then(function (snapshot) {
                let data = snapshot.val();
                if (data == null) {
                    ctaclick = 0;
                } else {

                    ctaclick = parseInt(data.click);
                    ctaclick++;
                    console.log(pis)
                    console.log(newPis);

                }
                ctaKpi();

            });


        });


        let impression = function () {
            firebase.database().ref('impression/' + "homepage").set({
                nombreImpression: newPis,

            })
        };

        firebase.database().ref('impression/' + "homepage").once('value').then(function (snapshot) {
            let data = snapshot.val();
            console.log(data.nombreImpression);
            pis = parseInt(data.nombreImpression);
            newPis = pis + 1;
            console.log(pis)
            console.log(newPis);
            impression();


        });




    }

    if (document.querySelector('.stats')) {
        let pis = 0;
        let newPis;


        let impression = function () {
            firebase.database().ref('impression/' + "page creation").set({
                nombreImpression: newPis,

            })
        };

        firebase.database().ref('impression/' + "page creation").once('value').then(function (snapshot) {
            let data = snapshot.val();
            if (data == null) {
                newPis = 0;
            } else {

                pis = parseInt(data.nombreImpression);
                newPis = pis + 1;
                console.log(pis)
                console.log(newPis);

            }
            impression();


        });
    }

    if (document.querySelector('.list_page')) {
        let pis = 0;
        let newPis;


        let impression = function () {
            firebase.database().ref('impression/' + "page liste").set({
                nombreImpression: newPis,

            })
        };

        firebase.database().ref('impression/' + "page liste").once('value').then(function (snapshot) {
            let data = snapshot.val();
            console.log(data);
            if (data == null) {
                newPis = 0;
            } else {

                pis = parseInt(data.nombreImpression);
                newPis = pis + 1;
                console.log(pis)
                console.log(newPis);

            }
            impression();


        });


    }

    //--------------------------------------
    //--------------------------------------
    //--------------- kpi  impression display  ---------
    //--------------------------------------
    //--------------------------------------

    if(document.querySelector('.home')){

        firebase.database().ref('impression/').once('value').then(function (snapshot) {
            let data = snapshot.val();
            console.log(data);



        });
        firebase.database().ref('KPI/').once('value').then(function (snapshot) {
            let data = snapshot.val();
            console.log(data);



        });


    }






})(jQuery);