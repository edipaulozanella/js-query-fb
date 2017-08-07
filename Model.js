var host = "";
var token_api = "";
import * as firebase from "firebase";

// export default class Model {
// constructor(app) {

function Model(ent) {
  this.entidade = "dados";
  if (ent) {
    this.entidade = ent;
  }
  this.status = 1;

  Model.prototype.save = function(callback) {
    if (!this.status) {
      this.status = 1;
    }
    var caminho = this.entidade;
    var key = null;
    if (this.objectId) {
      key = this.objectId;
    } else {
      key = firebase.database().ref().child(caminho).push().key;
    }
    this.objectId = key;
    // console.log(caminho)
    // console.log(this)
    var temp = JSON.parse(JSON.stringify(this));
    delete temp.entidade;
    firebase.database().ref(caminho + "/" + key).update(temp).then(() => {
      // alert("Ok")
      if (callback) {
        callback();
      }
    });
  };
  Model.prototype.update = function(data, callback) {
    if (data) {
      var caminho = this.entidade;
      var key = this.getKey();
      this.objectId = key;
      var temp = JSON.parse(JSON.stringify(data));
      firebase.database().ref(caminho + "/" + key).update(temp).then(() => {
        // alert("Ok")
        if (callback) {
          callback();
        }
      });
    }
  };
  Model.prototype.getKey = function() {
    var caminho = this.entidade;
    var key = null;
    if (this.objectId) {
      key = this.objectId;
    } else {
      key = firebase.database().ref().child(caminho).push().key;
    }
    return key;
  };
  Model.prototype.setPath = function(caminho) {
    this.path = caminho;
  };

  Model.prototype.parse = function(obj) {
    if (!obj) {
      return this;
    }

    var lista = Object.keys(obj);
    for (var i = 0; i < lista.length; i++) {
      var nome = lista[i];
      this[nome] = obj[nome];
    }

    return this;
  };
}

Model.setHost = function(url) {
  host = url;
};
Model.setToken = function(token) {
  token_api = token;
};

module.exports = Model;
