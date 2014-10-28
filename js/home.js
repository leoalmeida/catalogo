/* JS */
/* Navigation */
var menuCreationSize=0;
$(document).ready(function(){  
  $(window).resize(function()
  {
    if($(window).width() >= 765){
      $(".sidebar .sidebar-inner").slideDown(350);
    }
    else{
      $(".sidebar .sidebar-inner").slideUp(350);
    }
  });
  
});

$(window).resize(function () {
	var h = Math.max($(window).height() - 0, 420);
	$('#frameMain').height(h).filter('.default').css('lineHeight', h + 'px');
}).resize();

$(document).ready(function(){
	$.ajax({
	   url: "./sabrowser.xml",
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
				
		criaAplicacoes();
		criaRelatorios();
		criaModelos();
		criaOrganograma();
		criaModulos();
		criaTamArea();
		criaTrmServCat();
		criaTrmServStd();
		criaUnidadeOrganizacional();
	},
	   error: function(xhr, ajaxOptions, thrownError) {
	      alert("Ocorreu um erro ao abrir o portal.Tente novamente");      
	}
	});	
});
//List Creation Code Ends

$('button').on('click', function () {
	$('#jstree').jstree(true).select_node('child_node_1');
	$('#jstree').jstree('select_node', 'child_node_1');
	$.jstree.reference('#jstree').select_node('child_node_1');
});

//$("#frameMain").height = $("#frameMain").contentWindow.document.body.scrollHeight + 'px';

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

function criaAplicacoes() {
	$.ajax({
	   url: "../definition_aplica\u00e7\u00e3o.xml",
	   dataType: "xml",
	   success: function(xml){
		//List Creation Code Starts
		var htmlCode = " ";			
		$(xml).find('folder').each(function(index){
			var sName = $(this).attr('name');
			var sLink = $(this).find('link').attr('url');
			htmlCode = htmlCode + "<li data-jstree='{\"icon\":\"file\"}'><a href='../"+sLink+"' target=\"frameMain\">"+sName+"</a></li>";
			//htmlCode = htmlCode + "<li data-jstree='{\"icon\":\"file\"}'><a href=\"#\" onclick=\"load_home('../"+sLink+"')\">"+sName+"</a></li>";
			 
		});
		$('ul#lista0').append(htmlCode);
		menuItemCriado();
	},
	   error: function(xhr, ajaxOptions, thrownError) {
	      alert("Ocorreu um erro ao abrir o portal.Tente novamente");      
	}
	});
};

function criaRelatorios() {
	$.ajax({
	   url: "../other_na.xml",
	   dataType: "xml",
	   success: function(xml){
		//List Creation Code Starts
		var htmlCode = " ";			
		$(xml).find('leaf').each(function(index){			
			var sName = $(this).attr('name');
			var sLink = $(this).find('link').attr('url');
			htmlCode = htmlCode + "<li data-jstree='{\"icon\":\"file file-xls\"}'><a href='../"+sLink+"' target=\"frameMain\">"+sName+"</a></li>";			
		});
		$('ul#lista1').append(htmlCode);
		menuItemCriado();
				
	},
	   error: function(xhr, ajaxOptions, thrownError) {
	      alert("Ocorreu um erro ao abrir o portal.Tente novamente");      
	}
	});
	
	
};

function criaModelos() {
	$.ajax({
	   url: "../diagram_modelos_de_refer\u00eancia.xml",
	   dataType: "xml",
	   success: function(xml){
		//List Creation Code Starts
		var htmlCode = " ";			
		$(xml).find('folder').each(function(index){
			var sName = $(this).attr('name');
			var sLink = $(this).find('link').attr('url');
			htmlCode = htmlCode + "<li data-jstree='{\"icon\":\"file\"}'><a href='../"+sLink+"' target=\"frameMain\">"+sName+"</a></li>";			
		});
		$('ul#lista2').append(htmlCode);
		menuItemCriado();
	},
	   error: function(xhr, ajaxOptions, thrownError) {
	      alert("Ocorreu um erro ao abrir o portal.Tente novamente");      
	}
	});
};

function criaOrganograma() {
	$.ajax({
	   url: "../definition_pessoa.xml",
	   dataType: "xml",
	   success: function(xml){
		//List Creation Code Starts
		var htmlCode = " ";			
		$(xml).find('folder').each(function(index){
			var sName = $(this).attr('name');
			var sLink = $(this).find('link').attr('url');
			htmlCode = htmlCode + "<li data-jstree='{\"icon\":\"file\"}'><a href='../"+sLink+"' target=\"frameMain\">"+sName+"</a></li>";			
		});
		$('ul#lista3').append(htmlCode);
		menuItemCriado();
				
	},
	   error: function(xhr, ajaxOptions, thrownError) {
	      alert("Ocorreu um erro ao abrir o portal.Tente novamente");      
	}
	});	
	
};

function criaModulos() {
	$.ajax({
	   url: "../definition_m\u00f3dulo.xml",
	   dataType: "xml",
	   success: function(xml){
		//List Creation Code Starts
		var htmlCode = " ";			
		$(xml).find('folder').each(function(index){
			var sName = $(this).attr('name');
			var sLink = $(this).find('link').attr('url');
			htmlCode = htmlCode + "<li data-jstree='{\"icon\":\"file\"}'><a href='../"+sLink+"' target=\"frameMain\">"+sName+"</a></li>";			
		});		
		$('ul#lista4').append(htmlCode);
		menuItemCriado();
				
	},
	   error: function(xhr, ajaxOptions, thrownError) {
	      alert("Ocorreu um erro ao abrir o portal.Tente novamente");      
	}
	});
};

function criaTamArea() {
	$.ajax({
	   url: "../definition_tam_area.xml",
	   dataType: "xml",
	   success: function(xml){
		//List Creation Code Starts
		var htmlCode = " ";			
		$(xml).find('folder').each(function(index){
			var sName = $(this).attr('name');
			var sLink = $(this).find('link').attr('url');
			htmlCode = htmlCode + "<li data-jstree='{\"icon\":\"file\"}'><a href='../"+sLink+"' target=\"frameMain\">"+sName+"</a></li>";			
		});
		$('ul#lista5').append(htmlCode);
		menuItemCriado();
				
	},
	   error: function(xhr, ajaxOptions, thrownError) {
	      alert("Ocorreu um erro ao abrir o portal.Tente novamente");      
	}
	});
};


function criaTrmServCat() {
	$.ajax({
	   url: "../definition_tam_area.xml",
	   dataType: "xml",
	   success: function(xml){
		//List Creation Code Starts
		var htmlCode = " ";			
		$(xml).find('folder').each(function(index){
			var sName = $(this).attr('name');
			var sLink = $(this).find('link').attr('url');
			htmlCode = htmlCode + "<li data-jstree='{\"icon\":\"file\"}'><a href='../"+sLink+"' target=\"frameMain\">"+sName+"</a></li>";			
		});
		$('ul#lista6').append(htmlCode);
		menuItemCriado();
				
	},
	   error: function(xhr, ajaxOptions, thrownError) {
	      alert("Ocorreu um erro ao abrir o portal.Tente novamente");      
	}
	});
};

function criaTrmServStd() {
	$.ajax({
	   url: "../definition_trm_service_category.xml",
	   dataType: "xml",
	   success: function(xml){
		//List Creation Code Starts
		var htmlCode = " ";			
		$(xml).find('folder').each(function(index){
			var sName = $(this).attr('name');
			var sLink = $(this).find('link').attr('url');
			htmlCode = htmlCode + "<li data-jstree='{\"icon\":\"file\"}'><a href='../"+sLink+"' target=\"frameMain\">"+sName+"</a></li>";			
		});
		$('ul#lista7').append(htmlCode);
		menuItemCriado();
				
	},
	   error: function(xhr, ajaxOptions, thrownError) {
	      alert("Ocorreu um erro ao abrir o portal.Tente novamente");      
	}
	});
};

function criaUnidadeOrganizacional() {
	$.ajax({
	   url: "../definition_trm_service_standard.xml",
	   dataType: "xml",
	   success: function(xml){
		//List Creation Code Starts
		var htmlCode = " ";			
		$(xml).find('folder').each(function(index){
			var sName = $(this).attr('name');
			var sLink = $(this).find('link').attr('url');
			htmlCode = htmlCode + "<li data-jstree='{\"icon\":\"file\"}'><a href='../"+sLink+"' target=\"frameMain\">"+sName+"</a></li>";			
		});
		$('ul#lista8').append(htmlCode);
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
}
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

function load_home(text){
	alert(text);
    document.getElementById("event_result").innerHTML='<object type="text/html" data="'+text+'" ></object>';
}

$(document).ready(function() {
$(".voltarTopo").hide();
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
});
