import React, { useEffect, useState, useRef, useCallback } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/fontawesome-free-solid";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";
import "./_stickyTab.scss";


// const menuList = [
//   {
//     link: "/health-clinics",
//     name: "Hospital/Clinics",
//   },
//   {
//     link: "/clinic-timing",
//     name: "Online Time Slots",
//   },
// ];

function StickyTab(props) {
  const history = useHistory()
  let menu_list = props.menuList
  const loca = useLocation()
  // console.log(loca);
  const [stickyClass, setStickyClass] = useState("relative");
  const [scrollValue, setScrollValue] = useState(0);
  const [totalScrollValue, setTotalScrollValue] = useState();
  const ref = useRef(null);
  const stickNavbar = () => {
    if (window !== undefined) {
      const windowHeight = window.scrollY;
      windowHeight > 30 ? setStickyClass("active1") : setStickyClass("wait");
    }
  };
  const scroll = useCallback((scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
    setScrollValue(ref.current.scrollLeft);
  }, []);

  const handleWheelScrolling = useCallback((event) => {
    event.preventDefault();
    if (event.deltaY > 0) {
      scroll(50);
    } else {
      scroll(-50);
    }
  }, [])

  const handleDragScrolling = useCallback((event) => {
    if (event.deltaY > 0) {
      scroll(50);
    } else {
      scroll(-50);
    }
  }, [])

  useEffect(() => {
    const navForScroll = document.getElementById("check");
    window.addEventListener("scroll", stickNavbar);
    navForScroll.addEventListener("wheel", handleWheelScrolling);
    navForScroll.addEventListener("click", handleDragScrolling);

    const checkElement = document.getElementById("check");
    setTotalScrollValue(checkElement.scrollWidth - checkElement.clientWidth);

    // removing our event listeners
    return () => {
      window.removeEventListener("scroll", stickNavbar);
      navForScroll.removeEventListener("wheel", handleWheelScrolling);
      navForScroll.removeEventListener("click", handleDragScrolling);
    };
  }, []);

  const hashChange = (link) => {
    window.history.pushState({}, "", link);
    history.replace({ pathname: loca.pathname, search: link });

    // history.pushState(null, null, link);
  }

  return (
    <section className={`stickyMenu ${stickyClass} d-none`}>
      <Container>
        <div>
          <Navbar expand="lg">
            {/* <button
              type="button"
              className="arrowBtn left"
              onClick={() => scroll(-50)}
            >
              {scrollValue > 0 && <FontAwesomeIcon icon={faAngleLeft} />}
            </button> */}

            <Nav id="check" className="m-auto" ref={ref}>
              {props?.type === "a"
                ? props?.menuList?.map((menu, index) => {
                  const { link, name } = menu;
                  // console.log(link, name);
                  return (
                    <li key={index}>
                      {/* <NavLink activeClassName="linkactive" to={{pathname: link, state: {type:props, menu:menu_list}}}> {name || ""} </NavLink> */}
                      {/* <a data-bs-target={link} role="tab" data-bs-toggle="tab" className={loca?.hash === link && "activeLink"}> {name || ""} </a> */}
                      <a onClick={() => hashChange(link)} className={loca?.search?.split('?')[1] === link || (typeof loca?.search?.split('?')[1] === 'undefined' && (name === "Medical History" || name === "Overview" || name === "About" || name === "Upcoming")) ? "activeLink" : ""}> {name || ""} </a>
                    </li>
                  );
                })
                : props?.menuList?.map((menu, index) => {
                  const { link, name, props } = menu;
                  return (
                    <li key={index}>
                      <NavLink activeClassName="linkactive" to={{ pathname: link, state: { type: props, clinic: [], menu: menu_list } }}> {name || ""} </NavLink>
                    </li>
                  );
                })}
            </Nav>
            {/* <button
              type="button"
              className="arrowBtn right"
              onClick={() => scroll(50)}
            >
              {scrollValue < totalScrollValue && (
                <FontAwesomeIcon icon={faAngleRight} />
              )}
            </button> */}
          </Navbar>
        </div>
      </Container>
    </section>
  );
}

export default React.memo(StickyTab);
