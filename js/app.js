var node = {
    form: document.getElementById('create-note-form'),
    successMsg: document.getElementById('success-msg'),
    notes: document.getElementById('user-notes'),
    search: document.getElementById('search'),
    chip: document.getElementById('chip'),
}

//allocate space in local storage
var ls = new LS('notes');
window.onload = function () {
    node.form.addEventListener("submit", function (e) {
        e.preventDefault();
        searching = false;
        var note = this.note_text.value;
        if (note != '') {
            ls.addItem(note);
            showMsg("Notes saved successfully");
            view.render(ls.getAllItems());
        }
    });
    node.search.addEventListener('input', function () {
        var self = this;
        if (this.value.length >= 3) {
            setTimeout(function () {
                view.render(ls.searchByText(self.value.toLowerCase()));
            }, 0);
        } else {
            view.render(ls.getAllItems());
        }
    });
    view.render(ls.getAllItems());
}

function showMsg(msg) {
    node.chip.innerHTML = msg;
    node.chip.classList.add("show");
    setTimeout(function () {
        node.chip.classList.remove("show");
    }, 3000);
}

function deleteNode(noteId) {
    if (confirm("Sure to delete?")) {
        ls.deleteItemById(noteId);
        view.render(ls.getAllItems());
        showMsg("Note deleted successfully");
    }
}
function addNote(noteId) {
    var note = prompt("Please enter note");
    if (note != null) {
        if (ls.addChildItem(noteId, note)) {
            view.render(ls.getAllItems());
            showMsg("child notes saved successfully");
        }
    }
}
function edit(elem, noteId) {
    elem.setAttribute("contenteditable", "true");
    elem.setAttribute("tabindex", "-1");
    elem.focus();

    this.addEventListener('focusout', function () {
        var updatedNote = elem.innerHTML;
        elem.setAttribute("contenteditable", "false");
        ls.updateItemValue(updatedNote, noteId);
        view.render(ls.getAllItems());
        showMsg("Notes updated successfully");
    });
}
var view = {
    render: function (data) {
        node.notes.innerHTML = this.getNoteMarkup(data);
    },
    getNoteMarkup: function (notes) {
        var genrateMarkup = function (notes) {
            var notesMarkup = '';
            for (var i = 0; i < notes.length; i++) {
                var note = notes[i];
                notesMarkup += '<li id="' + note.id + '">';
                notesMarkup += '<div><p title="Double click to edit." ondblclick="edit(this,\'' + note.id + '\')" class="note">' + note.item + '</p>';
                notesMarkup += '<div class="action"><button onclick="deleteNode(\'' + note.id + '\')"></button>';
                notesMarkup += '<button onclick="addNote(\'' + note.id + '\')"></button></div></div>';
                if (note.child instanceof Array) {
                    notesMarkup += '<ul>' + genrateMarkup(note.child) + '</ul>';
                }
                notesMarkup += '</li>';
            }
            return notesMarkup;
        }
        return genrateMarkup(notes);
    },
}
