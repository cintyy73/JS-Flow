//Eliminar un empleo
deleteJob = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}jobs/${id}`,{
            method: "DELETE",
        });
    } 
    finally{
        recharge(1)
    }
}