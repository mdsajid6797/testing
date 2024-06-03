import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import HTMLFlipBook from "react-pageflip";
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EditDiaryPopup } from '../../components/popup/diarypopup';
import "../../css/Writingcenter.css";
import { deleteDiary, getBook, getDiary, getUser, saveWritingCenter } from '../../services/user-service';
import Deletebutton from '../my-estate/Deletebutton';


export function WritingcenterDiaryPopup() {
  const { books_id } = useParams();
  const [editingIndex] = useState(null);
  const [category, setCategory] = useState([]);
  // const editor = useRef();
  const getData = () => {
    let userId = getUser().id;
    getDiary(userId)
      .then((res) => {
        setCategory(res);
      })
      .catch((error) => {
        console.log("Error while fetching the data:", error);
      });
  };
  const handleRemove = (id) => {
    deleteDiary(id)
      .then(() => {
        getData();
        toast.success("Data deleted Successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
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
    const trimmedBase64 = base64String ? base64String.trim() : '';
    if (trimmedBase64) {
      setImageSrc(`data:image/jpeg;base64,${trimmedBase64}`);
    }
  };
  useEffect(() => {
    getData();
    base64ToImage();
  }, []);
  const [showPopup, setShowPopup] = useState(false);
  const handleToggle = () => {
    setShowPopup(false);
  };
  const toggleAddDiaryPage = () => {
    setShowPopup(!showPopup);
  };

  const URL = '../writing-center/';

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
  //    start searching the page in diary
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    // Filter the diary entries based on the search query
    const filteredEntries = category.filter((entry) => {
      const headingMatch = entry.heading.toLowerCase().includes(query.toLowerCase());
      const noteMatch = entry.note.toLowerCase().includes(query.toLowerCase());
      const createdDateMatch = entry.createdDate.toString().toLowerCase().includes(query.toLowerCase());

      if (headingMatch || noteMatch || createdDateMatch) {
        // Highlight matched content in heading, note, and created date
        const highlightedHeading = highlightSearchText(entry.heading, query);
        const highlightedNote = highlightSearchText(entry.note, query);
        const highlightedCreatedDate = highlightSearchText(entry.createdDate.toString(), query);

        // Update entry with highlighted content
        return {
          ...entry,
          heading: highlightedHeading,
          note: highlightedNote,
          createdDate: highlightedCreatedDate,
        };
      }
      return null;
    }).filter(Boolean);
    setSearchResults(filteredEntries);
  };
  function highlightSearchText(text, searchQuery) {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

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
    const bookId = books_id;
    getBook(bookId)
      .then((res) => {
        setCategories(res);
        console.log("Writing Center data 1:", res);
      })
      .catch((error) => {
        console.error("Error while fetching the data for Writing Center:", error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  // page opening  animation 
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  const EDITURL = "../writing-center/book-edit/";
  return (
      <div className={`your-component ${show ? "fade-in-element" : ""}`}>

        {/* <div className="diary-top-search-bar">
        <input
          type="text"
          placeholder='Search Here...'
          className="diary-search-bar"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <FontAwesomeIcon className='diary-search-icon' icon={faMagnifyingGlass} />
      </div> */}
        <div className='diary_home_page_base'>
          <div className="user_diary1">
            <div >
              <div className='user_diary_base_page'>
                <div className='diary-template'>
                  <HTMLFlipBook
                    className="album-web"
                    height={630}
                    // minHeight={630}
                    // maxHeight={630}
                    // size="stretch"
                    width={500}
                    minWidth={300}
                    maxWidth={500}
                    showCover={true}
                    flippingTime={800}
                    style={{ margin: "0 auto" }}
                    mobileScrollSupport={true}
                    maxShadowOpacity={0.5}

                  >
                    <div className="cover" data-density="hard">
                      <div className='diary_coverpage_image '>
                        <div>
                          <img
                            src={imageSrc || "/img/avtar.jpg"}
                            alt="avtar_image"
                          />
                        </div>
                        <div>
                          <h1 className='book_heading_title'>
                            {/* {book.bookTitle} */}
                          </h1>
                        </div>
                      </div>
                    </div>
                    {searchQuery !== '' ? (
                      searchResults.map((entry, index) => (
                        <div key={index} className="diary_page">
                          <div className='diary_page_content'>
                            <div className="diary_heading_page">
                              <div className='diary-heading-image'>
                                <img
                                  src={imageSrc || "/img/avtar.jpg"}
                                  alt="avtar_image"
                                />
                              </div>
                              <h1 className='diary_page_Heading' dangerouslySetInnerHTML={{ __html: highlightSearchText(entry.heading, searchQuery) }}></h1>
                              <div className='diary_date'>
                                <p>Created On: {entry.createdDate}</p>
                                <p>Updated On: {entry.updatedDate}</p>
                              </div>
                            </div>
                            <div className='diary_body_text' dangerouslySetInnerHTML={{ __html: highlightSearchText(entry.note, searchQuery) }}></div>
                          </div>
                          <div className="diary_buttons ">
                            {editingIndex === entry.id ? (
                              <button className="user_diary_entry_edit_btn">
                                Editing...
                              </button>
                            ) : (
                              <>
                                <Link
                                  to={`${EDITURL}${entry.id}`}
                                  className="user_diary_entry_edit_btn">
                                  <Tooltip title="You Can edit your page by clicking here">
                                    Edit
                                  </Tooltip>
                                </Link>
                              </>
                            )}
                            <Deletebutton
                              handleRemove={handleRemove}
                              Id={entry.id}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      categories.map((entry, index) => (
                        <div key={index} className="diary_page">
                          <div className='diary_page_content'>
                            <div className="diary_heading_page">
                              <div className='diary-heading-image'>
                                <img
                                  src={imageSrc || "/img/avtar.jpg"}
                                  alt="avtar_image"
                                />
                              </div>
                              <h1 className='diary_page_Heading'>{entry.heading}</h1>
                              <div className='diary_date'>
                                <p>Created On: {entry.createdDate}</p>
                                <p>Updated On: {entry.updatedDate}</p>
                              </div>
                            </div>
                            <div className='diary_body_text' dangerouslySetInnerHTML={{ __html: entry.note }}>
                            </div>
                          </div>
                          <div className="diary_buttons ">
                            {editingIndex === entry.id ? (
                              <button className="user_diary_entry_edit_btn">
                                Editing...
                              </button>
                            ) : (
                              <>
                                <Link
                                  to={`${EDITURL}${entry.id}/${books_id}`}
                                  className="edit-button" style={{marginRight:"10px"}}>
                                  <Tooltip title="You Can edit your page by clicking here">
                                  <FontAwesomeIcon icon={faPenToSquare} />
                                  </Tooltip>
                                </Link>
                                {/* <button
                                className="user_diary_entry_edit_btn"
                                onClick={() => handleToggleEditPopup(entry)}>
                              </button> */}
                              </>
                            )}
                            <Deletebutton
                              handleRemove={handleRemove}
                              Id={entry.id}
                            />
                          </div>
                          <div className='diary_index'>
                            <p>{index + 1}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </HTMLFlipBook>
                  {showEditPopup && editPopupEntry && (
                    <EditDiaryPopup
                      entry={editPopupEntry}
                      getData={getData}
                      onClose={handleToggleEditPopupClose}
                    />
                  )}
                </div>
                <div>
                  <Link
                    to={`${URL}${books_id}`}
                    className="user_diary_entry_add_btn">
                    <Tooltip title="Click here to add new page to your book">
                      <FontAwesomeIcon icon={faPlus} shake size="xl" />
                    </Tooltip>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
