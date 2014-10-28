
const DB_NAME = 'catalogo-aplicacoes';
const DB_STORE_NAME = 'applications';
const PAGE_VERSION="v0.7.1";

var dbUpgraded = false;
var appschema = {
  stores:[{
    name:'application',
    keyPath:"id"
  }]
};
var options = {
	  Encryption: {
	    expiration: 1000*60*60*24, // expires in one day
	    secrets: [{
	      name: 'key1',
	      key: 'aYHF6vfuGHpfWSeRLrPQxZjS5c6HjCscqDqRtZaspJWSMGaW'
	    }]
	  },
	  mechanisms: ['localstorage', 'sessionstorage', 'userdata'],
	  size: 2 * 1024 * 1024, // 2 MB
	};	

var db = new ydn.db.Storage(DB_NAME, appschema);
var storage = new ydn.db.Storage(DB_NAME, options);

var deleteApplication = function(id) {
	db.remove(DB_STORE_NAME, id).fail(function(e) {
		throw e;
	});
	
	getAllTodoItems();
};

var toggleStatus = function () {
	var status = document.getElementById('turnon').innerHTML;
	if (status=="Online") status="Offline"; 
	else status="Online";
	document.getElementById('turnon').innerHTML=status;	
	
	storage.add(DB_STORE_NAME,  {stt: status}, 'id1').fail(function(e) {
		throw e;
	});
}

var updateDB = function () {
	/*xxxxxx
	while(){
		var data = {
			"text":application.value,
			"timeStamp":new Date().getTime()
		};
		db.put(DB_STORE_NAME, data).fail(function(e) {
			throw e;
		});  
	}*/
	getAllTodoItems();
}

var addApplication = function () {
	var application = document.getElementById("newapplication");	
	var data = {
		"text":application.value,
		"timeStamp":new Date().getTime()
	};
	db.put(DB_STORE_NAME, data).fail(function(e) {
		throw e;
	});  
	application.value = "";
	getAllTodoItems();
}
var getAllApplicationsItems = function(objectStore) {
	console.log("getAllApplicationsItems");
	
	verificastatus();
	
	var applicationItems = document.getElementById("applicationItems");
	
	applicationItems.innerHTML = "";
	
	var df = db.values(DB_STORE_NAME);
	
	df.done(function (items) {
		var n = items.length;
		for (var i = 0; i < n; i++) {
			renderApplications(items[i]);
		}
	});
	
	df.fail(function (e) {
		throw e;
	})
};

var renderApplications = function(row) {
	var application = document.getElementById("applicationItems");
	var li = document.createElement("li");
	var a = document.createElement("a");
	var t = document.createTextNode(row.text);
	
	a.addEventListener("click", function() {
		deleteApplication(row.id);
	}, false);
	
	a.textContent = " [Delete]";
	li.appendChild(t);
	li.appendChild(a);
	application.appendChild(li);
}

//Validação de Status da aplicação
//	Inicia Banco Local
//	Valida Status da Conexão - Online/Offine 
//	Valida Status da Aplicação - Online/Offine
function mostrapainel(){
	if(verificastatus()){
		$("#online").fadeIn();
		$("#offline").fadeOut();
	}else{	
		$("#offline").fadeIn();
		$("#online").fadeOut();
	}
};

function verificastatus(){
	console.log("verificastatus");
	document.getElementById('appVersion').innerHTML = PAGE_VERSION;	
	if(window.navigator.onLine){  
		document.getElementById('turnon').className = "btn btn-xs btn-success";
		document.getElementById('turnon').innerHTML="Online"
		return true;
	}else if(dbUpgraded){	
		document.getElementById('turnon').className = "btn btn-xs btn-warning";
		document.getElementById('turnon').innerHTML="Offline"	
		return false;
	}
	document.getElementById('turnon').className = "btn btn-xs btn-default";
	document.getElementById('turnon').innerHTML="Offline"	
	return false;
}

function init() {
	getAllApplicationsItems();
}
window.addEventListener("DOMContentLoaded", init, false);

