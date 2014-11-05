/* JS */
var menuCreationSize=0;
var xmlfolder="./xml/";
var endpointInfo="./";

String.prototype.stripHTML = function() {return this.replace(/<.*?>/g, '').replace(/&nbsp;/g,'')}

$(".voltarTopo").hide();
//$("#online").hide();
//$("#offline").hide();

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

function mostraDetalhes(opcao) {
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

function menuItemCriado() {
	menuCreationSize--;
	if (!menuCreationSize) criaMenu();	
};
function criaMenu() {
	// create the menu instance
	$("#jstree_menu").jstree(
		{
			"plugins" : [  "themes", "json_data", "search", "state", "dnd", "checkbox", "sort", "contextmenu", "unique", "ui"],
			"json_data": {
				"ajax": {
					'url': '/json_demo_roots.json',
					'type': 'GET',
					'data': function(node) {
					    return {
						'nodeId': node.attr ? node.attr("id") : ''
					    };
					}
				},
				"progressive_render": true,
				"progressive_unload": false
			},
			"themes" : {
				'responsive' : true,
				'variant' : 'small'
			},
			"core" : {
				"multiple" : false			
			},
			"check_callback" : function(o, n, p, i, m) {
				if(m && m.dnd && m.pos !== 'i') { return false; }
				if(o === "move_node" || o === "copy_node") {
					if(this.get_node(n).parent === this.get_node(p).id) { return false; }
				}
				return true;
			},
			"sort" : function(a, b) {
				return this.get_type(a) === this.get_type(b) ? (this.get_text(a) > this.get_text(b) ? 1 : -1) : (this.get_type(a) >= this.get_type(b) ? 1 : -1);
			},
			"contextmenu" : {
				"items" : function(node) {
					var tmp = $.jstree.defaults.contextmenu.items();
					delete tmp.create.action;
					tmp.create.label = "New";
					tmp.create.submenu = {
						"create_folder" : {
							"separator_after"	: true,
							"label"			: "Folder",
							"action"		: function (data) {
								var inst = $.jstree.reference(data.reference),
									obj = inst.get_node(data.reference);
								inst.create_node(obj, { type : "default" }, "last", function (new_node) {
									setTimeout(function () { inst.edit(new_node); },0);
								});
							}
						},
						"create_file" : {
							"label"				: "File",
							"action"			: function (data) {
								var inst = $.jstree.reference(data.reference),
									obj = inst.get_node(data.reference);
								inst.create_node(obj, { type : "file" }, "last", function (new_node) {
									setTimeout(function () { inst.edit(new_node); },0);
								});
							}
						}
					};
					if(this.get_type(node) === "file") {
						delete tmp.create;
					}
					return tmp;
				}
			},		  
			"unique" : {
				"duplicate" : function (name, counter) {
					return name + ' ' + counter;
				}
			},
			"state" : { "key" : "menuCatalogo", "ttl" : "86400000"},
			"search" : { "show_only_matches" : true }
		}
	).on('delete_node.jstree', function (e, data) {
		$.get('?operation=delete_node', { 'id' : data.node.id })
			.fail(function () {
				data.instance.refresh();
			});
	}).on('create_node.jstree', function (e, data) {
		$.get('?operation=create_node', { 'id' : data.node.parent, 'position' : data.position, 'text' : data.node.text })
			.done(function (d) {
				data.instance.set_id(data.node, d.id);
			})
			.fail(function () {
				data.instance.refresh();
			});
	}).on('rename_node.jstree', function (e, data) {
		$.get('?operation=rename_node', { 'id' : data.node.id, 'text' : data.text })
			.fail(function () {
				data.instance.refresh();
			});
	}).on('move_node.jstree', function (e, data) {
		$.get('?operation=move_node', { 'id' : data.node.id, 'parent' : data.parent, 'position' : data.position })
			.fail(function () {
				data.instance.refresh();
			});
	}).on('copy_node.jstree', function (e, data) {
		$.get('?operation=copy_node', { 'id' : data.original.id, 'parent' : data.parent, 'position' : data.position })
			.always(function () {
				data.instance.refresh();
			});
	}).on('changed.jstree', function (e, data) {
		if(data && data.selected && data.selected.length) {
			$.get('?operation=get_content&id=' + data.selected.join(':'), function (d) {
				if(d && typeof d.type !== 'undefined') {
					$('#data .content').hide();
					switch(d.type) {
						case 'text':
						case 'txt':
						case 'md':
						case 'htaccess':
						case 'log':
						case 'sql':
						case 'php':
						case 'js':
						case 'json':
						case 'css':
						case 'html':
							$('#data .code').show();
							$('#code').val(d.content);
							break;
						case 'png':
						case 'jpg':
						case 'jpeg':
						case 'bmp':
						case 'gif':
							$('#data .image img').one('load', function () { $(this).css({'marginTop':'-' + $(this).height()/2 + 'px','marginLeft':'-' + $(this).width()/2 + 'px'}); }).attr('src',d.content);
							$('#data .image').show();
							break;
						default:
							$('#data .default').html(d.content).show();
							break;
					}
				}
			});
		}
		else {
			$('#data .content').hide();
			$('#data .default').html('Select a file from the tree.').show();
		}
	}).bind("select_node.jstree", function (e, data) {
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
		author: '',
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
//Dropzone configuration
Dropzone.options.myDropzone = {
  paramName: "file", // The name that will be used to transfer the file
  maxFilesize: 2, // MB
  accept: function(file, done) {
    if (file.name == "justinbieber.jpg") {
      done("Naha, you don't.");
    }
    else { done(); }
  }
};

