$("#search-field").keyup(function (e) {
  const newValue = e.target.value.trim();
  $(".api-list").empty();
  filtered = filter(newValue, newValue, newValue)
  renderList();
});

function matchesIfNotNull(source, str) {
  sourceStr = decodeURIComponent(source).replace(/\+/g, " ");
  var result = str === null || str === '' || sourceStr.toLowerCase().match(str.toLowerCase()) !== null;
  return result;
}

function filter(name, description, url) {
  let filtered = {};

  Object.entries(services)
    .filter(entry => {
      return matchesIfNotNull(entry[0], name) ||
        matchesIfNotNull(entry[1].description, description) ||
        matchesIfNotNull(entry[1].url, url);
    })
    .forEach(entry => filtered[entry[0]] = entry[1]);

  return filtered;
}

function renderList() {
  $(".api-list-container").css("display", "block");
  var system_names = Object.keys(filtered).sort();

  if (system_names.length == 0) {
    if ($(".not-found").length === 0) {
      $(".api-list-container").append("<div class='not-found'><img src='/images/empty-box.png' /><p>No API has been found!</p></div>");
    }

    return;
  }
  else {
    $(".not-found").remove();
  }

  for (var i = 0; i < system_names.length; i++) {
    var name = system_names[i]; // system_name
    var description;
    var url;
    var supportEmail;
    var subscribable;
    var appsIdentifier;
    var state;
           
     if (services[system_names[i]].name != null) { // if present, name is a better option
      name = decodeURIComponent(services[system_names[i]].name.replace(/\+/g, '%20'));
     }
     if (services[system_names[i]].description != null) { // if present, description is a better option
      description = decodeURIComponent(services[system_names[i]].description.replace(/\+/g, '%20'));
     }
     if (services[system_names[i]].url != null) { // if present, description is a better option
      url = decodeURIComponent(services[system_names[i]].url.replace(/\+/g, '%20'));
     }
     if (services[system_names[i]].supportEmail != null) { // if present, description is a better option
      supportEmail = decodeURIComponent(services[system_names[i]].supportEmail.replace(/\+/g, '%20'));
     }
     if (services[system_names[i]].subscribable != null) { // if present, description is a better option
       subscribable= decodeURIComponent(services[system_names[i]].subscribable.replace(/\+/g, '%20'));
     }
     if (services[system_names[i]].appsIdentifier != null) { // if present, description is a better option
      appsIdentifier = decodeURIComponent(services[system_names[i]].appsIdentifier.replace(/\+/g, '%20'));
     }
    if (subscribable) { 
      state = 'publishedv2.png';
    } else {
      state = 'deprecatedv2.png';
    }   
    
     $("<div class='api-wrapper'>").text(name).append("<div class='card-body bg-catalog'><span>" + description + "</span><hr><span class='float-left'><b>Owner:</b>"+supportEmail+ "</span><span class='float-right'><b>Authentication:</b>"+ appsIdentifier +"</span></div>").append("<a class='card-footer text-white clearfix small z-1' href='"+ url +"' target='_blank'><span class='float-left'>Download</span><span class='float-right'><img src='/images/"+ state +"' width='142' height='50'></span></a></div>").appendTo($("<a>", { "href": "?api=" + system_names[i] }).appendTo($(".api-list")));
  }
}

var filtered = services;

(function () {
  var searchParams = new URLSearchParams(window.parent.location.search);
  if (searchParams.has("api")) {
    var api = searchParams.get("api");
    $(".api-list-container").css("display", "none");
    var url = services[api].url;
    var serviceEndpoint = services[api].serviceEndpoint;
    console.log(serviceEndpoint);
    SwaggerUI({ url: url, dom_id: "#swagger-ui-container", filter: true }, serviceEndpoint);
  } else {
    renderList();
  }
}());  
