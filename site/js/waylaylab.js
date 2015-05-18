if (!window.WAYLAY) {
  WAYLAY = {
    pushParamValue: function(parameter, value, resource, onSuccess, onError) {
      $.ajax({
        type: "POST",
        crossDomain: true,
        url: "https://data.waylay.io/resources/" + resource,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
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
    pushData: function(data, resource, onSuccess, onError) {
      $.ajax({
        type: "POST",
        crossDomain: true,
        url: "https://data.waylay.io/resources/" + resource,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
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
    getData: function(resource, callback, onError) {
      $.ajax({
        type: "GET",
        crossDomain: true,
        url: "https://data.waylay.io/resources/" + resource +"/current",
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
    pushDomainParamValue: function(domain, user, pass, parameter, value, resource, onSuccess, onError) {
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
    pushDomainData: function(domain, user, pass, data, resource, onSuccess, onError) {
      $.ajax({
        type: "POST",
        crossDomain: true,
        url: "https://data.waylay.io/resources/" + resource + "?domain=" + domain,
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
    }
  }
}
