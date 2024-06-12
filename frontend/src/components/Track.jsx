import { UserContext } from "../contexts/UserContext";
import { useContext, useState, useEffect } from "react";
import Food from "./Food";
import Header from './Header';
import './styles.css';

const backendUrl = 'https://nutrify-webapp-qlr8.onrender.com';

export default function Track() {
    const loggedData = useContext(UserContext);

    const [foodItems, setFoodItems] = useState([]);
    const [food, setFood] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [searchClicked, setSearchClicked] = useState(false); 

    useEffect(() => {
        fetchAllFoodItems();
    }, []);

    const fetchAllFoodItems = () => {
        // fetch("http://localhost:8000/foods", {
        fetch(`${backendUrl}/foods`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${loggedData.loggedUser.token}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.message === undefined) {
                setFoodItems(data);
            } else {
                setFoodItems([]);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const handleSearchInputClick = () => {
        setSearchClicked(true); 
    };

    const handleSearchInputChange = (event) => {
        setSearchValue(event.target.value);
        if (event.target.value.length !== 0) {
            // fetch(`http://localhost:8000/foods/${event.target.value}`, {
            fetch(`${backendUrl}/foods/${event.target.value}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${loggedData.loggedUser.token}`
                }
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.message === undefined) {
                    setFoodItems(data);
                } else {
                    setFoodItems([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            setFoodItems([]);
        }
    };

    const handleFoodItemClick = (item) => {
        setFood(item);
        setSearchClicked(false);  
        setSearchValue(item.name); 
    };

    return (
        <>
            {/* <section className="container track-container"> */}
            <section className="container track-container back" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/burger-french-fries-plate-with-copy-space_23-2148235009.jpg?w=740&t=st=1718128904~exp=1718129504~hmac=527e618c8c22a6c1c419929de15931c70fbcc4aac627fc18b9d5400cdbe5fc46')" }}>
                <Header />
                <div className="search">
                    <input 
                        className="search-inp" 
                        onClick={handleSearchInputClick}
                        onChange={handleSearchInputChange}
                        value={searchValue}
                        type="search" 
                        placeholder="Search Food Item"
                    />
                    {searchClicked && ( 
                        <div className="search-results">
                            {foodItems.map((item) => (
                                <p 
                                    className="item" 
                                    onClick={() => handleFoodItemClick(item)}
                                    key={item._id}
                                >
                                    {item.name}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
                {food !== null && (
                    <div className="food-container">
                        <Food food={food} />
                    </div>
                )}
            </section>
        </>
    );
}
