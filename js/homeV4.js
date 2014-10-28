/* JS */
var menuCreationSize=0;
var xmlfolder="./xml/";
var endpointInfo="../Aplicacoes/";
var pageVersion="v1.0.0";

String.prototype.stripHTML = function() {return this.replace(/<.*?>/g, '').replace(/&nbsp;/g,'')}

$(".voltarTopo").hide();
$("#online").hide();
$("#offline").hide();

$(window).resize(function () {
	var h = Math.max($(window).height() - 0, 420);
	$('#frameMain').height(h).filter('.default').css('lineHeight', h + 'px');
	if($(window).width() >= 1000){
		$(".sidebar .sidebar-inner").slideDown(350);
		$("#menu").fadeIn("fast");
	}else{
		$(".sidebar .sidebar-inner").slideUp(350);
		$("#menu").fadeOut("fast" );		
	}
}).resize();

$('#toggle').on('click', function () {
	$("#menu").fadeToggle("fast" );
});

//Serviços para requisição Online
$(document).ready(function(){
	$.ajax({
		url: xmlfolder+"sabrowser.xml",
	   dataType: "xml",
	   success: function(xml){
		//List Creation Code Starts		
		var htmlCode = " ";
		var id = "";
		
		$(xml).find('folder').each(function(index){
			//if ((index == '0') || (index == '10')) continue;			
			var sName = $(this).attr('name');			
			var sLink = $(this).find('link').attr('url');			
			id = "lista"+index;
			htmlCode = htmlCode + "<li data-jstree='{\"icon\":\"folder\"}'>"+sName;
			htmlCode = htmlCode + "<ul id=\""+id+"\"></ul>";
			//criaMenu(sLink);
			htmlCode = htmlCode + "</li>";
			menuCreationSize++;
		});		
		$('#root').append(htmlCode);
				
		var listNumber=0;
		criaMenuItem("definition_aplicacao.xml", listNumber++);
		criaRelatorios(listNumber++);
		//criaMenuItem("other_na.xml");
		criaMenuItem("diagram_modelos_de_referencia.xml",listNumber++);
		criaMenuItem("definition_pessoa.xml",listNumber++);
		criaMenuItem("definition_modulo.xml",listNumber++);
		criaMenuItem("definition_tam_area.xml",listNumber++);
		criaMenuItem("definition_trm_service_category.xml",listNumber++);
		criaMenuItem("definition_trm_service_standard.xml",listNumber++);
		criaMenuItem("definition_tam_area.xml",listNumber++);
	},
	   error: function(xhr, ajaxOptions, thrownError) {
	      alert("Ocorreu um erro ao abrir o portal.Tente novamente");
	      alert(thrownError);
	}
	});	
});
//List Creation Code Ends

//$("#frameMain").height = $("#frameMain").contentWindow.document.body.scrollHeight + 'px';

function executaServico(pagina) {
	mostrapainel();
	$.ajax({
	   url: endpointInfo+pagina,
	   dataType: "text",
	   success: function(xml){
		//List Creation Code Starts		
				
		$('.panel-heading').html($(xml).find('h1#pageTitle').text());
		
		var htmlCode = "<thead><tr><th>Atributo</th><th>Valor</th></tr></thead>";
		htmlCode += "<tbody>";		
		$(xml).find('span.PropName').each(function(index){
			htmlCode += "<tr><td>";
			htmlCode += $(this).text();
			htmlCode += "</td><td>";
			htmlCode += $(xml).find('span.PropValue').get(index).innerHTML;
			htmlCode += "</td></tr>";
		});
		htmlCode += "</tbody>";
		$('#frameMain').html(htmlCode);
		$('tr').filter(function() {
			return $.trim($(this).text()) === '' && $(this).children().length == 0
		}).remove()
		$('.panel-footer').html($(xml).find("td:contains('Type -')" ).get());
	   },
	   error: function(xhr, ajaxOptions, thrownError) {
			alert("Ocorreu um erro ao abrir o portal.Tente novamente");      
	   }
	});
};

function executaRelatorio(pagina) {
	mostrapainel();
	$.ajax({
	   url: endpointInfo+pagina,
	   dataType: "text",
	   success: function(xml){
		//List Creation Code Starts		
		
		$('.panel-heading').html($(xml).find('h1#pageTitle').text());
		
		//var htmlCode = "<thead>"+$(xml).find('h1#pageTitle').text()+"</thead>";		
		var htmlCode = $(xml).find('#maindata').get(0).innerHTML;
		htmlCode += $(xml).find("h3:contains('Count:')" ).get(0).innerHTML;		
		$('#frameMain').html(htmlCode);
		$('tr').filter(function() {
				return $.trim($(this).text()) === '' && $(this).children().length == 0
			}).remove()
		$('.panel-footer').html($(xml).find("h3:contains('Count:')" ).get());
		
	   },
	   error: function(xhr, ajaxOptions, thrownError) {
		   alert("Ocorreu um erro ao abrir o portal.Tente novamente");      
	   }
	});
};

function criaMenuItem(link,listNumber) {
	$.ajax({
	   url: xmlfolder+link,
	   dataType: "xml",
	   success: function(xml){
		//List Creation Code Starts
		var htmlCode = " ";
		$(xml).find('folder').each(function(index){
			var sName = $(this).attr('name');
			var sLink = $(this).find('link').attr('url');
			htmlCode = htmlCode + "<li data-jstree='{\"icon\":\"file\"}'><a href='#' onClick=\"executaServico('"+sLink+"')\">"+sName+"</a></li>";
			//htmlCode = htmlCode + "<li data-jstree='{\"icon\":\"file\"}'><a href=\"#\" onclick=\"load_home('../"+sLink+"')\">"+sName+"</a></li>";
			 
		});
		$('ul#lista'+listNumber).append(htmlCode);		
		
		menuItemCriado();
	   },
	   error: function(xhr, ajaxOptions, thrownError) {
		   alert("Ocorreu um erro ao abrir o portal.Tente novamente");      
	   }
	});
}
function criaRelatorios(listNumber) {
	$.ajax({
	   url: xmlfolder+"other_na.xml",
	   dataType: "xml",
	   success: function(xml){
		//List Creation Code Starts
		var htmlCode = " ";			
		$(xml).find('leaf').each(function(index){			
			var sName = $(this).attr('name');
			var sLink = $(this).find('link').attr('url');
			htmlCode = htmlCode + "<li data-jstree='{\"icon\":\"file file-pdf\"}'><a href='#' onClick=\"executaRelatorio('"+sLink+"')\">"+sName+"</a></li>";
			//htmlCode = htmlCode  + "<li data-jstree='{\"icon\":\"file file-xls\"}'><a href='../"+sLink+"' target=\"frameMain\">"+sName+"</a></li>";			
		});		
		$('ul#lista'+listNumber).append(htmlCode);
		menuItemCriado();				
	   },
	   error: function(xhr, ajaxOptions, thrownError) {
		   alert("Ocorreu um erro ao abrir o portal.Tente novamente");      
	   }
	});
};

function menuItemCriado() {
	menuCreationSize--;
	if (!menuCreationSize) criaMenu();	
};
function criaMenu() {
	// create the menu instance
	$("#jstree_menu").jstree(
		{
		  "core" : {
			'themes' : {
				'responsive' : false,
				'variant' : 'small'
			}
		  },		  
		  "state" : { 	"key" : "menuCatalogo",
				"ttl" : "86400000"},
		  "search" : { "show_only_matches" : true },			 
		  "plugins" : [ "search", "state", "html_data", "ui", "themes"]
		  
		}
	).bind("select_node.jstree", function (e, data) {
	    var href = data.instance.get_node(data.node, true).children('a').attr('href');
	    // this will load content into a div:
	    //$("#frameMain").src = href;
	    if (href !== '#')  document.getElementById('frameMain').src = href;
	    else document.getElementById('frameMain').src = "";
	    document.getElementById("jstree_menu").style.visibility = "visible";
	    // this will follow the link:
	});	
};

$(function () {
  var to = false;
  $('#searchq').keyup(function () {
    if(to) { clearTimeout(to);}
    to = setTimeout(function () {
      var v = $('#searchq').val();
      $('#jstree_menu').jstree(true).search(v);
    }, 250);
  }); 
});

$(function () {
  var to = false;
  $('#searchq').on("mouseup", function() {
    if(to) { clearTimeout(to);}
    to = setTimeout(function () {
      var v = $('#searchq').val();
      $('#jstree_menu').jstree(true).search(v);
    }, 250);
  });
});

function load_home(text){
    document.getElementById("event_result").innerHTML='<object type="text/html" data="'+text+'" ></object>';
}

//Tratamento do rolamento da página
$(function () {	
	$(window).scroll(function () {
		if ($(this).scrollTop() > 300) {
			$('.voltarTopo').fadeIn();
		} else {
			$('.voltarTopo').fadeOut();
		}
	});
	$('.voltarTopo').click(function() {
		$('body,html').animate({scrollTop:0},600);
	}); 

});

//Tratamento de gração de PDFs
function geraPDF(){
	
	//PDF OBJECT creation and configuration
	var table = tableToJson($('#frameMain').get(0));
	var doc = new jsPDF('l', 'pt', 'a4', true);	
	doc.setProperties({
		title: 'PDF exporter',
		subject: '',		
		author: 'Arquitetura de TI',
		keywords: 'generated, arquitetura, catálogo de aplicações',
		creator: 'Portal de Arquitetura'
	});
	doc.cellInitialize();
	doc.setFontSize(20);
	
	var rowSize = $("table > tbody").find("> tr:eq(2) > td").length;	
	var rowWidth = $("tr:eq(0)").width();
	var columnWidth = rowWidth/rowSize;
	var columnHeight= $("tr:eq(0)").height();
	
	//PDF BODY HEADER definition
	var headerText = $('#hdr').get(0).innerHTML.stripHTML();
	doc.cell(55, 0,rowWidth, 40, headerText, 1);
	 //" Export " + $('#ftr').get(0).innerHTML.stripHTML() +" "+
	
	//PDF BODY TABLE defininition
	$.each(table, function (i, row){
	    doc.setFontSize(10);
	    $.each(row, function (j, cell){
		doc.cell(55, 80,columnWidth, columnHeight, cell, i);
		//if(j=='atributo')
		//doc.cell(10, 80,180, 20, cell, i);
		//else if(j=='valor')
		    //doc.cell(10, 80, 390, 20, cell, i); 
	  })
	})
	doc.output('dataurl');
};

function tableToJson(table) {
    var data = [];
    // first row needs to be headers
    var headers = [];
    for (var i=0; i<table.rows[0].cells.length; i++) {
        headers[i] = i;
    }
    // go through cells
    for (var i=0; i<table.rows.length; i++) {
        var tableRow = table.rows[i];	
        var rowData = {};
        for (var j=0; j<tableRow.cells.length; j++) {		
            rowData[ headers[j] ] = tableRow.cells[j].innerHTML.stripHTML();	    
        }
        data.push(rowData);
    }       
    return data;
};
//Fim de métodos de controle de PDF

//Validação de Status da aplicação
//	Status da Conexão - Online/Offine 
//	Status da Aplicação - Online/Offine
$(document).ready(function() {
	$(function () {
		verificastatus();
		statusBox = document.getElementById('status');  
		statusBox.className = status;  
		statusBox.innerHTML = text;
		document.getElementById('version').innerHTML = pageVersion;
	});
});

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
	if(window.navigator.onLine){  
		status = "label label-success";
		text="Online"
		return true;
	}
	
	status = "label label-warning";
	text="Offline"	
	return false;
}



function saveDataState() {    
    return true;
}

function resumeOffline() {
    if (!supportsLocalStorage()) { return false; }
    gGameInProgress = (localStorage["catalogo.arquitetura.in.progress"] == "true");
    if (!gCatalogoInProgress) { return false; }
    gPieces = new Array(kNumPieces);
    for (var i = 0; i < kNumPieces; i++) {
	var row = parseInt(localStorage["catalogo.piece." + i + ".row"]);
	var column = parseInt(localStorage["catalogo.piece." + i + ".column"]);
	gPieces[i] = new Cell(row, column);
    }
    gNumPieces = kNumPieces;
    gSelectedPieceIndex = parseInt(localStorage["catalogo.selectedpiece"]);    
    gMoveCount = parseInt(localStorage["catalogo.count"]);
    fillWindow();
    return true;
}

function InstalaAplicacaoOffline(pagina) {	
	$.ajax({
	   url: endpointInfo+pagina,
	   dataType: "text",
	   success: function(xml){
		//List Creation Code Starts		
		$(xml).each(function(index){
			var data = $.csv.toArray($(xml).get(index));
			if(typeof(data[0]) === 'undefined') {
			      return null;
			}
			if (index==1){
				if(data[0].constructor === String) {			      
				        var create = "";
				      	for(var item in data) {
						create += data[item]+",";
					}
					openDatabase('documents', '1.0', 'Local document storage', 5*1024*1024, function (db) {
					  db.changeVersion('', '1.0', function (t) {
					    t.executeSql('CREATE TABLE docids ('+ create +')');
					  }, error);
					});			
				}
			}			
		});		
	},
	   error: function(xhr, ajaxOptions, thrownError) {
	      alert("Ocorreu um erro ao abrir o portal.Tente novamente");      
	}
	});
};
