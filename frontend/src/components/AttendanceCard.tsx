import React, { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut, Calendar, Clock as ClockIcon } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { AttendanceStatusResponse } from '../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const AttendanceCard: React.FC = () => {
  const [status, setStatus] = useState<AttendanceStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const statusData = await apiService.getAttendanceStatus();
      setStatus(statusData);
    } catch (error) {
      console.error('Error fetching attendance status:', error);
    }
  };

  const handleClockIn = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await apiService.clockIn({
        notes: notes.trim() || undefined,
      });
      toast.success('Successfully clocked in!');
      setNotes('');
      await fetchStatus();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to clock in');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await apiService.clockOut({
        notes: notes.trim() || undefined,
      });
      toast.success('Successfully clocked out!');
      setNotes('');
      await fetchStatus();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to clock out');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm:ss');
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <div className="card max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary-100 mb-4">
          <Clock className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Attendance</h2>
        <p className="text-gray-600">Welcome, {user?.firstName}!</p>
      </div>

      <div className="space-y-4">
        {/* Current Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Current Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              status?.isClocked
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {status?.isClocked ? 'Clocked In' : 'Clocked Out'}
            </span>
          </div>
          
          {status?.attendance && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(status.attendance.clockInTime)}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ClockIcon className="h-4 w-4 mr-2" />
                Clocked in at {formatTime(status.attendance.clockInTime)}
              </div>
            </div>
          )}
        </div>

        {/* Notes Input */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            rows={3}
            className="input-field"
            placeholder="Add any notes for this attendance record..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!status?.isClocked ? (
            <button
              onClick={handleClockIn}
              disabled={loading}
              className="w-full btn-success flex items-center justify-center"
            >
              <LogIn className="h-5 w-5 mr-2" />
              {loading ? 'Clocking In...' : 'Clock In'}
            </button>
          ) : (
            <button
              onClick={handleClockOut}
              disabled={loading}
              className="w-full btn-warning flex items-center justify-center"
            >
              <LogOut className="h-5 w-5 mr-2" />
              {loading ? 'Clocking Out...' : 'Clock Out'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;
