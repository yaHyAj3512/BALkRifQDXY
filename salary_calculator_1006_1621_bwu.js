// 代码生成时间: 2025-10-06 16:21:37
 * This server provides an API endpoint to calculate salaries based on provided data.
 */

const Hapi = require('@hapi/hapi');

// Create a new Hapi server instance
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// Define the route for the salary calculator
const routes = [
    {
        method: 'POST',
        path: '/calculate-salary',
        handler: async (request, h) => {
            try {
                // Extract the necessary data from the request
                const { baseSalary, hoursWorked, overtimeRate } = request.payload;
                
                // Calculate the regular salary
                const regularSalary = baseSalary * hoursWorked;
                
                // Check if overtime is applicable
                if (hoursWorked > 40) {
                    // Calculate overtime salary
                    const overtimeHours = hoursWorked - 40;
                    const overtimeSalary = overtimeRate * overtimeHours;
                    
                    // Return the total salary including overtime
                    return {
                        totalSalary: regularSalary + overtimeSalary,
                        regularSalary: regularSalary,
                        overtimeSalary: overtimeSalary
                    };
                } else {
                    // Return the regular salary only
                    return {
                        totalSalary: regularSalary,
                        regularSalary: regularSalary,
                        overtimeSalary: 0
                    };
                }
            } catch (error) {
                // Handle any errors that occur during salary calculation
                return h.response({ status: 'error', message: error.message }).code(500);
            }
        }
    }
];

// Start the server and add the routes
async function start() {
    await server.register(routes);
    await server.start();
    console.log('Server running at:', server.info.uri);
}

start();