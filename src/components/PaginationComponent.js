import React, {useEffect, useState} from "react";
import "./style.css";

const renderData = (data) => {
    return (
        <ul>
            {data && data.map((todo, index) => {
                return <li key={index}>{todo.title}</li>;
            })}
        </ul>
    );
};

function PaginationComponent() {

    const [data, setData] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const [pageNumberLimit, setPageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id))
    }

    const pages = [];
    for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
        pages.push(i)
    }

    const indexOfLastItem = currentPage * itemsPerPage; // 1 * 5 / 2 * 5
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 5 - 5 / 10 - 5
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem); // slice(first, last) first[index] 부터 last[index-1] 까지

    const renderPageNumbers = pages.map((number) => {
        if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
            return (
                <li
                    key={number}
                    id={number}
                    onClick={handleClick}
                    className={currentPage === number ? 'active' : null}
                >
                    {number}
                </li>
            );
        } else {
            return null;
        }
    })

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then((response) => response.json())
            .then((json) => setData(json));
    }, []);

    const handleNexButton = () => {
        setCurrentPage(currentPage + 1);
        if (currentPage + 1 > maxPageNumberLimit) {
            setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
            setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        }
    }

    const handlePrevButton = () => {
        setCurrentPage(currentPage - 1);
        if ((currentPage - 1) % pageNumberLimit === 0) {
            setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
            setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }
    }

    let pageIncrementButton = null;
    if (pages.length > maxPageNumberLimit) {
        pageIncrementButton = <li onClick={handleNexButton}> &hellip; </li>
    }

    let pageDecrementButton = null;
    if (minPageNumberLimit >= 1) {
        pageDecrementButton = <li onClick={handlePrevButton}> &hellip; </li>
    }

    const handleLoadMore = () => {
        setItemsPerPage(itemsPerPage + 5);
    }

    return (
        <>
            <h1>Todo List</h1> <br/>
            {renderData(currentItems)}
            <ul className="pageNumbers">
                <li>
                    <button
                        onClick={handlePrevButton}
                        disabled={currentPage === pages[0] ? true : false}
                    >
                        prev
                    </button>
                </li>
                {pageDecrementButton}
                {renderPageNumbers}
                {pageIncrementButton}
                <li>
                    <button
                        onClick={handleNexButton}
                        disabled={currentPage === pages[pages.length - 1] ? true : false}
                    >
                        next
                    </button>
                </li>
            </ul>
            <button onClick={handleLoadMore} className="loadMore">Load More</button>
        </>
    );

}

export default PaginationComponent;