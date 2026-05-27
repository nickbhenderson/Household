# Household

#### Video Demo: [Watch on YouTube](https://www.youtube.com/watch?v=SMhkas73A9k&feature=youtu.be)

## Description

Welcome to Household. I built this project to learn more about Passport, Express.js, and MongoDB, and decided to make an expense tracker that my girlfriend and I could use to track shared costs such as rent, utilities, and other household expenses.

Household allows users to create a "Household" and log expenses every month. The app currently includes two main pages: a Household overview page and a Living Expenses page. Each is designed to make managing and visualizing shared finances simple and intuitive.

The background image used in the web app is from Unsplash. I chose a random cityscape—perhaps budgeting makes me feel like a big-time CEO in a tall skyscraper.

---

## Household Overview Page

The Household show page is divided into four sections:

1. **Household Information**  
   Displays the name and address of the household. If no name is provided, the default name is "Home."  
   To the right, a graph compares monthly expenses against the user’s average monthly income based on their yearly salary.  
   The expenses are shown in blue, and income in red.  
   An "Edit" button in the top right links to the edit page, where users can update their household’s name and address.

2. **Household Members**  
   Lists all users who are part of the household.  
   Includes a field to invite others by email (feature not fully implemented yet).

3. **Current Month Summary**  
   Displays a summary of all expenses for the current month, including a combined total.  
   An accordion menu shows the date and description of each expense when expanded.  
   A button at the bottom right links to the `/living-expenses` route, where users can add more expenses.

4. **Yearly Summary**  
   Displays total expenses for each year.  
   Expanding a year in the accordion reveals the individual months and their respective totals.

---

## Living Expenses Page

This page is divided into three sections:

1. **Monthly Summary**  
   Shows the current month's name and total expenses.  
   An accordion menu lists each expense along with its details, including the date added and description.

2. **Add a New Expense**  
   Provides three input fields:
   - Expense name
   - Dollar amount
   - Description (text area for additional details)

3. **Previous Months Summary**  
   Displays a list of previous months in descending order.  
   Expanding each month shows a detailed list of expenses with name, amount, and description.

---

## Profile Page

The profile route allows users to manage their personal information. It is divided into two sections:

1. **User Information**  
   Allows users to edit their display name ("Real Name") and salary.  
   Clicking "Edit" replaces the static text with editable input fields.

2. **Password Management**  
   Enables users to change their password by entering the new password, the old password, and a confirmation of the old password.  
   The system checks that the new password is not identical to the old one.  
   Password changes are handled securely using Passport’s `changePassword()` method.

---

## Technologies Used

**Languages:**

- HTML
- CSS
- JavaScript

**Backend:**

- Node.js
- Express.js

**Database:**

- MongoDB

**Templating Engine:**

- Embedded JavaScript (EJS)

**Frameworks and Libraries:**

- Bootstrap
- Passport.js

---

## Future Plans

- Implement a carousel for graphs to improve readability on smaller devices.
- Implement a carousel for navigating months on the Household page.
- Fully implement multi-user households with invitation
