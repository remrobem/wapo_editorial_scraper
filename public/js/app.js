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

    // Empty the text for a new note
    $("#newNote").val("");
    // get rid of the existing notes displayed last time
    $("#existingNote").empty();
 
    // Save the id from the button tag
   
    $("#article_id").text(article_id);

    // Now make an ajax call to get the Article notes
    $.ajax({
      method: "GET",
      url: "/article/" + article_id
    }).then(function(article) {
     
      $.each(article.notes, function(_, object) {
        $("#existingNote").append(
          ` <textarea id="existingNote" readonly maxlength="500" rows="5" placeholder="No notes exist yet" width="100%">${
            object.note
          }</textarea>`
        );
      });
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
        note: $("#newNote")
          .val()
          .trim()
      }
    }).then(function(data) {
     
      location.reload(true);
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
