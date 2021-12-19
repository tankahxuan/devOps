

    window.indexedDB = window.indexedDB || window.mozIndexedDB || 
    window.webkitIndexedDB || window.msIndexedDB;
    
    //prefixes of window.IDB objects
    window.IDBTransaction = window.IDBTransaction || 
    window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || 
    window.msIDBKeyRange
    
    if (!window.indexedDB) {
       window.alert("Your browser doesn't support a stable version of IndexedDB.")
    }

    var db;
    //Request to initialise the database when user visits the page
    var request = window.indexedDB.open("SummerMelts", 2);
    
    request.onerror = function(event) {
       console.log("error: ");
    };
    
    request.onsuccess = function(event) {
       db = request.result;
 
       console.log("success: "+ db);
    };
    
    request.onupgradeneeded = function(event) { 
        var db = event.target.result;
        var objectStore = db.createObjectStore("customerNotes", { keyPath: "id", autoIncrement:true });
        objectStore.createIndex("flavour", "flavour", { unique: false });
        objectStore.createIndex("notes", "notes", { unique: false });
        objectStore.createIndex("created_at", "created_at", { unique: false });

      };


      



    $(function(){
      // To save notes on the flavours page
      $('.saveBtn').click(function () {

         //need to reference current form here
         $(this).closest('form');
         //need to reference the hidden input with name="Name" above
        var flavour =  $(this).closest('form').find('input[name="flavour"]').val();
        var notes =  $(this).closest('form').find('textarea[name="notes"]').val();
  

        const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
         let current_datetime = new Date()
         let formatted_date = current_datetime.getDate() + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getFullYear()

         var formatTime = d3.timeFormat("%d-%m-%Y %H:%M:00");
           date = formatTime(new Date); // "June 30, 2015"
           console.log(date)
         console.log(flavour)
         console.log(notes)

        var request = db.transaction(["customerNotes"], "readwrite")
        .objectStore("customerNotes")
        .add({  theme: 'Product Related',flavour: flavour, notes: notes, created_at:date });
        
        request.onsuccess = function(event) {
         $( ".successMsg" ).hide()
         $(this).closest('form').find('input[name="flavour"]').val('');
     $('textarea[name="notes"]').val("");
         $( ".successMsg" ).text( "Your Notes is added" ).show().fadeOut( 3000 );
         displayNotes()
        };
        
        request.onerror = function(event) {
           alert("Unable to add data\r\nKenny is aready exist in your database! ");
        }
      });


   
    })





//To display all notes on the Notes.html page
function displayNotes() {
 
      var transaction = db.transaction(["customerNotes"], "readonly");  
      var content="<table class='table table-bordered table-striped mt-3 notesTable' ><thead><tr><th> Created At</th><th> Theme </th><th>Flavour</th><th>Updated</th><th> Action</th></td></thead><tbody>";
   
      transaction.oncomplete = function(event) {
          $("#DisplayNoteTable").html(content);
      };
   
      var handleResult = function(event) {  
        var cursor = event.target.result;  
        if (cursor) {  

         content +=  `<tr>
         <td>${cursor.value.created_at}</td>
         <td>${cursor.value.theme}</td>
         <td>${cursor.value.flavour}</td>
         <td>${cursor.value.notes}</td>
         <td><button type="button" data-toggle="modal" data-target="#editNote" onclick='editNote(${cursor.key})' class="btn btn-info "><i class="fas fa-edit"></i></button>    <button type="button" onclick='removeNote(${cursor.key})' class="deleteNote btn btn-danger "><i class="fas fa-trash-alt"></i></button></td>
       </tr>`
   
          cursor.continue();  
        }  
        else {  
          content += "</tbody></table>";
        }  
      };
   
      var objectStore = transaction.objectStore("customerNotes");
   
      objectStore.openCursor().onsuccess = handleResult;
   
  }


function removeNote(noteKey) {
       
   var request = db.transaction(["customerNotes"], "readwrite")
   .objectStore("customerNotes")
   .delete(noteKey);
   
   request.onsuccess = function(event) {
      displayNotes()

   };
}


function editNote(noteKey) {
       
   var request = db.transaction(["customerNotes"], "readwrite")
   .objectStore("customerNotes")
   .get(noteKey);
   console.log("edit note")
   request.onsuccess = function(event) {
      var note = request.result;
      console.log(note)
      $("#Editkey").val(note.id);
      $("#Edittheme").val(note.theme);
      $("#Editflavour").val(note.flavour);
      $("#Editbody").val(note.notes);

      $('#NewnoteForm').hide()
      $('#noteForm').show();

   };
}

function updateNote(){
   var theme = $("#Edittheme").val();
        var body = $("#Editbody").val();
      var flavour =   $("#Editflavour").val();
        var key = $("#Editkey").val();
 
        var t = db.transaction(["customerNotes"], "readwrite");
        var formatTime = d3.timeFormat("%d-%b-%Y %H:%M:00");
        date = formatTime(new Date); // "June 30, 2015"


        if(key === "") {
            t.objectStore("customerNotes")
                            .add({theme:theme,notes:body,flavour:flavour,created_at:date});
        } else {
            t.objectStore("customerNotes")
                            .put({theme:theme,notes:body,flavour:flavour,created_at:date,id:Number(key)});
        }
 
        t.oncomplete = function(event) {
            $("#Edittheme").val("");
            $("#Editflavour").val("");
            $("#Editkey").val("");
            $("#Editbody").val("");
            displayNotes();
           $('#noteForm').hide();           
        };
 
        return false;

   }

function showNoteForm(){
   $('#noteForm').hide()
   $('#NewnoteForm').show()
}



function addNewNotes(){


var theme = $("#theme").val();
var body = $("#body").val();
var flavour =   $("#flavour").val();


var t = db.transaction(["customerNotes"], "readwrite");
var formatTime = d3.timeFormat("%d-%b-%Y %H:%M:00");
date = formatTime(new Date); // "June 30, 2015"



 t.objectStore("customerNotes").add({theme:theme,notes:body,flavour:flavour,created_at:date});


t.oncomplete = function(event) {
    $("#key").val("");
    $("#title").val("");
    $("#body").val("");
    displayNotes();
   $('#noteForm').hide();           
};

return false;



}

