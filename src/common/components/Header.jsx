import style from "./Header.module.css";
import Button from "./Button";
import { Link } from "react-router";
import ServiceLogo from "./ServiceLogo";
import { useEffect, useRef, useState } from "react";
import searchStyle from "./Search.module.css";
import { hookBookList } from "@hooks/bookList.hook.js";
import { searchBooks } from "@utils/searchBooks.js";

function HeaderBtn({ type, children }) {
  const [clicked, setClicked] = useState(false);
  const rootRef = useRef(null);
  const isSearch = type === "search";
  const [books, setBooks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const searchInputRef = useRef(null);
  const hasSearchResult = searchQuery.length > 0;
  const buttonClassName = `${style["header-btn"]} ${
    isSearch && clicked ? style["search-active"] : ""
  }`;
  useEffect(() => {
    if (!isSearch) {
      return;
    }
    const getBooks = async () => {
      const data = await hookBookList();
      setBooks(data);
    };
    getBooks();

    const handleOutsideClick = (event) => {
      if (!rootRef.current || rootRef.current.contains(event.target)) {
        return;
      }
      setClicked(false);
      setSearchText("");
      setSearchQuery([]);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    fetch("/alarm_data.json")
      .then((response) => response.json())
      .then((response) => {
        console.log(response.alarms);
        setAlarms(response.alarms);
      });
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isSearch]);

  useEffect(() => {
    if (clicked) searchInputRef.current?.focus();
  }, [clicked]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchText(query);

    if (!query.trim()) {
      setSearchQuery([]);
      return;
    }
    const res = searchBooks(books, query);
    setSearchQuery(res);
  };

  const handleResultClick = () => {
    setClicked(false);
    setSearchText("");
    setSearchQuery([]);
  };
  return (
    <div ref={rootRef}>
      <div style={{ position: "relative" }}>
        <Button
          className={buttonClassName}
          onClick={() => {
            // 검색 모드일 때는 이미 열린 상태(clicked === true)라면 버튼 클릭으로 닫지 않음
            if (isSearch) {
              if (!clicked) setClicked(true);
            }
          }}>
          <div className={style["header-icon-wrap"]}>
            <img
              src={`/${type}.svg`}
              alt={type}
              className={style["header-icon"]}
            />
            {isSearch && (
              <input
                ref={searchInputRef}
                type="text"
                className={style["header-input"]}
                value={searchText}
                onChange={handleSearchChange}
                placeholder="제목 혹은 저자를 검색하세요"
              />
            )}
          </div>
          <span className={`${style["header-btn-text"]}`}>{children}</span>
        </Button>

        {searchText.trim() && (
          <ul className={searchStyle.searchResult}>
            {hasSearchResult ? (
              searchQuery.map((book) => (
                <li key={book.id}>
                  <Link
                    className={searchStyle.resultLink}
                    onClick={handleResultClick}
                    to={`/books/${book.id}`}>
                    <span>{book.title}</span>
                    <span>{book.author}</span>
                  </Link>
                </li>
              ))
            ) : (
              <li className={searchStyle.resultLink}>
                <span>찾으시는 검색어 결과가 없습니다.</span>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <header>
      <Link to={"/"}>
        <ServiceLogo />
      </Link>
      <div className={style.btBox}>
        <HeaderBtn type="search">검색</HeaderBtn>
        <HeaderBtn type="alarm">알림</HeaderBtn>
      </div>
    </header>
  );
}

export default Header;
