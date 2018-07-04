

$(document).ready(function () {

  $('#saveBtn').on('click', function (e) {
    e.preventDefault();
    
    let articleId = document.getElementById('saveBtn').dataset.id;
    console.log("in save");
  
    $.ajax({
      type: "POST",
      dataType: "json",
      url: "/save",
      data: {
        id: articleId
      }
    })
      .then(function (data) {
        location.reload(true)
      });
  });

  $('#deleteBtn').on('click', function (e) {
    e.preventDefault();
    let articleId = document.getElementById('deleteBtn').dataset.id;
    
    $.ajax({
      type: "POST",
      dataType: "json",
      url: "/delete",
      data: {
        id: articleId
      }
    })
      .then(function (data) {
        location.reload(true)
      });
  });

  $('#scrapeBtn').on('click', function (e) {
    e.preventDefault();
    
    $.ajax({
      type: "POST",
      dataType: "json",
      url: "/scrape"     
    })
      .then(function (data) {
        location.reload(true)
      });
  });

});