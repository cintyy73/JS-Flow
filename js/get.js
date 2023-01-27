//obtener todos los empleos
const getJobs = async () => {
    try {
        const response = await fetch(`${BASE_URL}jobs`);
        const jobs = await response.json();
        rendersJobs(jobs)
        optionsFilters(jobs)
    } 
    catch (error) {
        console.log(error);
        msjError(msj1)
    }
}

getJobs()

//obtener un empleo
const getJob = async (id) =>{
    try {
        const response = await fetch(`${BASE_URL}jobs/${id}`);
        const job = await response.json();
        seeDetaislJob(job)
        populateForm(job)
    } catch (error) {
        msjError(msj2)
    }
}