//guardar datos de empleo editado
updateJobEdit = async (id) =>{
    try{
        const job = getJobForm()
        const response = await fetch(`${BASE_URL}jobs/${id}`, {
            method: "PUT",
            body: JSON.stringify(job),
            headers: {
                "Content-Type": "Application/json"
            },
        })
        const jobs = await response.json();
    } 
    catch(error){
        console.log(error)  
        msjError()    
    }
    finally{
        recharge(1)
    }
}