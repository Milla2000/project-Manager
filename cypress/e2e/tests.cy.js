describe("End-to-End Test Suite", () => {
  it("Registers a user, logs in", () => {
    // Visit the registration page
    cy.visit("/register.html");

    // Fill out the registration form
    cy.get("#full-name").type("John Doe");
    cy.get("#email").type("john@example.com");
    cy.get("#password").type("password123");
    cy.get("#password2").type("password123");
    cy.get("#form").submit();

    // Wait for a while to ensure registration completes
    cy.wait(2000);

    // Check if redirected to login page
    cy.url().should("include", "/login.html");

    // Log in with the registered user
    cy.get("#email").type("john@example.com");
    cy.get("#password").type("password123");
    cy.get("#login-form").submit();

    // Wait for a while to ensure login completes
    cy.wait(2000);

    // Check if redirected to user page
    cy.url().should("include", "/userpage.html");

    // Check if project details are visible
    cy.get(".user-name").should("contain", "John Doe");




    // Complete the project
    //only if assigned a project
    // cy.get("#completeButton").click();

    // cy.wait(2000);

    // cy.get(".status").should("contain", "completed");


  });

});

describe("End-to-End Test Suite", () => {
  it("Registers a user, logs in, completes a project, and performs admin tasks", () => {
    // Visit the registration page
    cy.visit("/register.html");

    // Fill out the registration form
    cy.get("#full-name").type("John Doe");
    cy.get("#email").type("john@example.com");
    cy.get("#password").type("password123");
    cy.get("#password2").type("password123");
    cy.get("#form").submit();

    // Wait for a while to ensure registration completes
    cy.wait(2000);

    // Check if redirected to login page
    cy.url().should("include", "/login.html");

    // Log in with the registered user
    cy.get("#email").type("john@example.com");
    cy.get("#password").type("password123");
    cy.get("#login-form").submit();

    // Wait for a while to ensure login completes
    cy.wait(2000);

    // Check if redirected to user page
    cy.url().should("include", "/userpage.html");

    // Check if project details are visible
    cy.get(".user-name").should("contain", "John Doe");

    // Complete the project - only if is assigned a project
    cy.get("#completeButton").click();

    // Wait for a while to ensure project completion
    cy.wait(2000);

    // Check if project status is updated to "completed" if was having a project
    cy.get(".status").should("contain", "completed");

    // Log out the user
    cy.get("#logout-btn").click();
    cy.url().should("include", "/login.html");

    // Log in as an admin user
    cy.get("#email").type("admin@example.com");
    cy.get("#password").type("admin123");
    cy.get("#login-form").submit();

    // Wait for a while to ensure admin login completes
    cy.wait(2000);

    // Check if redirected to admin page
    cy.url().should("include", "/adminpage.html");

    // Check if the admin page displays correctly
    cy.get(".admin-page-title").should("contain", "Admin Dashboard");

    // Perform admin tasks, e.g., create a new project
    cy.get("#openModal").click();
    cy.get("#modal-title").type("New Project");
    cy.get("#modal-description").type("Description for the new project");
    cy.get("#modal-enddate").type("2023-08-31");
    cy.get(".modal-submit").click();

    // Wait for a while to ensure project creation completes
    cy.wait(2000);

    // Check if the new project is visible on the admin page
    cy.contains(".project", "New Project").should("be.visible");

    // Log out the admin
    cy.get("#logout-btn").click();
    cy.url().should("include", "/login.html");
  });
});

