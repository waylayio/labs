if (!window.WAYLAY) {
  WAYLAY = {
    pushParamValue: function(parameter, value, resource) {
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
                console(data.message);
              }, 
             error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
         }
         });  
      },
      pushData: function(data, resource) {
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
              }, 
             error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
         }
         });  
      },
      getData: function(resource, callback) {
         $.ajax({
           type: "GET",
             crossDomain: true,
             url: "https://data.waylay.io/resources/" + resource +"/current",
             success: function(data) {
                callback(data);
              }, 
             error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
         }
         });  
      },
      pushDomainParamValue: function(domain, user, pass, parameter, value, resource) {
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
              }, 
             error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
         }
         });  
      },
      pushDomainData: function(domain, user, pass, data, resource) {
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
             }, 
             error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
         }
         });  
      }
  }
}
