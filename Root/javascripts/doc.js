const MAX_PAGE_ENTRIES = 5;
var publishedServices = [];
var filtered = [];
var lastCount = 0;

$("#search-field").keyup(function (e) {
  const newValue = e.target.value.trim();
  $(".api-list").empty();

  filtered = filter(newValue, newValue, newValue);
  
  $(".api-pagination").css("display", "none");
  
  renderResults();
});

function matchesIfNotNull(source, str) {
  sourceStr = decodeURIComponent(source).replace(/\+/g, " ");
  var result = str === null || str === '' || sourceStr.toLowerCase().match(str.toLowerCase()) !== null;
  return result;
}

function more() {
    $("#more-btn").text('Loading...');
    $("#more-btn").attr("disabled", true);
  
	var searchParams = new URLSearchParams(window.location.search);
  	var i = + searchParams.get("i");
  
  	if (i == 0) {
      i = MAX_PAGE_ENTRIES;
    } else {
      i = i + MAX_PAGE_ENTRIES;
    }
  
    $("#search-field").val("");
  
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?i='+i;
    window.history.pushState({path:newurl},'',newurl);

    filterUnpublishedServices();
}

function filter(name, description, url) {
  let filtered = {};

  Object.entries(publishedServices)
    .filter(entry => {
      return matchesIfNotNull(entry[0], name) ||
        matchesIfNotNull(entry[1].description, description) ||
        matchesIfNotNull(entry[1].url, url);
    })
    .forEach(entry => filtered[entry[0]] = entry[1]);

  return filtered;
}

function filterUnpublishedServices() {
  var searchParams = new URLSearchParams(window.location.search);
  var i = + searchParams.get("i");
  
  if (i > lastCount) {
  	var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?i='+lastCount;
    window.history.pushState({path:newurl},'',newurl);
    i = lastCount;
  }
  
  promises = [];
  
  var serviceEntries = Object.entries(services).sort();
  var end = i + MAX_PAGE_ENTRIES;
  
  if (serviceEntries.length < MAX_PAGE_ENTRIES) {
    end = serviceEntries.length;
  } else if (serviceEntries.length < end) {
    end = i - serviceEntries.length;
  }
  
  serviceEntries.slice(i, end).forEach(
    item => {
    	promises.push(
          $.get(window.location.origin + item[1].url.replace(/\+/g, '%20'),
               function() {
            publishedServices[item[0]] = item[1];
            if (serviceEntries.length <= end) {
              $(".api-pagination").remove();
            }
          }).fail(function() {
      		console.log( "Preventing not showing non published api doc: " + item[1].url );
    	  }));
    }
  );
  
  Promise.allSettled(promises)
    .then(function() {
    	const newValue = $("#search-field").val().trim();
    	filtered = filter(newValue, newValue, newValue);;
  	})
    .then(renderResults)
    .then(function() {
    	$("#more-btn").text('More');
    	$("#more-btn").attr("disabled", false);
  	});
}

function renderResults() {
  var searchParams = new URLSearchParams(window.location.search);
  var j = + searchParams.get("i");
  
  $(".api-list-container").css("display", "block");

  var system_names = Object.keys(filtered).sort();
  
  if (system_names.length == 0) {
    if ($(".not-found").length === 0) {
      $(".api-list").append("<div class='not-found'><img src='/images/empty-box.png' /><p>No API has been found!</p></div>");
    }

    return;
  }
  else {
    $(".not-found").remove();
  }
  
  for (var i = j; i < system_names.length; i++) {
    
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

    state = '';

    if (!subscribable) { 
      state = 'card-warn';
    }

    $("<div id='api-wrapper-"+i+"' class='api-wrapper "+state+"'>").text(name).append("<div class='card-body bg-catalog'><span>" + description + "</span><hr><span class='float-left'><b>Owner: </b>"+supportEmail+ "</span><span class='float-right'><b>Authentication: </b>"+ appsIdentifier +"</span></div>").append("<a class='card-footer text-white clearfix small z-1' href='"+ url +"' target='_blank'>JSON</a></div>").appendTo($("<a>", { "href": "?api=" + system_names[i] }).appendTo($(".api-list")));
    $(".not-found").remove();

    lastCount = i + 1;

  }
  
}

(function () {
  var searchParams = new URLSearchParams(window.parent.location.search);
  if (searchParams.has("api")) {
    var api = searchParams.get("api");
    $(".api-list-container").css("display", "none");
    var url = services[api].url;
    var serviceEndpoint = services[api].serviceEndpoint;
    SwaggerUI({ url: url, dom_id: "#swagger-ui-container", filter: true }, serviceEndpoint);
  } else {
    filterUnpublishedServices();
  }
}());