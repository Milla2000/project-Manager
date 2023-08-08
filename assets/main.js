function logoutUser(){
    const logout_btn = document.querySelector('#logout-btn')

    logout_btn.addEventListener('click',()=>{
    localStorage.removeItem('token');
    window.location.href = '/login.html'
    // window.history.replaceState({},document.title, '/login.html');
})
}


const globalProjects = []



if(window.location.pathname == '/register.html'){
    const registration_form = document.querySelector('.register')
    const txtfullname = document.querySelector('#full-name')
    const txtemail = document.querySelector('#email')
    const txtpassword = document.querySelector('#password') 
    const txtpassword2 = document.querySelector('#password2') 
    const reg_notification= document.querySelector('#notifications-reg') 
    


    let profileurl = ''
    const regError = document.querySelector('.regError')

    

    registration_form.addEventListener('submit', (e)=>{
        e.preventDefault();

        console.log(txtpassword.value, txtpassword2.value );
        
        
        if(txtpassword.value !== txtpassword2.value){
            reg_notification.textContent = 'Your Passwords do not match'
            setTimeout(function() {
                reg_notification.textContent = ""
            }, 3000);
            console.log('pwd don match')
            return
        }

        console.log(profileurl);
        let user = txtfullname.value !== '' && txtemail.value !== '' && txtpassword.value !== '' 

        if(user){
            const promise = new Promise ((resolve , reject)=>{
                fetch('http://localhost:4500/users/register',{
                    headers:{
                        'Accept': 'application/json',
                        'Content-type': 'application/json'
                    },
                    method: "POST",
                    body:JSON.stringify({
                        "full_name": txtfullname.value,
                        "email": txtemail.value,
                        "password": txtpassword.value
                    })
                }).then(res=>(res.json())).then(data=>{
                    console.log(data);
                    window.location.href = '/login.html'; 
                    // regError.innerHTML = data[0]?.message ?? data?.message
                    resolve(data)
                }).catch(error =>{
                    console.log(error);
                    reject(error)
                })
            })
        }
    })
}


// HANDLE LOGIN LOGIN

if(window.location.pathname == '/login.html'){ 
    const login_form = document.querySelector('.form')
    const txtloginemail = document.querySelector('#email')
    const txtloginpwd = document.querySelector('#password')
    const notification = document.querySelector('#notifications')

    
    let token = ''

    
    login_form.addEventListener('submit',async (e)=>{
        e.preventDefault()


        if(txtloginemail.value == '' && txtloginpwd.value == ''){
            notification.textContent = "fill all fields"
            setTimeout(function() {
                notification.textContent = ""
            }, 3000);
        }

        
        
        

        const user = txtloginemail.value !== '' && txtloginpwd.value !== ''

        if(user){
            
                await fetch('http://localhost:4500/users/login', {
                    headers:{
                        'Accept': 'application/json',
                        'Content-type': 'application/json'
                    },
                    method: "POST",
                    body:JSON.stringify({
                        "email": txtloginemail.value,
                        "password": txtloginpwd.value
                    })
                }).then(res => (res.json())).then(data=>{
                    
                    token = data?.token

                    // if (res.status===401){
                    //     notification.textContent = 'Could not find user'
                    //     setTimeout(function() {
                    //         notification.textContent = ""
                    //     }, 3000);
                    // }

                    
                    
                    if(!token){
                        notification.textContent = data?.message
                        setTimeout(function() {
                            notification.textContent = ""
                        }, 3000);
                    }

                       
                    localStorage.setItem('token', token)

                    
                })
            // })

            // setTimeout(() => {
                if(localStorage.getItem('token')){
                    // console.log("inside fetch");
                    await fetch('http://localhost:4500/users/check', {
                        headers:{
                            'Accept': 'application/json',
                            'Content-type': 'application/json',
                            "token": localStorage.getItem('token')
                        },
                        method: "GET"
                    }).then(res => (res.json())).then(data=>{
                        console.log("submit insiiiiiiiiiiiide");
                        // loginMsgs.innerHTML = data?.message 
                        // token = data?.token
    
                         // Get user role from the response
                        const userRole = data?.info?.role;
    
                        console.log(userRole);
                        
    
                        // Redirect based on user role
                        if (userRole === 'user') {
                            window.location.href = '/userpage.html'; // Redirect for regular users
                        } else if (userRole === 'admin') {
                            window.location.href = '/adminpage.html'; // Redirect for admin users
                        }
    
                        // userRole = ''
    
    
                           
                        // localStorage.setItem('token', token)
    
                       
                    })
                }
            // }, 100);
            
        }
    })
}


// HANDLE LOGIN LOGIN
// if(window.location.pathname == '/adminpage.html'){

// }

if(window.location.pathname == '/admin-assign.html'){

    if(!localStorage.getItem('token')){
        window.location.href = '/login.html'
    }

    // Send GET request and render projects
    async function renderProjects() {
    const token = localStorage.getItem('token');
    logoutUser()
    
    try {
        const response = await fetch('http://localhost:4500/projects', {
            method: 'GET',
            headers: {
                'token': token
            }
        });

        if (response.ok) {
            
            let selectuser = document.querySelector('#select-users');
            const projects = await response.json();
            // console.log(`projects are: ${projects}`);
            console.log(projects);
            const projectsArray = projects.projects;
            console.log('km m m  kl  ');

            projectsArray.map(project => {

                console.log(project.assignedStatus);

                if(!project.assignedStatus){
                    const option = document.createElement('option');
                    option.value = `${project.id}`;
                    option.text = `${project.title}`;
                    // console.log(project.title);
                    
                    selectuser.appendChild(option);
                }
              });

              

              if (localStorage.getItem('token')) {
                fetch('http://localhost:4500/users/allusers', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json',
                        "token": localStorage.getItem('token')
                    },
                    method: "GET"
                })
                .then(res => res.json())
                .then(data => {
                    const usersListContainer = document.querySelector('.users-list');
                    
                    // Loop through the user data and generate HTML for each user
                    data.users.forEach(user => {
                        const userDiv = document.createElement('div');
                        userDiv.className = 'user';
                        // console.log(user);
                        
                        const userNameSpan = document.createElement('span');
                        userNameSpan.textContent = user.full_name;
                        
                        userDiv.appendChild(userNameSpan);
                        
                        // Check if the user is assigned to a project
                        if (user.assignedProject) {
                            const assignedSpan = document.createElement('span');
                            assignedSpan.textContent = 'Assigned';
                            userDiv.appendChild(assignedSpan);
                        } else {
                            const checkbox = document.createElement('input');
                            checkbox.type = 'radio';
                            checkbox.name = 'assignUser';
                            checkbox.value = user.id; // Store the user's ID as the checkbox value
                            checkbox.dataset.userId = user.id; // Store the user's ID as a data attribute
                            
                            // const label = document.createElement('label');
                            // label.textContent = 'Not Assigned';
                            
                            userDiv.appendChild(checkbox);
                            // userDiv.appendChild(label);
                        }
                        
                        usersListContainer.appendChild(userDiv);
                    });
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                });
            }


            const assignButton = document.querySelector('#assign-btn')
            assignButton.addEventListener('click', async () => {

                            // Initialize an array to store selected user IDs
                let selectedUserIds = [];

                // Get all checkboxes that are checked
                const checkedCheckboxes = document.querySelectorAll('input[name="assignUser"]:checked');

                // Loop through the checked checkboxes and gather the selected user IDs
                checkedCheckboxes.forEach(checkbox => {
                    selectedUserIds.push(checkbox.dataset.userId);
                });

                console.log(selectedUserIds);

                selectedUserIds.forEach(async(useridz)=>{
                     // Get the selected user ID and project ID
                    //  let selectedUserId = ''; // Get the selected user's ID from the rendered user elements
                    let selectuser = document.querySelector('#select-users'); 
                    let selectedProjectId = selectuser.value; // Get the selected project's ID from the dropdown
                     console.log(selectedProjectId);
                     // Construct the payload for assignment
                     const assignmentPayload = {
                         user_id: useridz,
                         project_id: selectedProjectId
                     };
                     
                     try {
                         const response = await fetch('http://localhost:4500/users/assign', {
                             method: 'PUT',
                             headers: {
                                 'Content-Type': 'application/json'
                             },
                             body: JSON.stringify(assignmentPayload)
                         });
                         
                         if (response.ok) {
                             console.log('Project assigned successfully.');
                             // You can perform additional actions here after successful assignment
                         } else {
                             console.error('Project assignment failed.');
                             // Handle error cases here
                         }
                     } catch (error) {
                         console.error('An error occurred:', error);
                         // Handle errors related to the fetch request
                     }
                 });
                 
                 window.location.href = '/admin-assign.html'

                })

                   

            

            
          
        } else {
            console.error('Failed to fetch projects');
            // Handle error scenario here
        }
    } catch (error) {
        // console.error('Error fetching projects:', error);
        // Handle error scenario here
    }
}




    
      
    renderProjects()
}


// handle render projects in admin dashboard
if(window.location.pathname == '/adminpage.html'){

    logoutUser()

    if(!localStorage.getItem('token')){
        window.location.href = '/login.html'
    }

    
   

    

    

    


        
        const submitModalButton = document.querySelector('.modal-submit');

        if (submitModalButton) { 
            submitModalButton.addEventListener('click', async (event) => {
                event.preventDefault();

                const modalTitle = document.getElementById('modal-title').value;
                const modalDescription = document.getElementById('modal-description').value;
                const modalEnddate = document.getElementById('modal-enddate').value;

                const token = localStorage.getItem('token');

                try {
                    const response = await fetch('http://localhost:4500/projects', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'token': token
                        },
                        body: JSON.stringify({
                            "title": modalTitle,
                            "description": modalDescription,
                            "enddate": modalEnddate
                        })
                    });

                    if (response.ok) {
                        const responseData = await response.json();
                        const creatednotification = document.querySelector('#createdSuccessfully')
                        creatednotification.style.display = 'block';
                        const modal = document.getElementById('modal');
                        modal.style.display = 'none';
                        setTimeout(function() {
                            creatednotification.style.display = 'none';
                            
                            console.log('Project created:', responseData);
                            
                            window.location.href = '/adminpage.html'
                        }, 3000);
                        
                       
                    } else {
                        console.error('Failed to create project');
                        
                    }
                } catch (error) {
                    console.error('An error occurred:', error);
                    
                }
            });
        } else {
            console.error('Submit button not found');
        }


       




    const openModalButton = document.getElementById('openModal');
const closeModalButton = document.getElementById('closeModal');


openModalButton.addEventListener('click', () => {
  modal.style.display = 'flex';
});

closeModalButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});
    

const contentDiv = document.querySelector('.content-data')
console.log("inside admin dashboard");

async function renderProjects() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('http://localhost:4500/projects', {
            method: 'GET',
            headers: {
                'token': token
            }
        });

        if (response.ok) {
            let selectuser = document.querySelector('#select-users');
            const projects = await response.json();
            // console.log(`projects are: ${projects}`);
            // console.log(projects);
            const projectsArray = projects.projects;
            renderProjectsToDOM(projectsArray); // Call function to render projects

            globalProjects.push(projectsArray)
            // console.log('globalProjects');
            // console.log(globalProjects);

            
          
        } else {
            console.error('Failed to fetch projects');
            
        }
    } catch (error) {
        console.error('Error fetching projects:', error);
        
    }
}



const runningButton = document.querySelector('#running-projects');
const completeButton = document.querySelector('#completed-projects');
const allButton = document.querySelector('#all-projects');


allButton.addEventListener('click', () => {
    const contentDiv = document.querySelector('.content-data');
    contentDiv.innerHTML = ''; 
    const allProjects=[]

    console.log('Running button clicked');
    console.log(globalProjects);

    globalProjects.forEach((innerProjectsArray) => {
        innerProjectsArray.forEach((project) => {
                allProjects.push(project);
        });
    });

    renderProjectsToDOM(allProjects)
})


runningButton.addEventListener('click', () => {
    const contentDiv = document.querySelector('.content-data');
    contentDiv.innerHTML = ''; 
    const runningProjects=[]

    console.log('Running button clicked');
    console.log(globalProjects);

    globalProjects.forEach((innerProjectsArray) => {
        innerProjectsArray.forEach((project) => {
            

            if (project.assignedStatus) {
                console.log('inside assigned');
                console.log(project);
                runningProjects.push(project);
            }
        });
    });

    renderProjectsToDOM(runningProjects)

    // Now you can use the runningProjects array to render the projects or perform other actions
    console.log('Running projects:', runningProjects);
});


completeButton.addEventListener('click',()=>{
    const contentDiv = document.querySelector('.content-data');
    contentDiv.innerHTML = ''; 
    const completedProjects=[]

    console.log('Running button clicked');
    console.log(globalProjects);

    globalProjects.forEach((innerProjectsArray) => {
        innerProjectsArray.forEach((project) => {
            // console.log(project.assignedStatus);

            if (project.completionStatus) {
                // console.log('inside assigned');
                // console.log(project);
                completedProjects.push(project); // Add the project to the runningProjects array
            }
        });
    });

    renderProjectsToDOM(completedProjects)

    
})





function renderProjectsToDOM(projects) {
    const modalHeading = document.querySelector("#modal-heading")
    projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');

        const projectTitle = document.createElement('h4');
        projectTitle.textContent = `Title: ${project.title}`;

        const projectDescription = document.createElement('p');
        projectDescription.textContent = `desc:  ${project.description}`;

        const projectStatus = document.createElement('span');
        console.log(project);

        if(project.assignedStatus){
            console.log(project.completionStatus);
            if (project.completionStatus!==null) {
                projectStatus.textContent = `Status: Complete`
                projectStatus.classList.add('complete'); 
            }else{
                projectStatus.textContent = `Status: Running`
                projectStatus.classList.add('running'); 
            }

            
            
            
        }else{
            projectStatus.textContent = `Status: Unassigned`;
            projectStatus.classList.add('unassigned'); 
        }
        const projectStartDate = document.createElement('span');
        if(!project.startdate){
            // console.log('is nulllllll');
            
            // projectStartDate.textContent = `Start Date: unassigned`;
        }else{
            
            projectStartDate.textContent = `Start Date: ${project.startdate}`;
        }


        // const projectStartDate = document.createElement('span');
        // projectStartDate.textContent = `Start Date: ${project.startdate}`;

        const projectEndDate = document.createElement('span');
        projectEndDate.textContent = `End Date: ${project.enddate}`;

        const projBtnDiv = document.createElement('div');
        projBtnDiv.classList.add('proj-btn');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'delete';

        

        deleteButton.addEventListener('click',async()=>{
            

            if(project.assignedStatus){
                alert('You cannot delete assigned projects')
                return
            }
           
            const token = localStorage.getItem('token');


            console.log(project.id);

            try {
                const response = await fetch(`http://localhost:4500/projects/${project.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token
                    },
                    
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log('Project deleted message:', responseData);
                    window.location.href = '/adminpage.html'
                    // Handle the response data as needed
                } else {
                    console.error('Failed to create project');
                    // Handle error scenario here
                }
            } catch (error) {
                console.error('An error occurred:', error);
                // Handle error scenario here
            }
            
            
            
        })

        // Append elements to the projectDiv
        projBtnDiv.appendChild(deleteButton);
        // projBtnDiv.appendChild(editButton);

        projectDiv.appendChild(projectTitle);
        projectDiv.appendChild(projectDescription);
        projectDiv.appendChild(projectStatus);
        projectDiv.appendChild(projectStartDate);
        projectDiv.appendChild(projectEndDate);
        projectDiv.appendChild(projBtnDiv);

        // Append the projectDiv to the contentDiv
        contentDiv.appendChild(projectDiv);

        
    });
}


            
            const modal = document.getElementById('modal');
            

            

// Call the function to render projects when the page loads
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
});


}


if (window.location.pathname == '/userpage.html') {


    if(!localStorage.getItem('token')){
        window.location.href = '/login.html'
    }

    
    const contentDataDiv = document.querySelector('.content-data');
    const projectTitle  = document.querySelector('#project-title')
    const description  = document.querySelector('#proj-desc')
    const startDate  = document.querySelector('#startdate')
    const endDate  = document.querySelector('#enddate')
    const status  = document.querySelector('.status')
    const projectAssignedDiv  = document.querySelector('.project-assigned')
    let token = localStorage.getItem('token'); 
    let user_name = document.querySelector('.user-name')


    

    // Function to render project details
    async function renderProjectDetails(userId, token) {
        try {
            // console.log('inside renderProjectDetails');
            const response = await fetch(`http://localhost:4500/projects/${userId}`, {
                method: 'GET',
                headers: {
                    'token': token
                }
            });

            // console.log("inside renderprojectdetails");

            if (response.ok) {
                const projectResponse = await response.json();
                    const project = projectResponse.project[0]; // Access the project object within the array
                    // console.log(project);
                    if(!project){
                        console.log("no projext");
                        projectAssignedDiv.innerHTML="No projects assigned"
                        return
                    }
                    renderProjectToDOM(project);
            } else {
                console.error('Failed to fetch project details');
                // Handle error scenario here
            }
        } catch (error) {
            // console.error('Error fetching project details:', error);
            // Handle error scenario here
        }
    }

    // Check for token and fetch user data
    
    if (token) {
        fetch('http://localhost:4500/users/check', {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                "token": token
            },
            method: "GET"
        })
        .then(res => res.json())
        .then(data => {
            const userId = data?.info?.id; // Extract user ID from the response
            const username = data?.info?.full_name; // Extract user ID from the response
            user_name.textContent = username
            console.log(username);

            // Call renderProjectDetails with user ID and token
            renderProjectDetails(userId, token);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
    }

    logoutUser()

    

    // Render project details to the DOM
    function renderProjectToDOM(project) {
        // console.log("bsbsbsbbsbsbsbbsbbs");
        // console.log(project.enddate);
        
        // console.log(project);


        
        projectTitle.textContent = project.title;
        description.textContent = project.description;
        console.log(project.enddate);

        const projectenddate =  project.enddate.slice(0, 10);
        const projectstartdate =  project.startdate.slice(0, 10);

        console.log(project.enddate);
        console.log("bsbsbsbbsbsbsbbsbbs");
        

        startDate.textContent = `Start Date: ${projectstartdate}`;
        endDate.textContent = `End Date: ${projectenddate}`;
        
        if(project.completionStatus!== null){
            status.textContent = `Status: completed`;
        }else{
            status.textContent = `Status: running`;
        }
        }

    // Call the function to render project details when the page loads
    
}


// #######################################################    focus here a little  #################################

if (window.location.pathname == '/userpage.html') {
 // #######################################################################################
// Get the "Complete" button element
logoutUser()

if(!localStorage.getItem('token')){
    window.location.href = '/login.html'
}
const completeButton = document.getElementById('completeButton');

// Add an event listener to the "Complete" button
completeButton.addEventListener('click', async () => {
    let token = localStorage.getItem('token')

    if (token) {
        fetch('http://localhost:4500/users/check', {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                "token": token
            },
            method: "GET"
        })
        .then(res => res.json())
        .then(async data => {
            const userId = data?.info?.id; // Extract user ID from the response
            console.log(userId);

            // Call renderProjectDetails with user ID and token
            // renderProjectDetails(userId, token);

            const response = await fetch(`http://localhost:4500/projects/${userId}`, {
                method: 'GET',
                headers: {
                    'token': token
                }
            });

            console.log("inside renderprojectdetails");

            if (response.ok) {
                const projectResponse = await response.json();
                    const project = projectResponse.project[0]; // Access the project object within the array
                    console.log(project);
                    // renderProjectToDOM(project);
                    // Replace these values with the actual project_id and user_id
    
                    const project_id = project.id;
                    const user_id = userId;

                    // Send POST request to complete the project
                    completeProject(project_id, user_id);
            } else {
                console.error('Failed to fetch project details');
                // Handle error scenario here
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
    }

    

    
            
    
});

// Function to send the POST request
async function completeProject(project_id, user_id) {
    try {

        const status  = document.querySelector('.status')
        
        const response = await fetch('http://localhost:4500/users/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "project_id": project_id,
                "user_id": user_id
            })
        });

        if (response.ok) {
            const result = await response.json();

            console.log(result.message); // Log the response message
            status.textContent = `Status: completed`;
        } else {
            console.error('Failed to complete project');
            // Handle error scenario here
        }
    } catch (error) {
        console.error('Error completing project:', error);
        // Handle error scenario here
    }
}


}









