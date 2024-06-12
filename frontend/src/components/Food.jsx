import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import './food.css';
const backendUrl = 'https://nutrify-webapp-qlr8.onrender.com';

export default function Food(props) {
    const [eatenQuantity, setEatenQuantity] = useState(100);
    const [food, setFood] = useState({});
    const [foodInitial, setFoodInitial] = useState({});
    const [isQuantityEntered, setIsQuantityEntered] = useState(false);
    const [buttonState, setButtonState] = useState("default");
    let loggedData = useContext(UserContext);

    useEffect(() => {
        setFood(props.food);
        setFoodInitial(props.food);
    }, [props.food]);

    function calculateMacros(event) {
        if (event.target.value.length !== 0) {
            let quantity = Number(event.target.value);
            setEatenQuantity(quantity);
            setIsQuantityEntered(true);

            let copyFood = { ...food };

            copyFood.protein = ((foodInitial.protein * quantity) / 100).toFixed(4);
            copyFood.carbohydrates = ((foodInitial.carbohydrates * quantity) / 100).toFixed(4);
            copyFood.fat = ((foodInitial.fat * quantity) / 100).toFixed(4);
            copyFood.fiber = ((foodInitial.fiber * quantity) / 100).toFixed(4);
            copyFood.calories = ((foodInitial.calories * quantity) / 100).toFixed(4);

            setFood(copyFood);
        } else {
            setIsQuantityEntered(false);
        }
    }

    function trackFoodItem() {
        let trackedItem = {
            userId: loggedData.loggedUser.userid,
            foodId: food._id,
            details: {
                protein: food.protein,
                carbohydrates: food.carbohydrates,
                fat: food.fat,
                fiber: food.fiber,
                calories: food.calories
            },
            quantity: eatenQuantity
        };

        // fetch("http://localhost:8000/track", {
        fetch(`${backendUrl}/track`, {
            method: "POST",
            body: JSON.stringify(trackedItem),
            headers: {
                "Authorization": `Bearer ${loggedData.loggedUser.token}`,
                "Content-Type": "application/json"
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            setButtonState("success");
            setTimeout(() => setButtonState("default"), 3000);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return (    
        <div className="food">
            <div className="food-img">
                <img className="food-image" src={food.imageUrl} alt={food.name} />
            </div>
            <h3>{food.name} ({food.calories} Kcal for {eatenQuantity}G)</h3>
            <div className="nutrient">
                <p className="n-title">Protein</p>
                <p className="n-value">{food.protein}g</p>
            </div>
            <div className="nutrient">
                <p className="n-title">Carbs</p>
                <p className="n-value">{food.carbohydrates}g</p>
            </div>
            <div className="nutrient">
                <p className="n-title">Fat</p>
                <p className="n-value">{food.fat}g</p>
            </div>
            <div className="nutrient">
                <p className="n-title">Fibre</p>
                <p className="n-value">{food.fiber}g</p>
            </div>
            <div className="nutrient">
                <p className="n-title">Calories</p>
                <p className="n-value">{food.calories}g</p>
            </div>
            <div className="track-control">
                <input 
                    type="number" 
                    onChange={calculateMacros} 
                    className="inp" 
                    placeholder="Quantity in Gms" 
                    min="1"
                />
                <button 
                    className={`btn ${!isQuantityEntered ? 'disabled' : ''} ${buttonState === "success" ? 'success' : ''}`} 
                    onClick={trackFoodItem} 
                    disabled={!isQuantityEntered}
                >
                    {buttonState === "success" ? 'Tracked' : 'Track'}
                </button>
            </div>
        </div>
    );
}
