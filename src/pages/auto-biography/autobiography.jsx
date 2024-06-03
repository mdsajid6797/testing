import JoditEditor from 'jodit-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { AutobiographyPopup, EditAutobiographyPopup } from '../../components/popup/autobiographypopup';
import "../../css/autobiography.css";
import { deleteAutobiography, editAutobiography, getAutobiography, getUser, saveAutobiography } from '../../services/user-service';
import Deletebutton from '../my-estate/Deletebutton';


function Autobiography() {
    const [content1, setContent1] = useState('');
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
    const [category, setCategory] = useState([]);

    const handleChanges = (event, property) => {
        setData({ ...data, [property]: event.target.value });
    };

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
                console.error("Error updating diary entry:", error);
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
                    toast.success("Data Added !!", {
                        position: toast.POSITION.BOTTOM_CENTER,
                    });
                    resetData();
                    getData();
                })
                .catch((error) => {
                   
                });
        }
    };

    const editor = useRef();
    const getData = () => {
        let userId = getUser().id;

        getAutobiography(userId)
            .then((res) => {
                setCategory(res);
            })
            .catch((error) => {
                
            });
    };
    const handleRemove = (id) => {
        deleteAutobiography(id)
            .then(() => {
                getData();
               
            })
            .catch((error) => {
                
            });
    };
    useEffect(() => {
        getData();
    }, []);
    const [showPopup, setShowPopup] = useState(false);
    const handleToggle = () => {
        setShowPopup(false);
    };
    const toggleAddAotobiographyPage = () => {
        setShowPopup(!showPopup);
    };
    // start for editing props
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editPopupEntry, setEditPopupEntry] = useState(null);
    const handleToggleEditPopup = (entry) => {
        setEditPopupEntry(entry);
        setShowEditPopup(true);
    };
    const handleToggleEditPopupClose = () => {
        setEditPopupEntry(null);
        setShowEditPopup(false);
    };


    const user = getUser();
    const [imageSrc, setImageSrc] = useState("");

    const base64ToImage = () => {
        const base64String = user.image;
        const trimmedBase64 = base64String ? base64String.trim() : '';
        if (trimmedBase64) {
            setImageSrc(`data:image/jpeg;base64,${trimmedBase64}`);
        }
    };
    useEffect(() => {
        getData();
        base64ToImage();
    }, []);
    return (
        <>
            <div className="App">
                <main className="App_main" style={{
                    display: "flex"
                    , flexDirection: "column"
                }}>
                    {/* <form className="user_diary_add_note_form" id="entryForm" onSubmit={handleFormSubmit}>
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
                    </form> */}
                    <div className='autobiography_Show_content'>
                        <button className="user_autobiography_entry_view_btn"
                            onClick={() => toggleAddAotobiographyPage()}>
                            Create
                        </button> 
                        <section className="user_autobiography_add_notedisplay">
                            <div className="user_autobiography_reasult" >

                                {category.map((entry, index) => (
                                    <div key={index} className="user_autobiography_single_entry" >
                                        <h3 className="user_autobiography_single_entry_heading">
                                            <p className="user_autobiography_single_entry_date">
                                                Created On: {entry.createdDate}
                                            </p>
                                        </h3>
                                        <div className='autobiography-display-background'>
                                            <img className='autobiography-display-image'
                                                src={entry.displayimage|| "/img/Paper Airplane.gif"}
                                                alt="avtar_image"
                                            />
                                            <img className='autobiography-profile-image'
                                                src={imageSrc || "/img/avtar.jpg"}
                                                alt="avtar_image"
                                            />
                                        </div>

                                        <div
                                            className="user_autobiography_single_entry_text"
                                            dangerouslySetInnerHTML={{ __html: entry.content }}
                                        ></div>

                                        <div className="user_autobiography_buttons">
                                            {/* <button
                                                className="user_autobiography_entry_view_btn"
                                                onClick={() => togglePopup(entry)}
                                            >
                                                View
                                            </button> */}

                                            {editingIndex === entry.id ? (
                                                <button style={{ width: "180px" }}
                                                    className="user_autobiography_entry_edit_btn">
                                                    Editing in progress...
                                                </button>
                                            ) : (
                                                <button style={{ width: "180px" }}
                                                    className="user_autobiography_entry_edit_btn"
                                                    onClick={() => handleToggleEditPopup(entry)}
                                                >
                                                    Continue Writing ...
                                                </button>
                                            )}
                                            <Deletebutton
                                                handleRemove={handleRemove}
                                                Id={entry.id}
                                            />
                                        </div>

                                        <p className="user_autobiography_single_updated_date">
                                            Edited On : {entry.updatedDate}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                        {showPopup &&
                            <AutobiographyPopup
                                getData={getData}
                                onBack={handleToggle}
                            />
                        }
                        {showEditPopup && editPopupEntry && (
                            <EditAutobiographyPopup
                                entry={editPopupEntry}
                                getData={getData}
                                onClose={handleToggleEditPopupClose}
                            />
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
export default Autobiography;