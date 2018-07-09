$(document).ready(function() {
  // Save Article
  $(".saveBtn").on("click", function(e) {
    e.preventDefault();
    let articleId = $(this).data("id");
    console.log("in save " + articleId);

    $.ajax({
      type: "POST",
      dataType: "json",
      url: "/save",
      data: {
        id: articleId
      }
    }).then(function(data) {
      location.reload(true);
    });
  });

  // delete as a saved article
  $(".deleteBtn").on("click", function(e) {
    e.preventDefault();
    let articleId = $(this).data("id");

    $.ajax({
      type: "POST",
      dataType: "json",
      url: "/delete",
      data: {
        id: articleId
      }
    }).then(function(data) {
      location.reload(true);
    });
  });

  // scrape articles
  $("#scrapeBtn").on("click", function(e) {
    e.preventDefault();

    $.ajax({
      type: "POST",
      dataType: "json",
      url: "/scrape"
    }).then(function(data) {
      location.reload(true);
    });
  });

  // show article notes. runs when the modal is about to be shown (show.bs.modal event)
  $("#notesModal").on("show.bs.modal", function(e) {
    let article_id = $(e.relatedTarget).data("id");
    // Empty the notes from the note section
    $("#newNote").empty();

    // Save the id from the button tag
    console.log(`modal article: ${article_id}`);
    $("#article_id").text(article_id);

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/article/" + article_id
    }).then(function(data) {
      console.log(data);
    });
  });

  // modal

  // save note in the modal
  $("#saveNoteBtn").on("click", function(e) {
    e.preventDefault();

    console.log(`save note id: ${article_id.textContent}`);
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/note/" + article_id.textContent,
      data: {
        note: $("#addNote").val().trim()
      }
    })
      .then(function(data) {
        console.log(`note added`);
      });
    // Also, remove the values entered in the input and textarea for note entry
    // $("#bodyinput").val("");
  });

  // When you click the deletenote button
  $(document).on("click", "#deletenote", function() {
    // Grab the id associated with the note
    var article_id = $(this).attr("data-id");
    // Run a POST request to delete the note
    $.ajax({
      method: "GET",
      url: "/notes/" + article_id
    })
      // With that done
      .done(function(data) {
        $("#" + data._id).remove();
      });
  });
});
