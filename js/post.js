// Crear nuevo empleo
const registerJob = async () =>{
    try{
        const job = getJobForm()
        const response = await fetch(`${BASE_URL}jobs`, {
            method: "POST",
            body: JSON.stringify(job),
            headers: {
                "Content-Type": "Application/json"
            }
        })
        const jobs = await response.json();
    } 
    catch(error){
        console.log(error)  
        msjError(msj2)    
    }
    finally{
        recharge(2)
    }
}