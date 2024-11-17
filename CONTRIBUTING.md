# Contributing to DentiSmile+

Thank you for considering contributing to DentiSmile+! We welcome contributions from everyone.

## How to Contribute

1. **Fork the repository** and create a branch for your feature or bug fix.
2. **Work on your feature or bug** in your branch.
3. **Create a merge request** when your work is ready for review by other developers.

## Steps

1. Clone the repository:

   ```bash
   git clone git@git.chalmers.se:courses/dit355/2024/student_teams/dit356_2024_07/group-7.git
   	Or
   git clone https://git.chalmers.se/courses/dit355/2024/student_teams/dit356_2024_07/group-7.git

   cd group-7
   ```

2. Install dependencies for the Vue frontend:

   ```bash
   cd client
   npm install
   ```

3. Set up the backend:

   - Ensure dependencies are installed:
     ```bash
     cd server
     Add proper command here
     ```
   - Configure `.env` files in the root directory with necessary environment variables.

4. Start RabbitMQ server:

   ```bash
   Add proper command here
   ```

Note: the command specified above might change, as well other commands in this section, since the system is currently being developed.

5. Run the frontend and backend:
   - Frontend:
     ```bash
     npm run serve
     ```
   - Backend:
     ```bash
     npm run dev
     ```

## Issue Creation

When reporting issues, please:

1. Use the appropriate [issue template](Issue-template.md) for feature requests or bug reports.
2. Provide a clear and detailed description.
3. Add labels to specify the issue type (e.g., enhancement, bug, question).

## Merge Requests

1. Reference the issue ID in the merge request title.
2. Ensure that all tests pass before submitting.
3. Assign a reviewer and request a review.

## Coding Standards

- Maintain proper comments and document any non-trivial logic.
- Code review shall be conducted by another team member before merging to main.

## Testing

Run tests to verify your changes and add unit tests for new functionality. The team agreed that this shall be conducted at a later point, not during the Milestone itself.

Thank you for your contributions!
