/*!
 * Start Bootstrap - Freelancer Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('body').on('click', '.page-scroll a', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Floating label headings for the contact form
$(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !! $(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});


var enableSimulation = function(){
    $("#stopSimulation").prop('disabled', false);
    $("#startSimulation").prop('disabled', true);
    //$("#measurementPanel").fadeOut(1000);
    //$("#settingsPanel").fadeOut(1000);
    //$("#simulationSettings").fadeOut(1000);
};

var disableSimulation = function(){
    $("#stopSimulation").prop('disabled', true);
    $("#startSimulation").prop('disabled', false);
    //$("#measurementPanel").fadeIn(1000);
    //$("#settingsPanel").fadeIn(1000);
    //$("#simulationSettings").fadeIn(1000);
};

var randomColorGeneator = function () { 
    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8); 
};

var changeSettings = function(){
    var resource = $('#resource').val();      
    var domain = $('#domain').val();
    var enpointhtml='<p id="endpoint">URL: https://data.waylay.io/resources/'+resource+"/current";
    if(domain && domain !== ""){
        enpointhtml += "?domain=" +domain;
        var key = $('#key').val();
        var password = $('#secret').val();
        var header = "Header:" + '<span style="font-size: 10px;">Authorization Basic ' + btoa(key + ":" + password) + "</span>";
        var headerhtml = '<p id="headerendpoint">'+ header + "</p>"
        $('#headerendpoint').replaceWith(headerhtml);
    }
    enpointhtml += "</p>";
    $('#endpoint').replaceWith(enpointhtml);
};

$('#myChartPanel').mutate('height', function(e) {
   $('#myChart').css('width', ($(window).width()/2) +'px');
   $('#myChart').css('height', '400px');   
   var c = document.getElementById("myChart");
   c.height = "400";
   c.width = ($(window).width()/2);
});

var simulationData =[];
var timerId = 0;
var chartData = {};
var myLineChart;
var ctx;

$(document).ready(function(){ 
    $("#simulation").hide();
    $('#myChart').css('width', ($(window).width()/2) +'px');
    $('#myChart').css('height', '400px');
    $('#myChartPanel').hide();
    changeSettings();
    $("#pushDomain").click(function(e){
          e.preventDefault();
          var resource = $('#resource').val();
          var data = JSON.parse($('#data').val());
          var domain = $('#domain').val();
          var key = $('#key').val();
          var password = $('#secret').val();
          if(key && password && domain){
            WAYLAY.pushDomainData(domain, key, password, data, resource); 
           } else {
            WAYLAY.pushData(data, resource); 
          }  
    });

    $('#toggleHeader').click(function(e) {
        e.preventDefault();
        $('.toggleHeader').slideToggle('fast');
        return false;
    });


    $("#domain" ).change(function() {
        changeSettings();
    });
    $("#resource" ).change(function() {
        changeSettings();
    });
    $("#key" ).change(function() {
        changeSettings();
    });
    $("#secret" ).change(function() {
        changeSettings();
    });

    $("#startSimulation").click(function(e){
          e.preventDefault();
          $('#myChartPanel').show();
          var resource = $('#resource').val();
          var domain = $('#domain').val();
          var key = $('#key').val();
          var password = $('#secret').val();
          var frequency = $('#frequency').val();
          var countToStop = parseInt($('#countToStop').val());
          var count = 0;
          if(myLineChart && myLineChart.datasets && myLineChart.datasets.length > 0){
            while(myLineChart.datasets[0].points.length > 0)
                myLineChart.removeData();
          }
          //chartData["labels"] = [1, 2, 3, 4, 5, 6, 7];
          if(key && password && domain){
            if(frequency && simulationData.length > 0){
                timerId = setInterval(function(){ 
                    enableSimulation();
                    count++;
                    if(simulationData.length === 0 || count > countToStop){
                        disableSimulation();
                        clearInterval(timerId);
                    }             
                    else{
                        if(count > simulationData.length - 1)
                            count = 0;
                        WAYLAY.pushDomainData(domain, key, password, simulationData[count], resource); 
                        var point = simulationData[count];
                        var date = new Date();
                        myLineChart.addData(_.values(point),date.getHours() + ":" + date.getMinutes() +":" +date.getSeconds());
                        if(count > 20)
                            myLineChart.removeData();
                    }
                        
                }, frequency * 1000);
            }
          } else {
            if(frequency && simulationData.length > 0){
                timerId = setInterval(function(){ 
                    enableSimulation();
                    count++;
                    if(simulationData.length === 0 || count > countToStop){
                        disableSimulation();
                        clearInterval(timerId);
                    } 
                    else {
                        if(count > simulationData.length - 1)
                            count = 0;
                        WAYLAY.pushData(simulationData[count], resource);
                        var point = simulationData[count];
                        var date = new Date();
                        myLineChart.addData(_.values(point), date.getHours() + ":" + date.getMinutes() + ":" +date.getSeconds());
                        if(count > 20)
                            myLineChart.removeData();

                    }
                    }, frequency*1000);
            }
          }  
    });
    $("#stopSimulation").click(function(e){
        e.preventDefault();
        clearInterval(timerId);
        disableSimulation();
        $('#myChartPanel').hide();
    });
    $("#filename_json").change(function(e) {
        var ext = $("input#filename_json").val().split(".").pop().toLowerCase();
        if($.inArray(ext, ["json"]) == -1) {
            alert('Upload JSON');
            return false;
        }

        if (e.target.files != undefined) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var settings = JSON.parse(e.target.result);
                $('#domain').val(settings.domain);
                $('#key').val(settings.key);
                $('#secret').val(settings.secret);
                changeSettings();
            };
            reader.readAsText(e.target.files.item(0));
        }
        return false;
    });
    $("#filename_csv").change(function(e) {
        var ext = $("input#filename_csv").val().split(".").pop().toLowerCase();
        if($.inArray(ext, ["csv"]) == -1) {
            alert('Upload CSV');
            return false;
        }

        if (e.target.files != undefined) {
            var reader = new FileReader();
            reader.onload = function(e) {
                simulationData = [];
                var html = '<div id="datatable"> <table class="table table-striped table-bordered table-condensed" style="width:100%;">';

                var rows = e.target.result.split("\n");
                var params = rows[0].split(",");
                chartData = {labels : [], datasets:[]};
                var k =0;
                params.forEach(function(param){
                    chartData["datasets"][k++] = {
                        label: param, 
                        data:[],
                        fillColor: "rgba(230,220,220,0.1)",
                        strokeColor: randomColorGeneator(), 
                        highlightFill: randomColorGeneator(),
                        highlightStroke: randomColorGeneator()
                    };
                });
                $('#myChartPanel').show();
                ctx = $("#myChart").get(0).getContext("2d");
                myLineChart = new Chart(ctx).Line(chartData);
                var count = 0;
                rows.forEach(function(row) {
                    var columns = row.split(",");
                    if(count > 0){
                        var measurement = {};
                        columns.forEach(function (col, index){
                            measurement[params[index].trim()] = parseFloat(col).toPrecision(3);
                        });
                        simulationData.push(measurement);
                    }
                    html += "<tr>";
                    columns.forEach(function (col){
                        if(count > 3)
                            return;
                        if(count === 0)
                            html += '<th style="text-align: center;">' + col.trim() + "</th>";
                        else
                            html += "<td>" + parseFloat(col.trim()).toPrecision(3) + "</td>";
                    });
                    count++;
                    html += "</tr>";
                });
                html += "</table></div>";
                $('#datatable').replaceWith(html);

                var settingsHTML = '<div id="settings"><label for="frequency">Simulation frequency [secs]</label><input style="width: 80%;margin-left: 40px;margin-bottom: 5px;" class="form-control" type="number" id="frequency" name="frequency" value="1"/></div>';
                $('#settings').replaceWith(settingsHTML);

                var countHTML = '<div id="count"><label for="countToStop">Number of records</label><input style="width: 80%;margin-left: 40px;margin-bottom: 5px;" class="form-control" type="number" id="countToStop" name="countToStop" value="' + (rows.length - 1)+'"/></div>';
                $('#count').replaceWith(countHTML);

                $("#simulation").show();
                $("#myChart").show();
            };
            reader.readAsText(e.target.files.item(0));
        }
        return false;
    });

    
    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }
    }); 

    $('.scrollup').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });
    
    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top'
    })

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    $(".optionName").popover({ trigger: "hover" });

    $("#navigation .nav").tinyNav({
            active: 'selected', // String: Set the "active" class
            label: ''
        });

});


$('#filename_csv').bind('change', function () {
  var filename = $("#filename_csv").val();
  if (/^\s*$/.test(filename)) {
    $(".file-upload").removeClass('active');
    $("#noFile").text("No file chosen..."); 
  }
  else {
    $(".file-upload").addClass('active');
    $("#noFile").text(filename.replace("C:\\fakepath\\", "")); 
  }
});


$('#filename_json').bind('change', function () {
  var filename = $("#filename_json").val();
  if (/^\s*$/.test(filename)) {
    $(".file-upload").removeClass('active');
    $("#noFile2").text("No file chosen..."); 
  }
  else {
    $(".file-upload").addClass('active');
    $("#noFile2").text(filename.replace("C:\\fakepath\\", "")); 
  }
});





// $(document).on('change', '.btn-file :file', function() {
//   var input = $(this),
//       numFiles = input.get(0).files ? input.get(0).files.length : 1,
//       label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
//   input.trigger('fileselect', [numFiles, label]);
// });

// $(document).ready( function() {
//     $('.btn-file :file').on('fileselect', function(event, numFiles, label) {
        
//         var input = $(this).parents('.input-group').find(':text'),
//             log = numFiles > 1 ? numFiles + ' files selected' : label;
        
//         if( input.length ) {
//             input.val(log);
//         } else {
//             if( log ) alert(log);
//         }
        
//     });
// });
