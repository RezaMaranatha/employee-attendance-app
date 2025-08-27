import React from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  Users,
  Clock,
  FileText
} from 'lucide-react';

const Reports: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and view reports</p>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Overview Dashboard
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Key metrics and statistics overview
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-500">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <Download className="h-4 w-4" />
            </button>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Attendance Report
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Detailed attendance records and analysis
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <Download className="h-4 w-4" />
            </button>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Employee List
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Complete employee directory and information
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Analytics
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Advanced analytics and trends
          </p>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Available Reports</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Reports Coming Soon</h4>
              <p className="text-gray-600 mb-6">
                Advanced reporting and analytics features will be available soon.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Current Features</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Employee Management</li>
                    <li>• Attendance Monitoring</li>
                    <li>• Basic Data Export</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Coming Soon</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Advanced Analytics</li>
                    <li>• Custom Reports</li>
                    <li>• Data Visualization</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
