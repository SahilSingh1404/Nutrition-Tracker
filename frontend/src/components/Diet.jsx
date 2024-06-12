import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import Header from './Header';
import './diet.css';
import { FaTimes } from 'react-icons/fa';

const backendUrl = 'https://nutrify-webapp-qlr8.onrender.com';

export default function Diet() {
    const loggedData = useContext(UserContext);
    const [items, setItems] = useState([]);
    const [date, setDate] = useState(new Date());
    const [total, setTotal] = useState({
        totalCaloreis: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFats: 0,
        totalFiber: 0
    });

    useEffect(() => {
        // Fetch data only if date is selected
        if (date !== null) {
            // Convert the date to IST
            const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
            // fetch(`http://localhost:8000/track/${loggedData.loggedUser.userid}/${istDate.getMonth() + 1}-${istDate.getDate()}-${istDate.getFullYear()}`, {
            fetch(`${backendUrl}/track/${loggedData.loggedUser.userid}/${istDate.getMonth() + 1}-${istDate.getDate()}-${istDate.getFullYear()}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${loggedData.loggedUser.token}`
                }
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setItems(data);
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            setItems([]);
            setTotal({
                totalCaloreis: 0,
                totalProtein: 0,
                totalCarbs: 0,
                totalFats: 0,
                totalFiber: 0
            });
        }
    }, [date, loggedData.loggedUser.userid, loggedData.loggedUser.token]);

    useEffect(() => {
        calculateTotal();
    }, [items]);

    function calculateTotal() {
        let totalCopy = {
            totalCaloreis: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFats: 0,
            totalFiber: 0
        };

        items.forEach((item) => {
            totalCopy.totalCaloreis += item.details.calories;
            totalCopy.totalProtein += item.details.protein;
            totalCopy.totalCarbs += item.details.carbohydrates;
            totalCopy.totalFats += item.details.fat;
            totalCopy.totalFiber += item.details.fiber;
        });

        setTotal(totalCopy);
    }

    function deleteItem(foodId) {
        // const url = `http://localhost:8000/track/${loggedData.loggedUser.userid}/${foodId}`;
        const url = `${backendUrl}/track/${loggedData.loggedUser.userid}/${foodId}`;
        console.log(`Deleting item with URL: ${url}`);
        fetch(url, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${loggedData.loggedUser.token}`
            }
        })
        .then((response) => {
            if (response.ok) {
                // Remove the item from the UI
                setItems((prevItems) => prevItems.filter(item => item._id !== foodId));
                console.log(`Item with id: ${foodId} deleted`);
            } else {
                console.error(`Failed to delete item with id: ${foodId}`, response.status);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }
    
    const IST_OFFSET = 5.5; // IST is UTC+5.5

    const toIST = (date) => {
        const offsetInMillis = date.getTimezoneOffset() * 60 * 1000; // Offset in milliseconds
        const istInMillis = offsetInMillis + (IST_OFFSET * 60 * 60 * 1000); // IST offset in milliseconds
        return new Date(date.getTime() + istInMillis); // Add IST offset to get IST time
    };

    const toDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
        const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
        return `${year}-${month}-${day}`;
    };

    return (
        <section className="container diet-container back" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/burger-french-fries-plate-with-copy-space_23-2148235009.jpg?w=740&t=st=1718128904~exp=1718129504~hmac=527e618c8c22a6c1c419929de15931c70fbcc4aac627fc18b9d5400cdbe5fc46')" }}>
            <Header />
            <input 
                type="date" 
                value={date ? toDateString(toIST(date)) : ''}
                onChange={(event) => {
                    const newDate = event.target.value ? new Date(event.target.value) : null;
                    console.log(newDate);
                    setDate(newDate ? toIST(newDate) : null);
                }}
            />
            {items.map((item) => {
                return (
                    <div className="item" key={item._id}>
                        <h3>{item.foodId.name} ( {item.details.calories} Kcal for {item.quantity}g )</h3>
                        <p>Protein {item.details.protein.toFixed(4)}g, Carbs {item.details.carbohydrates.toFixed(4)}g, Fats {item.details.fat.toFixed(4)}g, Fiber {item.details.fiber.toFixed(4)}g 
                          <FaTimes className="delete-icon" onClick={() => deleteItem(item._id)} />
                        </p>
                    </div>
                );
            })}
            <div className="item head">
                <h3 className="heading"> Total - {total.totalCaloreis.toFixed(4)} Kcal </h3>
                <p>Protein {total.totalProtein.toFixed(4)}g, Carbs {total.totalCarbs.toFixed(4)}g, Fats {total.totalFats.toFixed(4)}g, Fiber {total.totalFiber.toFixed(4)}g</p>
            </div>
        </section>
    );
}

// import { useEffect, useState, useContext } from "react";
// import { UserContext } from "../contexts/UserContext";
// import Header from './Header';
// import './diet.css';
// import { FaTimes } from 'react-icons/fa';

// export default function Diet() {
//     const loggedData = useContext(UserContext);
//     const [items, setItems] = useState([]);
//     const [date, setDate] = useState(new Date());
//     const [total, setTotal] = useState({
//         totalCaloreis: 0,
//         totalProtein: 0,
//         totalCarbs: 0,
//         totalFats: 0,
//         totalFiber: 0
//     });

//     useEffect(() => {
//         // Fetch data only if date is selected
//         if (date !== null) {
//             // Convert the date to IST
//             const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
//             fetch(`http://localhost:8000/track/${loggedData.loggedUser.userid}/${istDate.getMonth() + 1}-${istDate.getDate()}-${istDate.getFullYear()}`, {
//                 method: "GET",
//                 headers: {
//                     "Authorization": `Bearer ${loggedData.loggedUser.token}`
//                 }
//             })
//             .then((response) => response.json())
//             .then((data) => {
//                 console.log(data);
//                 setItems(data);
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//         } else {
//             setItems([]);
//             setTotal({
//                 totalCaloreis: 0,
//                 totalProtein: 0,
//                 totalCarbs: 0,
//                 totalFats: 0,
//                 totalFiber: 0
//             });
//         }
//     }, [date, loggedData.loggedUser.userid, loggedData.loggedUser.token]);

//     useEffect(() => {
//         calculateTotal();
//     }, [items]);

//     function calculateTotal() {
//         let totalCopy = {
//             totalCaloreis: 0,
//             totalProtein: 0,
//             totalCarbs: 0,
//             totalFats: 0,
//             totalFiber: 0
//         };

//         items.forEach((item) => {
//             totalCopy.totalCaloreis += item.details.calories;
//             totalCopy.totalProtein += item.details.protein;
//             totalCopy.totalCarbs += item.details.carbohydrates;
//             totalCopy.totalFats += item.details.fat;
//             totalCopy.totalFiber += item.details.fiber;
//         });

//         setTotal(totalCopy);
//     }

//     function deleteItem(foodId) {
//         const url = `http://localhost:8000/track/${loggedData.loggedUser.userid}/${foodId}`;
//         console.log(`Deleting item with URL: ${url}`);
//         fetch(url, {
//             method: "DELETE",
//             headers: {
//                 "Authorization": `Bearer ${loggedData.loggedUser.token}`
//             }
//         })
//         .then((response) => {
//             if (response.ok) {
//                 // Remove the item from the UI
//                 setItems((prevItems) => prevItems.filter(item => item._id !== foodId));
//                 console.log(`Item with id: ${foodId} deleted`);
//             } else {
//                 console.error(`Failed to delete item with id: ${foodId}`, response.status);
//             }
//         })
//         .catch((err) => {
//             console.log(err);
//         });
//     }
    
//     const IST_OFFSET = 5.5; // IST is UTC+5.5

//     const toIST = (date) => {
//         const offsetInMillis = date.getTimezoneOffset() * 60 * 1000; // Offset in milliseconds
//         const istInMillis = offsetInMillis + (IST_OFFSET * 60 * 60 * 1000); // IST offset in milliseconds
//         return new Date(date.getTime() + istInMillis); // Add IST offset to get IST time
//     };

//     const toDateString = (date) => {
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
//         const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
//         return `${day}/${month}/${year}`;
//     };

//     const toInputDateString = (date) => {
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
//         const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
//         return `${year}-${month}-${day}`;
//     };

//     return (
//         <section className="container diet-container back" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/burger-french-fries-plate-with-copy-space_23-2148235009.jpg?w=740&t=st=1718128904~exp=1718129504~hmac=527e618c8c22a6c1c419929de15931c70fbcc4aac627fc18b9d5400cdbe5fc46')" }}>
//             <Header />
//             <input 
//                 type="date" 
//                 value={date ? toInputDateString(toIST(date)) : ''}
//                 onChange={(event) => {
//                     const newDate = event.target.value ? new Date(event.target.value) : null;
//                     console.log(newDate);
//                     setDate(newDate ? toIST(newDate) : null);
//                 }}
//             />
//             {items.map((item) => {
//                 return (
//                     <div className="item" key={item._id}>
//                         <h3>{item.foodId.name} ( {item.details.calories} Kcal for {item.quantity}g )</h3>
//                         <p>Protein {item.details.protein.toFixed(4)}g, Carbs {item.details.carbohydrates.toFixed(4)}g, Fats {item.details.fat.toFixed(4)}g, Fiber {item.details.fiber.toFixed(4)}g</p>
//                         <FaTimes className="delete-icon" onClick={() => deleteItem(item._id)} />
//                     </div>
//                 );
//             })}
//             <div className="item head">
//                 <h3 className="heading"> Total - {total.totalCaloreis.toFixed(4)} Kcal </h3>
//                 <p>Protein {total.totalProtein.toFixed(4)}g, Carbs {total.totalCarbs.toFixed(4)}g, Fats {total.totalFats.toFixed(4)}g, Fiber {total.totalFiber.toFixed(4)}g</p>
//             </div>
//         </section>
//     );
// }
