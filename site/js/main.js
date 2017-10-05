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

var randomColorGenerator = function () {
    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
};

var addRandom = function(data) {
  for(var index in data) {
    if (data.hasOwnProperty(index) && !isNaN(data[index])) {
      var r = Math.random()
      if(r >0.5)
        data[index] += r * 2
      else
        data[index] -= r * 2
    }
  }
  return data
}

var initSocket = function(domain, resource, apiKey, apiSecret){
  socket = new WebSocket("wss://data.waylay.io/resources/" + resource + "/socket?domain=" + domain + "&apiKey=" + apiKey + "&apiSecret=" + apiSecret);
  socket.onopen = function(){
    //alertMessage.add(alertMessage.TYPE.INFO, 'Socket connected', true);
    console.log("Socket connected");
  };
  socket.onerror = function(e){
    //alertMessage.add(alertMessage.TYPE.INFO, 'Socket connected', true);
    console.log("Socket error: " + e);
  };
  socket.onmessage = function(msg){
    var parsed = JSON.parse(msg.data);
    console.log(parsed)
    $( "#websocketData" ).text(msg.data);
    var i = 0;
    metricsData.forEach(function(metric){
      if(!metricsSocketData[i])
        metricsSocketData[i] = [];
      metricsSocketData[i].push(parseFloat(parsed[metric]));
      var k = i+1;
      $('#websocketChart'+k).sparkline(metricsSocketData[i++])
    });
  };

  socket.onclose = function(){
    //alertMessage.add(alertMessage.TYPE.INFO, 'Socket closed', true);
    console.log("Socket closed");
  }
};

var changeSettings = function(){

  var domain = $('#domain').val()
  var key = $('#key').val()
  var secret = $('#secret').val()
  var resource = $('#resource').val()

  // create settings download link
  var settings = {
    domain: domain,
    key: key,
    secret: secret
  }
  var settingJson = JSON.stringify(settings, null, 2)
  var blob = new Blob([settingJson], {type: 'application/json'})
  var url = window.URL.createObjectURL(blob)
  $('#downloadSettings').attr("href", url)
  $('#downloadSettings').attr("download", domain + "_labs_settings.json")


    var enpointhtml='<p id="endpoint">URL: https://data.waylay.io/resources/'+resource+"/current";
    if(domain && domain !== ""){
        enpointhtml += "?domain=" +domain;
        var password = secret
        var header = "Header:" + '<span style="font-size: 10px;">Authorization Basic ' + btoa(key + ":" + password) + "</span>";
        var headerhtml = '<p id="headerendpoint">'+ header + "</p>"
        $('#headerendpoint').replaceWith(headerhtml);
        if(password && resource && key){
          WAYLAY.getCurrentObject(domain, key, password, resource, function(data){
             console.log(data)
             metricsData = Object.keys(data)
             var index = metricsData.indexOf("timestamp");
             if(index !== -1)
                metricsData.splice(index, 1);
             metricsSocketData = new Array(metricsData.length)
          });
          initSocket(domain, resource, key, secret)
        }
    }
    enpointhtml += "</p>";
    $('#endpoint').replaceWith(enpointhtml);

};

$('#myChartPanel').mutate('height', function(e) {
   $('#myChart')
     .css('width', ($(window).width()/2) +'px')
     .css('height', '400px');
   var c = document.getElementById("myChart");
   c.height = "400";
   c.width = ($(window).width()/2);
});

$('#seriesChartPanel').mutate('height', function(e) {
   $('#seriesChart')
     .css('width', ($(window).width()/2) +'px')
     .css('height', '400px');
   var c = document.getElementById("seriesChart");
   c.height = "400";
   c.width = ($(window).width()/2);
});

var simulationData = [];
var timerId = 0;
var chartData = {};
var simulationLineChart;
var ctx;
var metricsData = [];
var metricsSocketData = [];
var socket;

$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
  $("#simulation").hide();
  $("#table").hide();
  $('#myChart')
    .css('width', ($(window).width()/2) +'px')
    .css('height', '400px');
  $('#myChartPanel').hide();

  changeSettings();

  var clearMessages = function(){
    $("#error").text("");
    $("#info").text("");
  };

  var errorHandler = function(error){
    $("#error").text(error);
  };

  var successHandler = function(info){
    $("#info").text(info);
  };

  $("#getLatestObject").click(function(e){
    e.preventDefault();
    var resource = $('#resource').val();
    try {
      var data = JSON.parse($('#data').val());
      var domain = $('#domain').val();
      var key = $('#key').val();
      var password = $('#secret').val();
      if (key && password && domain) {
        WAYLAY.getCurrentObject(domain, key, password, resource, function(data) {
          $("#latestObject").text(JSON.stringify(data, null, 2));
        }, errorHandler);
      } else {
        alert('please add domain and keys');
      }
    }catch(e){
      errorHandler(e.message);
    }
  });

  $("#getAllObjects").click(function(e){
    e.preventDefault();
    var resource = $('#resource').val();
    try {
      var data = JSON.parse($('#data').val());
      var domain = $('#domain').val();
      var key = $('#key').val();
      var password = $('#secret').val();
      if (key && password && domain) {
        WAYLAY.getAllObjects(domain, key, password, resource, function(data) {
          $("#allObjects").text(JSON.stringify(data, null, 2));
        }, errorHandler);
      } else {
        alert('please add domain and keys');
      }
    }catch(e){
      errorHandler(e.message);
    }
  });

  $("#pushDomain").click(function(e){
    clearMessages();
    e.preventDefault();
    var resource = $('#resource').val();
    try {
      var data = JSON.parse($('#data').val());
      var domain = $('#domain').val();
      var key = $('#key').val();
      var password = $('#secret').val();
      var toStore = $('#toStore').is(':checked')
      var random = $('#random').is(':checked')
      if(random){
        data = addRandom(data)
      }
      if (key && password && domain) {
        WAYLAY.pushData(domain, key, password, data, resource, toStore, successHandler, errorHandler);
      } else {
        alert('please add domain and keys');
      }
    }catch(e){
      errorHandler(e.message);
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
    var toStore = $('#toStore').is(':checked')
    var count = 0;
    if(simulationLineChart && simulationLineChart.datasets && simulationLineChart.datasets.length > 0){
      while(simulationLineChart.datasets[0].points.length > 0)
        simulationLineChart.removeData();
    }
    //chartData["labels"] = [1, 2, 3, 4, 5, 6, 7];
    if(key && password && domain){
      if(frequency && simulationData.length > 0){
        enableSimulation();
        timerId = setInterval(function(){
          count++;
          if(simulationData.length === 0 || count > countToStop){
            disableSimulation();
            clearInterval(timerId);
          } else{
            if(count > simulationData.length - 1) {
              count = 0;
            }
            WAYLAY.pushData(domain, key, password, simulationData[count], resource, toStore);
            var point = simulationData[count];
            var date = new Date();
            simulationLineChart.addData(_.values(point), date.getHours() + ":" + date.getMinutes() +":" +date.getSeconds());
            if(count > 10) {
              // The chart will remove the first point and animate other points into place
              simulationLineChart.removeData();
            }
          }

        }, frequency);
      }else{
        alert("Frequency not set or no data loaded");
      }
    } else {
      alert("please add domain and keys");
    }
  });

  $("#stopSimulation").click(function(e){
      e.preventDefault();
      clearInterval(timerId);
      disableSimulation();
      $('#myChartPanel').hide();
  });

  var loadTimeSeries = function(metric, data) {
    nv.addGraph(function() {
      var width = 900, height = 400;
      var chart = nv.models.lineChart()
        .x(function(d) {return d.x })
        .y(function(d) {return d.y })
        .xScale(d3.time.scale.utc())
        .useInteractiveGuideline(true)
        .width(width).height(height);

      chart.xAxis
        .axisLabel('Time')
        .staggerLabels(true)
        .showMaxMin(false)
        .tickFormat(function(d) {
            return d3.time.format('%x %X')(new Date(d));
          });

      chart.yAxis
        .showMaxMin(false)
        .axisLabelDistance(30)
        .tickFormat(d3.format('.02f'));

      var values = [];
      data.series.forEach(function(d) {
        values.push({x: d[0], y: d[1]});
      });
      d3.select('#seriesChart').append("svg:svg")
        .style({ 'width': width + 150, 'height': height + 150})
        .datum([{ values: values, key: metric}])
        .transition()
        .duration(0)
        .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
  });

  }

  $("#getSeriesData").click(function(e){
    e.preventDefault();
    var domain = $('#domain').val();
    var key = $('#key').val();
    var password = $('#secret').val();
    var resource = $('#resource').val();
    if (key && password && domain && resource){
      d3.select("#seriesChart").selectAll("svg").remove();
      metricsData.forEach(function(metric){
          var options = {
            parameter: metric,
            resource: resource
          };
          WAYLAY.getTimeSeriesData(domain, key, password, options, function(data){
            loadTimeSeries(metric, data);
          }, errorHandler);
        });
    } else {
      alert("Missing settings")
    }
  });

  $("#filename_json").change(function(e) {
      var ext = $("input#filename_json").val().split(".").pop().toLowerCase();
      if($.inArray(ext, ["json"]) == -1) {
          alert('No a JSON file.');
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


  function buildTable(columnNames, previewRows) {
    var html = '<table class="table table-striped table-bordered table-condensed" style="width:100%;">';
    html += "<tr>";
    columnNames.forEach(function (name) {
      html += '<th style="text-align: center;">' + name.trim() + "</th>";
    });
    html += "</tr>";

    previewRows.forEach(function (row) {
      html += "<tr>";
      row.forEach(function (value) {
        html += "<td>" + parseFloat(value.trim()).toPrecision(8) + "</td>";
      });
      html += "</tr>";
    });
    html += "</table>";
    return html;
  }

  function buildSimulationData(dataRows, columnNames) {
    return _.map(dataRows, function(columns){
      var measurement = {};
      columns.forEach(function (col, index) {
        var name = columnNames[index];
        measurement[columnNames[index].trim()] = parseFloat(col).toPrecision(8);
      });
      return measurement;
    });
  }

  function buildChart(columnNames) {
    chartData = {
      labels: [],
      datasets: []
    };
    var k = 0;
    columnNames.forEach(function (param) {
      chartData["datasets"][k++] = {
        label: param,
        data: [],
        fillColor: "rgba(230,220,220,0.1)",
        strokeColor: randomColorGenerator(),
        highlightFill: randomColorGenerator(),
        highlightStroke: randomColorGenerator()
      };
    });
    $('#myChartPanel').show();

    //60 is way too heavy and crashes the browser when sending every second
    Chart.defaults.global.animationSteps = 10;

    var chartDiv = $("#myChart");
    ctx = chartDiv.get(0).getContext("2d");
    simulationLineChart = new Chart(ctx).Line(chartData);
    chartDiv.show();
  }

  function parseCsv(contents) {
    var rows = _.filter(contents.split("\n"), function (e) {
      return e.trim().length > 0
    });
    rows = _.map(rows, function (row) {
      return row.split(",");
    });
    return {
      columnNames: rows[0],
      dataRows: rows.slice(1, rows.length)
    };
  }

  var readCsv = function(file){
    $("#simulation").hide();
    $("#table").hide();

    var reader = new FileReader();
    reader.onload = function(e) {
      simulationData = [];
      var content = e.target.result;

      try {
        var csv = parseCsv(content);

        simulationData = buildSimulationData(csv.dataRows, csv.columnNames);

        buildChart(csv.columnNames);

        var html = buildTable(csv.columnNames, csv.dataRows.slice(0, 3));

        $('#datatable').html(html);
        $('#count').html((csv.dataRows.length));

        $("#table").show();
        $("#simulation").show();
      }catch(e){
        alert("Failed to parse csv, please check the format")
      }
    };
    reader.readAsText(file);
  };

    $("#filename_csv").change(function(e) {
        var ext = $("input#filename_csv").val().split(".").pop().toLowerCase();
        if($.inArray(ext, ["csv"]) == -1) {
            alert('Not a CSV file');
            return false;
        }

        if (e.target.files != undefined) {
          readCsv(e.target.files.item(0));
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
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    $(".optionName").popover({ trigger: "hover" });

    //$("#navigation .nav").tinyNav({
    //        active: 'selected', // String: Set the "active" class
    //        label: ''
    //    });

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
