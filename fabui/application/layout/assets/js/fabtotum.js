function number_format(number, decimals, dec_point, thousands_sep) {
	
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
	var n = !isFinite(+number) ? 0 : +number, prec = !isFinite(+decimals) ? 0
			: Math.abs(decimals), sep = (typeof thousands_sep === 'undefined') ? ','
			: thousands_sep, dec = (typeof dec_point === 'undefined') ? '.'
			: dec_point, s = '', toFixedFix = function(n, prec) {
		var k = Math.pow(10, prec);
		return '' + Math.round(n * k) / k;
	};
	
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	}
	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
}

function precise_round(num,decimals) {
   return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * @param time
 * @returns {String}
 */
function _time_to_string(time) {

	var hours = parseInt(time / 3600) % 24;
	var minutes = parseInt(time / 60) % 60;
	var seconds = time % 60;

	return pad(precise_round(hours, 0)) + ":" + pad(precise_round(minutes, 0)) + ":" + pad(precise_round(seconds,0));
}

/**
 * 
 * @param val
 * @returns
 */
function pad(val) {
	return val > 9 ? val : "0" + val;
}

function freeze_menu(except){
   
   
	var excepet_item_menu = new Array();
	
	excepet_item_menu[0] = 'dashboard';
	excepet_item_menu[1] = 'objectmanager';
	excepet_item_menu[2] =  except;
	
	$( "#left-panel a" ).each( function( index, element ){
		
		var controller =  $( this ).attr('data-controller');
		// se non � nella lista allora la rendo disabled
		if(excepet_item_menu.indexOf(controller) < 0){
			$(this).addClass('menu-disabled');
		}
		//se corrisponde aggiungo punto esclamativo per notifica
		if(controller == except){
		  
            
            if($(this).find('.freeze-menu').length <= 0){
                $(this).append('<span class="badge bg-color-red pull-right inbox-badge freeze-menu">!</span>');
                freezed = true;
            }
			
		}
		
	});
}


/**
*
*/
function unfreeze_menu(){
	
	
    $( "#left-panel a" ).each( function( index, element ){
        $(this).removeClass('menu-disabled');
    });
        
    $(".freeze-menu").remove();
    
    freezed = false;
    
}

function bytesToSize(bytes) {
	   var k = 1000;
	   var sizes = ["B", "Kb", "Mb", "Gb", "Tb"];
	   if (bytes === 0) return '0 Bytes';
	   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)),10);
	   return parseFloat((bytes / Math.pow(k, i))).toFixed(3) + ' ' + sizes[i];
}

/**
 * 
 * 
 */

/**
 * VARIABLES: fabui global variables
 */

/** 
 *  MODAL WAITING
 */
var loading = $.magnificPopup.instance;


function openWait(title){
    
    
     if($(".wait-content").length > 0){
        $(".wait-content").html('');
        $(".wait-content").remove();
    }
    
    
    
    var src_html  = '<div class="white-popup animated bounceInDown">';    
        src_html += '<h4 class="text-align-center wait-title">' + title +' </h4>';
        src_html += '<h4 class="text-align-center"><i class="fa fa-spinner fa-spin"></i></h4>'
        src_html += '<div class="wait-content"></div>';
        src_html += '</div>';
    
	loading.open({
		items: {
			     src : src_html
              },
	    removalDelay: 100,
	    type: 'inline',
	    preloader: false,
		modal: true,
		mainClass: 'mfp-zoom-in',
        alignTop : false,
        preloader: true
	 });
	
}

function closeWait(){
	loading.close();
}


function waitTitle(title){
    if($(".wait-title").length > 0){
        $(".wait-title").html(title);
    }
}


function waitContent(content){
    if($(".wait-content").length > 0){
        $(".wait-content").html(content);
    }
}



var color_green = "#659265";
var color_red   = "#C46A69";
var freezed     = false;

function show_small_box(title, message, color, icon, timeout){
	$.smallBox({
		title : title,
		content : message,
		color : color,
		//timeout: 6000,
		icon : icon,
		timeout : timeout
	});
}

function show_error(message){
	show_small_box('Error', message, color_red, 'fa fa-warning shake animated', 6000);
}

function show_info_message(message){
	show_small_box('Info', message, color_green, 'fa fa-check bounce animated', 4000);
		
}


var notifications_interval;
var safety_interval;
var tasks_interval;
var emergency = false;
var idleTime  = 0;
var idleInterval

/** CHECK PRINTE SAFETY */
function safety(){
   
   var timestamp = new Date().getTime();
   if(emergency == false){
       $.get( "/temp/fab_ui_safety.json?time=" + timestamp , function( data ) {
           
             if(parseInt(data.state.emergency) == 1 ) {
                
                 emergency = true;
                
                $.SmartMessageBox({
    				title: "Attention!",
    				content: "<i class='fa fa-warning'></i> An error occured, please check head conncections and front panel and then press OK to continue or Ignore to disable this warning",
    				buttons: '[OK][IGNORE]'
    			}, function(ButtonPressed) {
    				if (ButtonPressed === "OK") {
    					 secure(1);
    				}
    				
    				if (ButtonPressed === "IGNORE") {
    					 secure(0);
    				}
    				
    			});
               
                
             }
       });
   }
    
}

function secure(mode){
    
    
    	$.ajax({
			type: "POST",
			url: "/fabui/application/modules/controller/ajax/secure.php",
            data: {mode: mode},
            dataType: 'json'
		}).done(function(response) {
		  
            emergency = false;
               
		});

}


function set_tasks(data){
    number_tasks = data.number;
    var controller = '';
    
    $(".task-list").find('span').html('	Tasks (' + data.number + ') ');
     
    $.each(data.items, function() {
        
        var row = this;
      
        controller = row.controller;
       
    });  
    
    if(data.number > 0){
            freeze_menu(controller);
            freezed = true;
        }else{
            freezed = false;
            unfreeze_menu();
    }
    
}


function set_updates(data){
    
    number_updates = data.number;
    $(".update-list").find('span').html('	Updates (' + data.number + ') ');
    
}


function update_notifications(){
    
    var total = number_updates + number_tasks + number_notifications ;
    
    if(total > 0){
        $("#activity").find('.badge').addClass('bg-color-red bounceIn animated');
        document.title = 'FAB UI beta (' + total + ')';
    }else{
        $("#activity").find('.badge').removeClass('bg-color-red bounceIn animated');
         document.title = 'FAB UI beta';
    }
    
    
    if(number_tasks == 0){
    	freezed = false;
    	unfreeze_menu();
    }
    
    $("#activity").find('.badge').html(total);
    
}



function refresh_notifications(){
    $( ".notification" ).each( function( index, element ){
        var obj = $(this);
        if(obj.hasClass('active')){
            var url = obj.find('input[name="activity"]').attr("id");
            var container = $(".ajax-notifications");
            loadURL(url, container);
        }
	});
}



/** CHECK UPDATES, TASKS, MENU  */


function check_notifications(){
	
	
	
	//KRIOS
	if(idleTime < max_idle_time){
    
	    var timestamp = new Date().getTime();
	    
	    $.ajax({
	            type: "POST",
	            url: "/fabui/application/modules/controller/ajax/check_notifications.php?time="+timestamp,
	            dataType: 'json',
	            cache : false
	        }).done(function( data ) {
	        	
	            set_updates(data.updates);
	            set_tasks(data.tasks);
	            update_notifications();
	             
	             if(data.internet == true){
	                $('.internet').show();
	             }else{
	                $('.internet').hide();
	             }
	        });
        
    }else{
    	$("#lock-screen-form").submit();
    }
}


/** ON LOAD */

$(function() {
  // Handler for .ready() called.
  idleInterval = setInterval(timerIncrement, 1000);
  safety_interval= setInterval(safety, 3000); /* START TIMER... */
  check_notifications();
  notifications_interval = setInterval(check_notifications, 5000);
  $("#refresh-notifications").on('click', refresh_notifications);
  

});



$(".language").click(function () {
    
    
    var actual_lang = $("#actual_lang").val();
    var new_lang    = $(this).attr("data-value");
    
    if(actual_lang != new_lang){
        $("#lang").val(new_lang);
        
        
        openWait('<i class="fa fa-flag"></i><br> loading language... ');
        $("#lang_form").submit();
    }
    
    
});


$(document).mousemove(function(e){
      idleTime = 0;   
});


function timerIncrement(){
	idleTime++;
}
