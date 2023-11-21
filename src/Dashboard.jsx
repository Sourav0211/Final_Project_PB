import {useState, useEffect} from "react";
import './Dashboard.css';
import Menu from "./Menu";
import {db} from "./firebase";
import { collection , addDoc , getDocs} from "firebase/firestore";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Popup from "./Popup";


const Dashboard = ( {authUser, userSignOut}) => {
    
    const [newCategory,setNewCategory]= useState("");
    const [newBudget,setNewBudget] = useState(0);
    const [budgetData, setBudgetData] = useState([]);
    const [chartData, setChartData] = useState({});
    const [timeoutPopup, setTimeoutPopup] = useState(false);
    // const budgetCollectionRef= collection(db,"Budget");
    const timeoutDuration =   5 * 50 * 1000;


    const userUID= authUser.uid;

    const budgetCollectionRef = collection(db, "users", userUID, "Budget");
    /*new budget mapping*/
    useEffect(() => {
        const checkAndCreateCollection = async () => {
          const collectionExists = await doesCollectionExist(budgetCollectionRef);
    
          if (!collectionExists) {
            await addDoc(budgetCollectionRef, { placeholder: "Initial document" });
          }
    
          const data = await getDocs(budgetCollectionRef);
          setBudgetData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
          setChartData(prepareChartData());
        };
        checkAndCreateCollection();
    }, [userUID]);


    const doesCollectionExist = async (collectionRef) => {
        try {
          await getDocs(collectionRef);
          return true; 
        } catch (error) {
          return false; 
        }
      };



    useEffect(() => {
        setChartData(prepareChartData());

        setTimeoutPopup(false);
    }, [budgetData]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            // Show the popup before the session times out
            setTimeoutPopup(true);
        }, timeoutDuration);

        return () => clearTimeout(timeout);
    }, [budgetData]);


  
    const createBudget = async () => {
        await addDoc(budgetCollectionRef, {category: newCategory, value: Number(newBudget) });
        
        setTimeout(() => {
            setNewCategory("");
            setNewBudget("");
          },100 );
    
    }


//   /*for creating a chart*/
    const prepareChartData = () => {
        return {
            labels: budgetData.map(item => item.category),
            datasets: [
                {
                    label: 'Budget Amount',
                    backgroundColor: '#4bc0c066',
                    borderColor: '#4bc0c0',
                    borderWidth: 1,
                    hoverBackgroundColor: '#4bc0c099',
                    hoverBorderColor: '#4bc0c0',
                    data: budgetData.map(item => item.value),
                },
            ],
        };
    };
  
 
    const handleReloadSession = () => {
        // Reload the session or perform any other necessary actions
        window.location.reload();
    }

    return(
        
        
        <div className='Dashboard-Display'>
       <Menu userSignOut={userSignOut}/>
        <h2>Welcome to your Dashboard! {authUser.email} </h2>

  
        <div>
        {timeoutPopup && <Popup onReloadSession={handleReloadSession} />}
        </div>
        
        
        <div className='Put-Budget'>
        <label>Category</label>
        <input placeholder="put your category" value={newCategory} onChange={(e) => {setNewCategory(e.target.value)}}></input>
        <label>Budget</label>
        <input type="number" placeholder="put your budget amount"  onChange={(e) => {setNewBudget(e.target.value)}}></input>
        <button onClick={createBudget}>Enter</button>
        </div>

        <div className='bar-chart'>
        <Bar data={prepareChartData()} />
        </div>
       
        
        
        </div>
        
    )
}

export default Dashboard; 





