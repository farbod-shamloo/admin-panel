import styles from "./SearchBox.module.css";

import img from "../assets/farbod.jpg";

import { CiSearch } from "react-icons/ci";



function SearchBox({ searchTerm, handleSearchChange, username }) {



  return (
    <>
      <div className={styles.search_box}>
        <div className={styles.search_input}>
          <CiSearch />{" "}
          <input
            type="text"
            placeholder="جستجو کالا"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className={styles.container_manager}>
          
          <div className={styles.img}>
            <img src={img} alt="manager" />
          </div>
          <div className={styles.manager_information}>
            <p className={styles.name}>{username}</p>
            <p className={styles.act}>مدیر</p>
          </div>
          
        </div>
      </div>
    </>
  );
}

export default SearchBox;
