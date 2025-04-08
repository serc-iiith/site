# SERC Website Admin Interface

The SERC Website includes an admin interface that allows maintainers to easily edit the website's content without directly modifying JSON files. This documentation explains how to access and use the admin features.

## Accessing the Admin Interface

The admin interface is available at `/admin` when running the website locally. Just `npm run dev` to start the development server, and then navigate to `http://localhost:3000/admin` in your web browser.

## Admin Interface Features

The admin interface provides forms to edit all the website's content data, including:

- **People**: Update team member information
- **Papers**: Add, edit, or remove research publications
- **Projects**: Manage research project details
- **Events**: Manage upcoming and past events
- **Collaborators**: Update information about industry, academic, and government partners
- **Blogs**: Create and edit blog posts

## Usage Instructions

1. Navigate to the section you wish to edit (e.g., Papers, Events, etc.)
2. To edit an existing entry, click the "Edit" button next to the item
3. To create a new entry, click "Add New" at the top of the relevant section
4. Fill in the form fields according to the data schema requirements
5. Click "Save" to update the corresponding JSON file

## Important Notes

- The admin interface is only available in development mode and won't work in production builds
- Changes made through the admin interface directly modify the JSON files in your project
- Remember to commit and push any changes to your repository after making updates
- Always switch back to `output: 'export'` in `next.config.ts` when building for production

## Troubleshooting

If you encounter issues with the admin interface:

1. Ensure you've correctly commented out the `output: 'export'` line in your config
2. Check that you're running the development server with `npm run dev`
3. Verify that all required dependencies are installed
4. Clear your browser cache if you're experiencing unexpected behavior
