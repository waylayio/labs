if (!window.WAYLAY) {
  WAYLAY = {
    // getToken: function(domain, user, pass, callback, onError) {
    //   var data = {
    //       "username": user,
    //       "password": pass,
    //       "grant_type": "client_credentials"
    //   };
    //   $.ajax({
    //     type: "POST",
    //     crossDomain: true,
    //     data: JSON.stringify(data),
    //     dataType: "json",
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json',
    //       "Authorization": "Basic " + btoa(user + ":" + pass)
    //     },
    //     url: "https://"+domain + "/api/auth/token",
    //     success: function(data) {
    //       callback(data.access_token);
    //     },
    //     error: function(jqXHR, textStatus, errorThrown) {
    //       console.log(jqXHR);
    //       if(onError) {
    //         onError(jqXHR.responseText);
    //       }
    //     }});
    // },
    getCurrentObject: function(domain, user, pass, resource, callback, onError) {
      $.ajax({
        type: "GET",
        crossDomain: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": "Basic " + btoa(user + ":" + pass)
        },
        url: "https://data.waylay.io/resources/" + resource +"/current?domain="+domain,
        success: function(data) {
          callback(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          if(onError) {
            onError(jqXHR.responseText);
          }
        }
      });
    },
    getAllObjects: function(domain, user, pass, resource, callback, onError) {
      $.ajax({
        type: "GET",
        crossDomain: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": "Basic " + btoa(user + ":" + pass)
        },
        url: "https://data.waylay.io/resources/" + resource +"/series?domain="+domain,
        success: function(data) {
          callback(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          if(onError) {
            onError(jqXHR.responseText);
          }
        }
      });
    },
    /*options in format {
      resource:
      grouping: [min|max|mean|median]
      parameter:
      from: UTC time
      to: UTC time
      grouping: [day|week|month|year]
    }*/
    getTimeSeriesData: function(domain, user, pass, ops, callback, onError) {
      var url = "https://data.waylay.io/resources/" + ops.resource +"/series/" + ops.parameter + "?domain=" + domain ;
      if(ops.aggregate && ops.grouping){
        url += "&grouping=" + ops.grouping;
        url += "&aggregate=" + ops.aggregate;
      }
      if(ops.from && ops.to)
        url += "&from=" + ops.from + "&to=" + ops.to;
      $.ajax({
        type: "GET",
        crossDomain: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": "Basic " + btoa(user + ":" + pass)
        },
        url: url,
        success: function(data) {
          callback(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          if(onError) {
            onError(jqXHR.responseText);
          }
        }
      });
    },
    pushData: function(domain, user, pass, data, resource, toStore, onSuccess, onError) {
      var resources = resource.split(",")
      if(resources.length === 1){
        $.ajax({
          type: "POST",
          crossDomain: true,
          url: "https://data.waylay.io/resources/" + resource + "?store=" +toStore,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "Basic " + btoa(user + ":" + pass)
          },
          data: JSON.stringify(data),
          dataType: "json",
          success: function(data) {
            console.log(data.message);
            if(onSuccess){
              onSuccess(data.message + ":" + JSON.stringify(data.content));
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            if(onError) {
              onError(jqXHR.responseText);
            }
          }
        })
      } else {
        var dataArray = []
        resources.forEach(function (resource) {
          var d = JSON.parse(JSON.stringify(data))
          d.resource = resource.trim()
          dataArray.push(d)
        })
        $.ajax({
          type: "POST",
          crossDomain: true,
          url: "https://data.waylay.io/messages?store=" +toStore,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "Basic " + btoa(user + ":" + pass)
          },
          data: JSON.stringify(dataArray),
          dataType: "json",
          success: function(data) {
            console.log(data.message);
            if(onSuccess){
              onSuccess(data.message);
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            if(onError) {
              onError(jqXHR.responseText);
            }
          }
        })
      }
    },
    pushParamValue: function(domain, user, pass, parameter, value, resource, onSuccess, onError) {
      $.ajax({
        type: "POST",
        crossDomain: true,
        url: "https://data.waylay.io/resources/" + resource + "?domain=" + domain,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": "Basic " + btoa(user + ":" + pass)
        },
        data: JSON.stringify({parameter: value}),
        dataType: "json",
        success: function(data) {
          console.log(data.message);
          if(onSuccess){
            onSuccess(data.message);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          if(onError) {
            onError(jqXHR.responseText);
          }
        }
      });
    },
    pushDataToTemplate: function(domain, user, pass, data, template, onSuccess, onError) {
      $.ajax({
        type: "POST",
        url: "https://"+domain+"/api/templates/" + template+"/run",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Basic " + btoa(user + ":" + pass)
        },
        data: JSON.stringify(data),
        dataType: "text",
        success: function(data) {
          console.log(data);
          if(onSuccess){
            onSuccess(data);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          var error = errorThrown.mesage ? errorThrown.mesage: jqXHR.responseText
          console.log(error);
          if(onError) {
            onError(error);
          }
        }
      });
    }

  }
}
