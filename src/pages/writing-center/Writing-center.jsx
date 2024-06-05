import {
    faPenToSquare,
    faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../css/writingcenterbooks.css";
import {
    deleteBook,
    editWritingCenter,
    getUser,
    getWritingCenter,
    saveWritingCenter
} from "../../services/user-service";
import { Del } from "../my-estate/Deletebutton";

function Writingcenter() {
  const handleRemove = (id) => {
    deleteBook(id)
      .then(() => {
        toast.error("Data deleted Successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        fetchData();
        console.log("Diary deleted successfully");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting diary:", error);
      });
  };
  const user = getUser();
  const [imageSrc, setImageSrc] = useState("");
  const base64ToImage = () => {
    const base64String = user.image;
    const trimmedBase64 = base64String ? base64String.trim() : "";
    if (trimmedBase64) {
      setImageSrc(`data:image/jpeg;base64,${trimmedBase64}`);
    }
  };

  // add data
  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (data.bookTitle === "") {
      toast.error("Please add all the fields... ");
      return;
    }
    saveWritingCenter(data)
      .then((resp) => {
        toast.success("Data Added Successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        fetchData();
        resetData();
      })
      .catch((error) => {
        console.log("error : ", error);
      });
  };
  const [data, setData] = useState({
    bookTitle: "",
  });
  const resetData = () => {
    setData({
      bookTitle: "",
    });
  };
  const handleBookChanges = (e, bookdetails) => {
    const value = e.target.value;
    setData((prevState) => ({
      ...prevState,
      [bookdetails]: value,
    }));
  };

  // show data
  const [categories, setCategories] = useState([]);

  const fetchData = () => {
    const userId = getUser().id;
    console.log("User ID:", userId);
    getWritingCenter(userId)
      .then((res) => {
        setCategories(res);
        console.log("Writing Center data 1:", categories); // Log the fetched data
        console.log("writing center data response: ", res);
      })
      .catch((error) => {
        console.error(
          "Error while fetching the data for Writing Center:",
          error
        );
      });
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };
  const BOOK = "../writing-center/book/";
  const navigate = useNavigate();
  const handleClick = (book, bookId) => {
    // console.log('URL:', url);
    // console.log('Book ID:', bookId);
    navigate(book + bookId);
  };

  // edit functinality
  const [editedBookTitle, setEditedBookTitle] = useState("");
  const [editingBookId, setEditingBookId] = useState(null);

  // Function to open the edit input field
  const handleEditClick = (bookId, bookTitle) => {
    setEditingBookId(bookId);
    setEditedBookTitle(bookTitle);
  };

  // Function to handle the submission of the edited book title
  const handleEditSubmit = (bookId) => {
    const updatedData = {
      id: bookId,
      bookTitle: editedBookTitle,
    };
    console.log("book id is :", bookId);
    editWritingCenter(bookId, updatedData)
      .then(() => {
        toast.success("Book Title Updated Successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        fetchData();
        setEditingBookId(null);
      })
      .catch((error) => {
        console.log("Error updating book title:", error);
      });
  };

  // page opening  animation
  const [show] = useState(true);

  useEffect(() => {
    fetchData();
    base64ToImage();
  }, []);

  return (
    <div className={`your-component ${show ? "fade-in-element" : ""}`}>
      <form
        onSubmit={handleFormSubmit}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className="add_book_box">
          <div className="addbook_inputbox">
            <input
              className="add_book_input_box"
              type="text"
              id="entry-title"
              placeholder="Add New Book... ✏️"
              value={data.bookTitle}
              onChange={(e) => handleBookChanges(e, "bookTitle")}
            />
          </div>
          <div className="addbook_btn">
            <button type="submit" className="user_diary_create_new_book_btn">
              <Tooltip title="Click here to add new book to your writing center">
                Create
              </Tooltip>
            </button>
          </div>
        </div>
      </form>
      {/* 
            <div className="diary-top-search-bar">
                <button className="user_diary_create_new_book_btn">
                onClick={() => toggleAddAotobiographyPage()}>
                Create new book
                </button>
                <input
                    type="text"
                    placeholder='Search Here...'
                    className="diary-search-bar"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                />
                <FontAwesomeIcon className='diary-search-icon' icon={faMagnifyingGlass} />
            </div> */}
      {/* <div className="user_diary" style={{ display: "flex", flexDirection: "row", overflow: "auto" }} > */}

      <div className="user_diary">
        {categories.map((book) => (
          <div className="book_card_page" key={book.id}>
            <div className="book_card">
              <div
                className="book_card_detalis"
                onClick={() => handleClick(BOOK, book.id)}
              >
                <div className="book_card_image">
                  <img src={imageSrc || "/img/avtar.jpg"} alt="avatar_image" />
                </div>
                <div className="book_card_title">
                  {editingBookId === book.id ? (
                    <div className="edit_btn_for_booktitle">
                      <input
                        className="edit_btn_for_booktitle_inputbox"
                        type="text"
                        value={editedBookTitle}
                        onChange={(e) => setEditedBookTitle(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        className="edit_btn_for_booktitle_btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditSubmit(book.id);
                        }}
                      >
                        {" "}
                        <Tooltip title="click here to save your edit ">
                          <FontAwesomeIcon
                            icon={faSquareCheck}
                            style={{ color: "#15ca12" }}
                          />
                        </Tooltip>
                      </button>
                    </div>
                  ) : (
                    <h1 className="book_card_heading_title">
                      {truncateText(book.bookTitle, 10)}
                    </h1>
                  )}
                </div>
              </div>
              <div className="book_card_action_buttons">
                <div>
                  {/* <button
                                            className='book_card_action_delete_buttons'>
                                             <Tooltip title="click here to delete your diary">
                                            <FontAwesomeIcon icon={faTrashCan} />
                                            </Tooltip>
                                        </button> */}
                  <Del handleRemove={handleRemove} Id={book.id} />
                </div>
                <div>
                  <button
                    className="book_card_action_edit_buttons"
                    onClick={() => handleEditClick(book.id, book.bookTitle)}
                  >
                    <Tooltip title="click here to edit diary title">
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </Tooltip>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* </div> */}
    </div>
  );
}
export default Writingcenter;
