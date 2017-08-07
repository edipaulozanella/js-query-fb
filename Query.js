var host = "";
var token_api = "";
import Model from "./Model";
import * as firebase from "firebase";
// import "firebase/auth";
// import "firebase/database";
// import "firebase/storage";

// var app = firebase.initializeApp({
//   apiKey: "AIzaSyDmvQO1OAO03h0j4ht0bHDsOBamERvsw0A",
//   authDomain: "appsistema-4d41b.firebaseapp.com",
//   databaseURL: "https://appsistema-4d41b.firebaseio.com",
//   projectId: "appsistema-4d41b",
//   storageBucket: "appsistema-4d41b.appspot.com",
//   messagingSenderId: "336950758071"
// });

// firebase.database();
// firebase.storage();

function Query(entidade) {
  this.entidade = entidade ? entidade : "dados";
  this.where = {};
  this.limit = 1000;
  this.ordem = {};
  this.whereServer = null;
  this.list = [];
  Query.prototype.whereEqualTo = function(key, value) {
    if (key) {
      this.whereKey = key;
      this.whereValue = value;
    }
  };

  Query.prototype.setLimit = function(key) {
    this.limit = key;
  };

  Query.prototype.sinc = function(retorno) {
    this.list = [];
    // console.log(this);
    var ref = firebase.database().ref(this.entidade);
    if (this.whereKey) {
      // var tags = Object.keys(this.where);
      // for (var i = 0; i < tags.length; i++) {
      //   var tag = tags[i];
      // }
      ref = ref.orderByChild(this.whereKey).equalTo(this.whereValue);
    }

    ref = ref.limitToLast(this.limit);

    ref.on("child_added", snapshot => {
      // console.log(snapshot);
      var obj = snapshot.val();
      obj.objectId = snapshot.key;
      this.list.push(new Model(this.entidade).parse(obj));
      retorno(this.list);
    });
    // .then(()=>{
    //   alert("Ok")
    // })
    setTimeout(() => {
      retorno(this.list);
    }, 1000);

    ref.once("value").then(dataSnapshot => {
      if (!dataSnapshot.hasChildren()) {
        retorno(this.list);
      }
      // console.log(dataSnapshot);
      // console.log(dataSnapshot.val());
      // console.log(dataSnapshot.hasChildren());
      // dataSnapshot.forEach(childSnapshot => {
      //   var obj = childSnapshot.val();
      //   obj.objectId = childSnapshot.key;
      //   // console.log(obj)
      //   this.list.push(obj);
      // });
      // retorno(this.list);
    });
    // ref.once("value").then(dataSnapshot => {
    //   // console.log(dataSnapshot);
    //   // console.log(dataSnapshot.val());
    //   // console.log(dataSnapshot.hasChildren());
    //   dataSnapshot.forEach(childSnapshot => {
    //     var obj = childSnapshot.val();
    //     obj.objectId = childSnapshot.key;
    //     // console.log(obj)
    //     this.list.push(obj);
    //   });
    //   retorno(this.list);
    // });
  };

  Query.prototype.select = function(retorno, direto) {
    this.sinc(retorno);
  };
  Query.prototype.cloud = function(retorno, direto) {
    this.sinc(retorno);
  };
  Query.prototype.first = function(retorno, direto) {
    var ref = firebase.database().ref(this.entidade);
    if (this.whereKey) {
      ref = ref.orderByChild(this.whereKey).equalTo(this.whereValue);
    }
    ref = ref.limitToLast(this.limit);
    ref.on("value", snapshot => {
      // console.log("value")
      // console.log(snapshot)
      var obj = snapshot.val();
      obj.objectId = snapshot.key;
      retorno(new Model(this.entidade).parse(obj));
    });

    ref.once("value").then(dataSnapshot => {
      // console.log(dataSnapshot)
      if (!dataSnapshot.hasChildren()) {
        // console.log("va 2")
        retorno(null);
      }
    });
  };
  Query.prototype.firstCloud = function(retorno, direto) {
    this.first(retorno, direto);
  };
}

Query.setToken = function(token) {
  token_api = token;
};
Query.setHost = function(url) {
  host = url;
};

module.exports = Query;
