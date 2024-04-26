import React from "react";
import { useState, useEffect } from "react";
// let display = [];
const filterInput1 = (value) => {
  let filter = value.toUpperCase();
  let x = document.getElementById("all_notes");
  let tr = x.getElementsByClassName("show_note");
  for (let i = 0; i < tr.length; i++) {
    let a = tr[i];
    let txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
};
const Passwords = () => {
  let db = window.data_base;

  // For thr form
  const [noteDes, setNoteDes] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [valid, setValid] = useState(true);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDes, setUpdateDes] = useState("");
  const [updateValid, setUpdateValid] = useState(true);
  const [currentId, setCurrentId] = useState("");
  const [modal, setModal] = useState("modal hide");
  const [addmodal, setAddModal] = useState("modal hide");
  const characters1 =
    "T7P36LlcJK9jRkmrn5yFpMbGa1SWidswzOhVI0DZt NxCHoYBQ8uUAv4eg2EXfq";
  const characters2 =
    "AL9n2TS57RaIJgx8uqdXvYezMCpU1syH0wcKGNWE ikQO4Zlhbm3jD6tPVFrofB";
  const [display, setDisplay] = useState([]);

  const checkPassword = (db) => {
    if (db) {
      const localValue = dcrypt(
        localStorage.getItem("Safe-notes"),
        characters2
      );
      let storedValue = null;
      var tx = db.transaction("passkey", "readonly");
      var store = tx.objectStore("passkey");
      var request = store.openCursor();
      request.onsuccess = (e) => {
        var result = e.target.result;
        // if (!!result === false) {
        //   return;
        // }
        storedValue = dcrypt(result.value.text, characters1);
        if (storedValue.join("") === localValue.join("")) {
          console.log(true);
        } else {
          window.location.href = "/";
        }
      };
    }
  };

  useEffect(() => {
    const dbName = window.dbnewName;
    const dbVersion = window.dbVer;
    const request = indexedDB.open(dbName, dbVersion);
    //On Success (Every time called if any success)
    request.onsuccess = (e) => {
      const tempdb = e.target.result;
      db = tempdb;
      checkPassword(tempdb);
      checkValid();
    };
  }, []);

  const checkValid = () => {
    if (noteTitle.length > 2 && noteDes.length > 5) {
      setValid(false);
    } else {
      setValid(true);
    }
  };
  const checkUpdateValid = () => {
    if (updateTitle.length > 2 && updateDes.length > 5) {
      setUpdateValid(false);
    } else {
      setUpdateValid(true);
    }
  };
  const addNote = () => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let full_date = day + " - " + month + " - " + year;
    let newdata = encrypt(noteDes.replace(/\n/g, "<br/>"), characters1);
    const note = {
      title: noteTitle,
      desc: newdata.join(""),
      date: full_date,
    };

    const tx = db.transaction("passwords", "readwrite");
    const pNotes = tx.objectStore("passwords");
    pNotes.add(note);
    setAddModal("modal hide");
    setNoteTitle("");
    setNoteDes("");
    showNotes();
  };
  const showNotes = () => {
    setDisplay([]);
    if (db) {
      const tx = db.transaction(["passwords"], "readonly");
      const pNotes = tx.objectStore("passwords");
      const request = pNotes.openCursor();
      request.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          let olddata = dcrypt(cursor.value.desc, characters1);
          const note = {
            title: cursor.value.title,
            desc: olddata.join(""),
            id: cursor.value.id,
            date: cursor.value.date,
          };
          setDisplay((display) => [...display, note]);

          cursor.continue();
        }
      };
    }
  };
  const updateNote = () => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let full_date = day + " - " + month + " - " + year;
    let newdata = encrypt(updateDes.replace(/\n/g, "<br/>"), characters1);
    const unote = {
      id: currentId,
      title: updateTitle,
      desc: newdata.join(""),
      date: full_date,
    };
    const tx = db.transaction(["passwords"], "readwrite");
    const uNotes = tx.objectStore("passwords");
    let request = uNotes.put(unote);
    request.onsuccess = () => {
      setModal("modal hide");
      setUpdateTitle("");
      setUpdateDes("");
      setCurrentId("");
      showNotes();
    };
  };
  const hideModal = () => {
    setModal("modal hide");
  };
  const encrypt = (array, characters) => {
    let a = array;
    let b = [];
    for (let i = 0; i < a.length; i++) {
      if (i % 2 === 0) {
        let x = characters.indexOf(a[i]);
        if (x === -1) {
          b.push(a[i]);
        } else {
          b.push(characters[(x + i) % characters.length]);
        }
      }
    }
    for (let i = 0; i < a.length; i++) {
      if (i % 2 !== 0) {
        let x = characters.indexOf(a[i]);
        if (x === -1) {
          b.push(a[i]);
        } else {
          b.push(characters[(x + i) % characters.length]);
        }
      }
    }
    return b;
  };
  const dcrypt = (array, characters) => {
    let b = array;
    let c = [];
    let temp = [];
    let y = parseInt(b.length / 2 + 0.6);
    let count = b.length;
    y--;
    for (let i = 0; i <= y; i++) {
      if (count > 0) {
        temp.push(b[i]);
        count--;
      }
      if (count > 0) {
        temp.push(b[parseInt(y) + parseInt(i) + parseInt(1)]);
        count--;
      }
    }
    for (let k = 0; k < temp.length; k++) {
      let x = characters.indexOf(temp[k]);
      if (x === -1) {
        c.push(temp[k]);
      } else {
        c.push(
          characters[
            (characters.length + x - (k % characters.length)) %
              characters.length
          ]
        );
      }
    }
    return c;
  };
  return (
    <div>
      <div className="note_navbar">
        <button onClick={showNotes}>Show Passwords</button>
        <button
          onClick={() => {
            setAddModal("modal");
          }}
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>

      <div className="searchBar">
        <input
          type="text"
          placeholder="Search Password here..."
          onChange={(ev) => {
            filterInput1(ev.target.value);
          }}
        ></input>
      </div>
      <div className="all_notes" id="all_notes">
        {display.reverse().map((e, index) => (
          <div
            className="show_note animate__animated animate__fadeIn"
            key={e.id}
          >
            <div className="tag_no">{index + 1}</div>
            <h4>{e.title}</h4>
            <p dangerouslySetInnerHTML={{ __html: e.desc }}></p>

            <div className="note_footer">
              <button
                className="rem_btn"
                onClick={() => {
                  let transaction = db.transaction(["passwords"], "readwrite");
                  let request = transaction
                    .objectStore("passwords")
                    .delete(e.id);
                  request.onsuccess = () => {
                    showNotes();
                  };
                }}
              >
                <i className="fas fa-trash"></i>
              </button>
              <button
                className="edit_btn"
                onClick={() => {
                  setModal("modal");
                  setUpdateTitle(e.title);
                  setUpdateDes(e.desc.replace(/<br\/>/g, "\n"));
                  setCurrentId(e.id);
                }}
              >
                <i className="fas fa-pen"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Modal For Update */}
      <div className={modal}>
        <div className="cross" onClick={hideModal}>
          <i className="fas fa-times"></i>
        </div>
        <div className="modal_body">
          <div className="add_note">
            <h4>Update Password </h4>
            <input
              type="text"
              placeholder="Password title"
              onChange={(e) => {
                setUpdateTitle(e.target.value);
                checkUpdateValid();
              }}
              value={updateTitle}
            />
            <textarea
              rows="3"
              placeholder="Password description here. . ."
              onChange={(e) => {
                setUpdateDes(e.target.value);
                checkUpdateValid();
              }}
              value={updateDes}
            ></textarea>
            <button disabled={updateValid} onClick={updateNote}>
              Update
            </button>
          </div>
        </div>
      </div>
      {/* Modal For Add */}
      <div className={addmodal}>
        <div
          className="cross"
          onClick={() => {
            setAddModal("modal hide");
          }}
        >
          X
        </div>
        <div className="modal_body">
          <div className="add_note">
            <h4>Add Password </h4>
            <input
              type="text"
              placeholder="Password title"
              onChange={(e) => {
                setNoteTitle(e.target.value);
                checkValid();
              }}
              value={noteTitle}
            />
            <textarea
              rows="3"
              placeholder="Password description here. . ."
              onChange={(e) => {
                setNoteDes(e.target.value);
                checkValid();
              }}
              value={noteDes}
            ></textarea>
            <button disabled={valid} onClick={addNote}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Passwords;
