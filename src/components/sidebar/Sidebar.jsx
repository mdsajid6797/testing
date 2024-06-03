import { faBitcoin } from "@fortawesome/free-brands-svg-icons";
import { faArrowTrendUp, faBuildingColumns, faCarSide, faCircleDollarToSlot, faCreditCard, faDollarSign, faEarthAmericas, faFileInvoiceDollar, faGem, faHandHoldingDollar, faHouseFlag, faKey, faLock, faMoneyCheckDollar, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { AiTwotoneBank } from "react-icons/ai";
import { FaBars, FaBook } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { MdRealEstateAgent } from "react-icons/md";
import { NavLink } from "react-router-dom";
import "../../css/resize.css";
import '../../css/responsive.css';
import { getUser } from "../../services/user-service";
import SidebarMenu from "./SidebarMenu";
const routes = [
  {
    id: "1",
    path: "/",
    name: "My Assets",
    icon: <MdRealEstateAgent />,
    subRoutes: [
      {
        id: "2",
        path: "/my-estate/real-estate",
        name: "Real Estate ",
        icon: <FontAwesomeIcon icon={faHouseFlag} />
      },
      {
        id: "3",
        path: "/my-estate/banks",
        name: "Banks",
        icon: <AiTwotoneBank />,
      },
      {
        id: "4",
        path: "/my-estate/investments",
        name: "Investments",
        icon: <FontAwesomeIcon icon={faArrowTrendUp} />
      },
      {
        id: "5",
        path: "/my-estate/crypto",
        name: "Crypto Assest",
        icon: <FontAwesomeIcon icon={faBitcoin} />
      },
      {
        id: "6",
        path: "/my-estate/jewelry",
        name: "Jewelry",
        icon: <FontAwesomeIcon icon={faGem} />
      },
      {
        id: "7",
        path: "/my-estate/insurances",
        name: "Life Insurances",
        icon: <FontAwesomeIcon icon={faUserShield} />
      },
      {
        id: "8",
        path: "/my-estate/vehicles",
        name: "Vehicles",
        icon: <FontAwesomeIcon icon={faCarSide} />
      },
      {
        id: "10",
        path: "/my-estate/income",
        name: "Income",
        icon: <FontAwesomeIcon icon={faMoneyCheckDollar} />
      },
      {
        id: "19",
        path: "/my-estate/other-assests",
        name: "Other Assests",
        icon: <FontAwesomeIcon icon={faCircleDollarToSlot} />
      },
      {
        id: "20",
        path: "/my-estate/International_assets",
        name: "International Assests",
        icon: <FontAwesomeIcon icon={faEarthAmericas} />,

      }
    ],
  },
  {
    id: "11",
    path: "/liabilities",
    name: "Liabilities",
    icon: <FontAwesomeIcon icon={faCreditCard} />,
    exact: true,
    subRoutes: [
      {
        id: "12",
        path: "/liabilities/credit-card",
        name: "Credit Cards ",
        icon: <FontAwesomeIcon icon={faCreditCard} />,
      },
      {
        id: "13",
        path: "/liabilities/loan",
        name: "Bank Loan",
        icon: <FontAwesomeIcon icon={faBuildingColumns} />
      },
      {
        id: "14",
        path: "/liabilities/mortgage",
        name: "Mortgage",
        icon: <FontAwesomeIcon icon={faHandHoldingDollar} />
      },
      {
        id: "15",
        path: "/liabilities/lcredit",
        name: "Line of Credit",
        icon: <FontAwesomeIcon icon={faDollarSign} />
      },
      {
        id: "16",
        path: "/liabilities/ploan",
        name: "Personal loan",
        icon: <FontAwesomeIcon icon={faFileInvoiceDollar} />
      },
    ],
  },
  // {
  //   id: "19",
  //   path: "/credential",
  //   name: "Credential",
  //   icon: <FontAwesomeIcon icon={faKey} />,
  //   exact: true,
  //   subRoutes: [
  //     {
  //       id: "17",
  //       path: "/credential/credentials",
  //       name: "Credentials",
  //       icon: <FontAwesomeIcon icon={faLock} />
  //     },
  //   ]
  // },
  {
    id: "18",
    path: "/writing-center",
    name: "Writing Center ",
    icon: <FaBook />,
    exact: true,

  },
];

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    if (isOpen) {
      setSidebarWidth(45);
    } else {
      setSidebarWidth(185);
    }
    setIsOpen(!isOpen);
  };

  let role = getUser().role.toLowerCase();
  const showAnimation = {
  };

  const sidebarRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(185);

  const startResizing = React.useCallback((mouseDownEvent) => {
    setIsResizing(true);
  }, []);

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = React.useCallback(
    (mouseMoveEvent) => {
      if (isResizing) {
        setSidebarWidth(
          mouseMoveEvent.clientX -
          sidebarRef.current.getBoundingClientRect().left
        );
      }
    },
    [isResizing]
  );

  React.useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <>
      <div >
        <div className="sideplusmain">
          <motion.div
            ref={sidebarRef}
            style={{ width: isOpen ? sidebarWidth : 0 }}
            onMouseDown={(e) => e.preventDefault()}
            className={`sidebar resizable ${isOpen ? 'opened' : ''}`}
          >
            <div className="app-sidebar-content ">
              <div className="top_section" >
                <AnimatePresence>
                  {isOpen && (
                    <motion.h1
                      variants={showAnimation}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      className="logo"
                    >
                      
                    </motion.h1>
                  )}
                </AnimatePresence>

                
                <div className="bars" >
                  {isOpen && (
                    <ImCross onClick={toggle} />
                  )}
                  {!isOpen && (
                    <FaBars onClick={toggle} />
                  )}

                </div>
              </div>
              <section className="routes" >
                {routes.map((route, index) => {
                  if (route.subRoutes) {
                    return (
                      <SidebarMenu
                        key={route.id}
                        setIsOpen={setIsOpen}
                        route={route}
                        showAnimation={showAnimation}
                        isOpen={isOpen}
                      />
                    );
                  }

                  return (
                    <NavLink
                      key={route.id}
                      to={"/" + role + route.path}
                      //key={index}
                      className="link"
                      // activeClassName="active"
                    >
                      <div className="icon">{route.icon}</div>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div

                            variants={showAnimation}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            className="link_text"
                          >
                            {route.name}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </NavLink>
                  );
                })}
              </section>
            </div>
            {isOpen && (
              <div
                className="app-sidebar-resizer opened"
                onMouseDown={startResizing}
              ></div>
            )}
          </motion.div>
          
          <main className={isOpen ? "test1" : "test"} onMouseMove={resize} onMouseUp={stopResizing}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default SideBar; 