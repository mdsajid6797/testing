import React, { useState } from 'react';
import "../../css/autobiography_popup.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { editAutobiography, getUser, saveAutobiography } from '../../services/user-service';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import JoditEditor from 'jodit-react';
import { Tooltip } from '@mui/material';
export function AutobiographyPopup({ getData, onBack }) {

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
        content: "",
        user: {
            id: getUser().id
        }
    });
    const [content1, setContent1] = useState('');
    // const handleChanges = (event, property) => {
    //     setData({ ...data, [property]: event.target.value });
    // };

    const handleEdit = (entry) => {
        setData({

            content: entry.content,
            user: {
                id: getUser().id
            }
        });
        setContent1(entry.content);
        setEditingIndex(entry.id);
    };
    const handleEditSave = (id) => {
        const updatedDiary = {

            content: content1,
            user: {
                id: getUser().id
            }
        };

        editAutobiography(id, updatedDiary)
            .then((data) => {
                getData();
                resetData();
            })
            .catch((error) => {
                console.error("Error updating Autobiography entry:", error);
            });
    };

    const resetData = () => {
        setData({
            content: "",
            user: {
                id: getUser().id
            }
        });
        setContent1("");
    };
    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (editingIndex !== null) {
            handleEditSave(editingIndex);
            setEditingIndex(null);
        } else {
            data.content = content1;
            if (data.content === "" || data.user.id === "") {
                toast.error("Please add all the fields... ");
                return;
            }
            saveAutobiography(data)
                .then((resp) => {
                    toast.success("Data Added Successfully", {
                        position: toast.POSITION.BOTTOM_CENTER,
                    });
                    resetData();
                    getData();
                    onBack();
                })
                .catch((error) => {
                   
                });
        }
    };
    const editor = useRef();
    return (
        <div className="popup">
            <div className="popup-content">
                <button className="popup_btn" onClick={onBack}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                <form className="user_diary_add_note_form" id="entryForm" onSubmit={handleFormSubmit}>
                    <div style={{ width: "100%", }}>
                        <JoditEditor
                            ref={editor}
                            value={content1}
                            config={config}
                            onBlur={newContent => setContent1(newContent)}
                        />
                    </div>
                    <button className="user_diary_submit_btn" type="submit">
                        {editingIndex !== null ? 'Save' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
}



export function EditAutobiographyPopup({ entry, getData, onClose }) {
    const [data, setData] = useState({
        content: entry.content,
        user: {
            id: getUser().id,
        },
    });
    const [content1, setContent1] = useState(entry.content);
    const handleChanges = (event, property) => {
        setData({ ...data, [property]: event.target.value });
    };
    const handleEditSave = () => {
        const updatedDiary = {
            content: content1,
            user: {
                id: getUser().id
            }
        };

        editAutobiography(entry.id, updatedDiary)
            .then(() => {
                getData();
                toast.success("Autobiography updated successfully", {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
                onClose();

            })
            .catch((error) => {
                console.error("Error updating diary entry:", error);
                toast.success("Autobiography not updated", {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
            });
    };
    const editor = useRef();
    return (
        <div className="popup">
            <div className="popup-content">
                <button className="popup_btn" onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                <form className="user_diary_add_note_form" id="entryForm" onSubmit={handleEditSave}>
                    <div style={{ width: "100%", }}>
                        <JoditEditor
                            ref={editor}
                            value={content1}
                            onBlur={newContent => setContent1(newContent)}
                        />
                    </div>
                    <button className="user_diary_submit_btn" type="submit">
                            <Tooltip title="Click here to save your edit">
                                Save
                            </Tooltip>
                        </button>
                </form>
            </div>
        </div>
    );
}
