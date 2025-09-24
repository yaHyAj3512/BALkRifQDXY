// 代码生成时间: 2025-09-24 14:27:00
 * Usage:
 * - Start the Hapi server and this script will be available at /generateExcel
 */

const Hapi = require('@hapi/hapi');
const ExcelJS = require('exceljs');
const path = require('path');

// Create a server with a host and port
const server = Hapi.server({
    host: 'localhost',
    port: 3000,
});

// Start the server
async function startServer() {
    await server.register(require('inert')); // Plugin to serve files
    await server.start();

    console.log('Server running at:', server.info.uri);
}

startServer();

// Route to handle Excel file generation
server.route({
    method: 'GET',
    path: '/generateExcel',
    handler: async (request, h) => {
        try {
            // Create a new workbook and add a new worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Generated Data');

            // Define and fill data
            worksheet.addTable({
                name: 'Example Table',
                ref: 'A1',
                headers: [
                    { key: 'id', header: 'ID' },
                    { key: 'name', header: 'Name' },
                    { key: 'date', header: 'Date' },
                ],
                rows: [
                    { id: 1, name: 'John Doe', date: '2023-01-01' },
                    { id: 2, name: 'Jane Doe', date: '2023-01-02' },
                    // Add more rows if needed
                ],
            });

            // Define the file path
            const filePath = path.join(__dirname, 'example.xlsx');

            // Write the workbook to the file path
            await workbook.xlsx.writeFile(filePath);

            // Return the file as a response
            return h.file(filePath);
        } catch (error) {
            // Error handling
            console.error('Error generating Excel file:', error.message);
            return h.response('An error occurred while generating the Excel file.').code(500);
        }
    }
});
