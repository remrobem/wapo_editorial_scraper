

$(document).ready(function () {
  $('.scrape').on('click', function (e) {
    e.preventDefault();
    //   var url = `${location.href}scrape`;
    //   $.ajax({
    //     method:"GET",
    //     url: url
    //   })
    //   location.reload();
    // })

    // Send the POST request.
    $.ajax("/scrape", {
      type: "GET"
    }).then(
      function () {
        console.log("data scraped");
        // Reload the page to get the updated list
        location.reload();
      });
  });
});