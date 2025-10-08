// 代码生成时间: 2025-10-09 03:00:19
// breadCrumbNavigation.js
// This module provides a breadcrumb navigation component for Hapi applications.

const Hapi = require('@hapi/hapi');

// Define the breadcrumb plugin options
const breadcrumbOptions = {
  name: 'breadcrumb',
  register: async function (server, options) {
    // Define the breadcrumb route
    server.route({
      method: 'GET',
      path: '/breadcrumb/{path*}',
      handler: async function (request, h) {
        try {
          // Extract the path from the request
          const { path } = request.params;
          // Split the path into segments for breadcrumb links
          const segments = path.split('/').filter(Boolean);
          // Generate the breadcrumb array
          const breadcrumbs = segments.map((segment, index) => ({
            text: segment,
            href: '/' + segments.slice(0, index + 1).join('/'),
          }));

          // Return the breadcrumb data
          return h.response({
            data: breadcrumbs,
          }).code(200);
        } catch (error) {
          // Handle any errors
          return h.response(error.message).code(500);
        }
      },
    });
  },
};

// Export the breadcrumb plugin
module.exports = breadcrumbOptions;
