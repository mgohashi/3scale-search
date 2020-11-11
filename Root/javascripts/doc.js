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
    if (services[system_names[i]].name != null) { // if present, name is a better option
      name = decodeURIComponent(services[system_names[i]].name.replace(/\+/g, '%20'));
    }
    if (services[system_names[i]].description != null) { // if present, description is a better option
      description = decodeURIComponent(services[system_names[i]].description.replace(/\+/g, '%20'));
    }
    if (services[system_names[i]].url != null) { // if present, description is a better option
      url = decodeURIComponent(services[system_names[i]].url.replace(/\+/g, '%20'));
    }
    $("<div class='api-wrapper'>").text(name).append("<span>" + description + "</span>").append("<span>" + url + "</span>").appendTo($("<a>", { "href": "?api=" + system_names[i] }).appendTo($(".api-list")));
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
    SwaggerUI({ url: url, dom_id: "#swagger-ui-container", filter: true }, serviceEndpoint);
  } else {
    renderList();
  }
}());  