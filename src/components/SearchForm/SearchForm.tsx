import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useState } from "react";
import { setSearchInput } from "../../reducers/searchReducer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import styles from "./SearchForm.module.scss";

const SearchForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchInput } = useAppSelector((state) => state.search);
  const [isFocus, setIsFocus] = useState<boolean>(false);

  return (
    <>
      <section className={styles.search}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          onFocus={() => setIsFocus(true)}
          onBlur={(e) =>
            !e.currentTarget.contains(e.relatedTarget) && setIsFocus(false)
          }
        >
          <SearchRoundedIcon />
          <input
            type="search"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => {
              dispatch(setSearchInput(e.target.value));
            }}
          />
          {searchInput && isFocus && (
            <button type="reset" onClick={() => dispatch(setSearchInput(""))}>
              <CloseRoundedIcon />
            </button>
          )}
        </form>
      </section>
      <div className={styles.searchMarginBottom} />
    </>
  );
};

export default SearchForm;
