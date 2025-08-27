import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Clock as ClockIcon, Filter, Download } from 'lucide-react';
import { apiService } from '../services/api';
import { Attendance, AttendanceStatus } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AttendanceHistory: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
  });

  const fetchAttendanceHistory = useCallback(async () => {
    setLoading(true);
    try {
      const query: any = {};
      if (filters.startDate) query.startDate = filters.startDate;
      if (filters.endDate) query.endDate = filters.endDate;
      if (filters.status) query.status = filters.status;

      const records = await apiService.getMyAttendance(query);
      setAttendanceRecords(records);
    } catch (error) {
      toast.error('Failed to fetch attendance history');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAttendanceHistory();
  }, [fetchAttendanceHistory]);

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm:ss');
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };



  const getStatusBadge = (status: AttendanceStatus) => {
      const statusConfig = {
    [AttendanceStatus.CLOCKED_IN]: {
      label: 'Clocked In',
      className: 'bg-green-100 text-green-800',
    },
    [AttendanceStatus.CLOCKED_OUT]: {
      label: 'Clocked Out',
      className: 'bg-gray-100 text-gray-800',
    },
  };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const calculateHoursWorked = (clockIn: string, clockOut?: string) => {
    if (!clockOut) return 'In Progress';
    
    const start = new Date(clockIn);
    const end = new Date(clockOut);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return `${diffHours.toFixed(2)} hours`;
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Clock In', 'Clock Out', 'Hours Worked', 'Status', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...attendanceRecords.map(record => [
        formatDate(record.clockInTime),
        formatTime(record.clockInTime),
        record.clockOutTime ? formatTime(record.clockOutTime) : 'N/A',
        calculateHoursWorked(record.clockInTime, record.clockOutTime),
        record.status,
        record.notes || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Attendance data exported successfully!');
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Attendance History</h2>
        <button
          onClick={exportToCSV}
          className="btn-primary flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-3">
          <Filter className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="input-field"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              className="input-field"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="input-field"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All</option>
              <option value={AttendanceStatus.CLOCKED_IN}>Clocked In</option>
              <option value={AttendanceStatus.CLOCKED_OUT}>Clocked Out</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading attendance records...</p>
        </div>
      ) : attendanceRecords.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No attendance records found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clock In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clock Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours Worked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(record.clockInTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {formatTime(record.clockInTime)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.clockOutTime ? (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        {formatTime(record.clockOutTime)}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calculateHoursWorked(record.clockInTime, record.clockOutTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {record.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;
