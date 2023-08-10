

const hamburger = document.querySelector("#hamburger");
// const navMenu = document.querySelector(".nav-menu");
const navLink = document.querySelectorAll(".nav-link");

hamburger.addEventListener("click", (mobileMenu));
navLink.forEach(n => n.addEventListener("click", closeMenu));

function mobileMenu() {
    hamburger.classList.toggle("active");
    // navMenu.classList.toggle("active");
}

function closeMenu() {
    hamburger.classList.remove("active");
    // navMenu.classList.remove("active");
}


function logoutUser(){
  const logout_btn = document.querySelector('#logout-btn')

  logout_btn.addEventListener('click',()=>{
  localStorage.removeItem('token');
  window.location.href = '/login.html'
  // window.history.replaceState({},document.title, '/login.html');
})
}


const globalProjects = []



// admin page
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


              let currentDate = new Date().toJSON().slice(0, 10);
              let deadline = new Date(modalEnddate).toJSON().slice(0, 10);

              if (deadline <= currentDate) {
                  alert('cannot create objects deadlined before today')
                  return
              } 



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
  

const contentDiv = document.querySelector('.projects-container')
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
  const contentDiv = document.querySelector('.projects-container');
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
  const contentDiv = document.querySelector('.projects-container');
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
  const contentDiv = document.querySelector('.projects-container');
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
  const contentDiv = document.querySelector('.projects-container'); // Make sure to replace '#content' with the appropriate selector for your content container
  projects.forEach(project => {
    const projectDiv = document.createElement('div');
    // projectDiv.classList.add('project');

    const projectTitle = document.createElement('h4');
    projectTitle.textContent = project.title;

    const projectDescription = document.createElement('p');
    projectDescription.textContent = project.description;

    const projectStatus = document.createElement('span');
    if (project.assignedStatus) {
      if (project.completionStatus !== null) {
        projectStatus.textContent = 'Status: Complete';
        projectDiv.classList.add('project-complete');
        projectStatus.classList.add('complete');
      } else {
        projectStatus.textContent = 'Status: Running';
        projectStatus.classList.add('running');
        projectDiv.classList.add('project-running');
      }
    } else {
      projectStatus.textContent = 'Status: Unassigned';
      projectStatus.classList.add('unassigned');
      projectDiv.classList.add('project-unassigned');
      //i want to get the project element different colors based on project status ...
    }

    const projectStartDate = document.createElement('span');
    projectStartDate.textContent = project.startdate ? `Start Date: ${project.startdate.slice(0, 10)}` : 'Start Date: not yet assigned';

    const projectEndDate = document.createElement('span');
    projectEndDate.textContent = `End Date: ${project.enddate.slice(0, 10)}`;

    const projBtnDiv = document.createElement('div');
    projBtnDiv.classList.add('proj-btn');

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash fa-lg"></i>'; // Adding the delete icon

    deleteButton.addEventListener('click', async () => {
      if (project.assignedStatus) {
        alert('You cannot delete assigned projects');
        return;
      }

      const token = localStorage.getItem('token');

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
          window.location.href = '/adminpage.html';
        } else {
          console.error('Failed to delete project');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    });

    projBtnDiv.appendChild(deleteButton);

    projectDiv.appendChild(projectTitle);
    projectDiv.appendChild(projectDescription);
    projectDiv.appendChild(projectStatus);
    projectDiv.appendChild(projectStartDate);
    projectDiv.appendChild(projectEndDate);
    projectDiv.appendChild(projBtnDiv);

    contentDiv.appendChild(projectDiv);
  });
}


          
          const modal = document.getElementById('modal');
          

          

// Call the function to render projects when the page loads
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
});


}


if(window.location.pathname == '/adminUsers.html'){

  console.log('render users');

  if(!localStorage.getItem('token')){
      window.location.href = '/login.html'
  }

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
                  const usersListContainer = document.querySelector('.projects-container');
                  
                 
                  data.users.forEach(user => {
                      const userDiv = document.createElement('div');
                      userDiv.className = 'user';
                      // console.log(user);
                      
                      const userNameSpan = document.createElement('span');
                      userNameSpan.textContent = user.full_name;
                      
                      userDiv.appendChild(userNameSpan);
                      
                      if (user.assignedProject) {
                          const assignedSpan = document.createElement('span');
                          assignedSpan.textContent = 'Assigned';
                          userDiv.appendChild(assignedSpan);
                      } else {
                          const checkbox = document.createElement('input');
                          checkbox.type = 'radio';
                          checkbox.name = 'assignUser';
                          checkbox.value = user.id; 
                          checkbox.dataset.userId = user.id; 
                          
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

                          
              let selectedUserIds = [];

           
              const checkedCheckboxes = document.querySelectorAll('input[name="assignUser"]:checked');

              
              checkedCheckboxes.forEach(checkbox => {
                  selectedUserIds.push(checkbox.dataset.userId);
              });

              console.log(selectedUserIds);

              selectedUserIds.forEach(async(useridz)=>{
                   
                  let selectuser = document.querySelector('#select-users'); 
                  let selectedProjectId = selectuser.value; 
                   console.log(selectedProjectId);
                   
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
                           
                       } else {
                           console.error('Project assignment failed.');
                          
                       }
                   } catch (error) {
                       console.error('An error occurred:', error);
                       
                   }
               });
               
               window.location.href = '/adminUsers.html'

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