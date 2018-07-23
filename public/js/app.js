$(document).ready(function() {
  // Save Article
  $(".saveBtn").on("click", function(e) {
    e.preventDefault();
    let articleId = $(this).data("id");
   
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
      $.each(article.notes, function(_, note) {
        $("#existingNote").append(
          // ` <div><i class="fa fa-trash pull-right center-block" data-note=${note._id} data-id=${article_id}></i></div>
          `
          <div class="container-fluid">
            <div class="row" data-note=${note._id} data-id=${article_id}>
              <div class="row-height">
                <div class="col-sm-11 col-height">
                  <textarea id="existingNote" readonly maxlength="500" rows="5" placeholder="No notes exist yet">${
                    note.note
                  }</textarea>
                </div>
                <div class="col-sm-1 col-height col-middle">
                  <button type="submit" class="btn btn-danger btn-sm" id="deleteNoteBtn" data-note=${
                    note._id
                  } data-id=${article_id}>X</button>
                </div>
              </div>
            </div>
          </div>
          `
        );
      });
    });
  });

  // modal

  
  $("#saveNoteBtn").on("click", function(e) {
    e.preventDefault();

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
  });


  $(document).on("click", "#deleteNoteBtn", function() {
    
    var article_id = $(this).attr("data-id");
    var note_id = $(this).attr("data-note");
    // use POST to delete the note
    $.ajax({
      method: "POST",
      url: "/deletenote?" + "article=" + article_id + "&note=" + note_id
    })
    .then(function(data) {
      $("[data-note=note_id]").remove();
    });
  });
});
