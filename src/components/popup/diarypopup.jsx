import React from 'react';
import "../../css/autobiography_popup.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { editDiary, getDiary, getSingleDiary, getUser, getWritingCenter, saveDiary } from '../../services/user-service';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';
import "./../../css/popupcontent.css";
import { Tooltip } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

export function Diarypopup() {
    const { book_id } = useParams();
    const [inputText, setInputElement] = useState("");
    const [text, setText] = useState("I-Chest");
    const printText = () => {
        setText(inputText);
        setInputElement("");
    };

    const config = {
        placeholder: "Start Typing....."
    };

    const [editingIndex, setEditingIndex] = useState(null);
    const [data, setData] = useState({
        heading: "",
        note: "",
        user: {
            id: getUser().id,
        },
        writingCenter: {
            id: book_id,
        }
    });

    const [content, setContent] = useState('');
    const handleChanges = (event, property) => {
        setData({ ...data, [property]: event.target.value });
    };

    const handleEdit = (entry) => {
        setData({
            heading: entry.heading,
            note: entry.note,
            user: {
                id: getUser().id
            },
        });
        setContent(entry.note);
        setEditingIndex(entry.id);
    };

    const handleEditSave = (id) => {
        const updatedDiary = {
            heading: data.heading,
            note: content,
            user: {
                id: getUser().id
            },
            writingCenter: {
                id: book_id,
            }
        };

        editDiary(id, updatedDiary)
            .then((data) => {
                resetData();
            })
            .catch((error) => {
                
            });
    };

    const resetData = () => {
        setData({
            heading: "",
            note: "",
            user: {
                id: getUser().id
            }
        });
        setContent("");
    };


    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (editingIndex !== null) {
            handleEditSave(editingIndex);
            setEditingIndex(null);
        } else {
            data.note = content;
            if (data.heading === "" || data.note === "" || data.user.id === "") {
                toast.error("Please add all the fields... ");
                return;
            }
            saveDiary(data)
                .then((resp) => {
                    toast.success("Data Added Successfully", {
                        position: toast.POSITION.BOTTOM_CENTER,
                    });
                    resetData();
                    window.history.back();
                    // getData();
                })
                .catch((error) => {
      
                });
        }
    };

    const editor = useRef();
    return (
        <div className="popup">
            <div className="popup-content">
                {/* <button className="popup_btn" onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark} />
                </button> */}
                <section className="user_diary_add_note">
                    <form className="user_diary_add_note_form" id="entryForm" onSubmit={handleFormSubmit}>
                        <label htmlFor="entry-title" className="user_diary_label">
                            Enter Diary Title...
                        </label>
                        <input
                            type="text"
                            name="entry-title"
                            id="entry-title"
                            className="user_diary_entry_text_title"
                            placeholder="Title of the Entry ✏️"
                            value={data.heading}
                            onChange={(e) => handleChanges(e, "heading")}
                        />
                        <label htmlFor="entry" className="user_diary_label">
                            Start Your Creation...
                        </label>
                        <JoditEditor
                            ref={editor}
                            value={content}
                            config={config}
                            onBlur={newContent => setContent(newContent)}
                        />
                        <button className="user_diary_submit_btn" type="submit">
                            <Tooltip title="Click here to save diary">
                                {editingIndex !== null ? 'Save' : 'Submit'}
                            </Tooltip>
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}













// export default Diarypopup;
export function EditDiaryPopup() {

    const { page_id,books_id} = useParams();
    const [data, setData] = useState({
        heading: "",
        note: "",
        user: {
            id: getUser().id,
        },
        writingCenter: {
            id:books_id,

        }

    });
    // show data
    //   const [categories, setCategories] = useState([]);
    const fetchData = () => {
        getSingleDiary(page_id)
            .then((res) => {
                setData(res);

                setContent(res.note);
            })
            .catch((error) => {
                console.error("Error while fetching the data for Writing Center:", error);
            });
    };
    useEffect(() => {
        fetchData();
    }, []);

    const [content, setContent] = useState();
    const handleChanges = (event, property) => {
        setData({ ...data, [property]: event.target.value });
    };

    const handleEditSave = (event) => {
        event.preventDefault();
        const updatedDiary = {
            heading: data.heading,
            note: content,
            user: {
                id: getUser().id,
            },
            writingCenter: {
                id:books_id,
            }
        };

        editDiary(page_id, updatedDiary)
            .then(() => {
                fetchData();
                toast.success("Diary entry updated successfully", {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
                // onClose();
                window.history.back();
            })
            .catch((error) => {
                console.error("Error updating diary entry:", error);
            });
    };

    const editor = useRef();
    return (
        <div className="popup">
            <div className="popup-content">
                {/* <button className="popup_btn" >
                    <FontAwesomeIcon icon={faXmark} />
                </button> */}
                <section className="user_diary_add_note">
                    <form className="user_diary_add_note_form" onSubmit={handleEditSave}>
                        <label htmlFor="entry-title" className="user_diary_label">
                            Edit Diary Title...
                        </label>
                        <input
                            type="text"
                            name="entry-title"
                            className="user_diary_entry_text_title"
                            placeholder="Title of the Entry ✏️"
                            value={data.heading}
                            onChange={(e) => handleChanges(e, "heading")}
                        />
                        <label htmlFor="entry" className="user_diary_label">
                            Edit Your Diary...
                        </label>
                        <JoditEditor
                            ref={editor}
                            value={content}
                            onBlur={(newContent) => setContent(newContent)}
                        />
                        <button className="user_diary_submit_btn" type="submit">
                            <Tooltip title="Click here to save your edit">
                                Save
                            </Tooltip>
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}

