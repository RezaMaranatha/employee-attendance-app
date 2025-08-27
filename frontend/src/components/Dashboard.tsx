import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfilePhoto } from '../hooks/useProfilePhoto';
import { 
  Clock, 
  Calendar, 
  User, 
  LogOut, 
  Menu, 
  X,
  BarChart3,
  Settings,
  ChevronDown,
  Home
} from 'lucide-react';
import AttendanceCard from './AttendanceCard';
import AttendanceHistory from './AttendanceHistory';
import Profile from './Profile';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('attendance');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { photoUrl: profilePhotoUrl } = useProfilePhoto(user?.profilePhotoFilename);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigation = [
    { name: 'Attendance', id: 'attendance', icon: Clock },
    { name: 'History', id: 'history', icon: Calendar },
    ...(user?.role === 'admin' ? [
      { name: 'Reports', id: 'reports', icon: BarChart3 }
    ] : []),
  ];

  const profileMenuItems = [
    { name: 'View Profile', id: 'profile', icon: User },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'attendance':
        return <AttendanceCard />;
      case 'history':
        return <AttendanceHistory />;
      case 'reports':
        return (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports</h2>
            <p className="text-gray-600">Reports functionality coming soon...</p>
          </div>
        );

      case 'profile':
        return <Profile />;
      default:
        return <AttendanceCard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
                         {/* Left side - Logo and Navigation */}
             <div className="flex items-center space-x-8">
               {/* Logo */}
               <div className="flex items-center">
                 <Clock className="h-8 w-8 text-primary-600 mr-3" />
                 <h1 className="text-xl font-bold text-gray-900">Attendance</h1>
               </div>

               {/* Main Navigation - Desktop Only */}
               <div className="hidden md:flex items-center space-x-1">
                 <button
                   onClick={() => setActiveTab('attendance')}
                   className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                     activeTab === 'attendance'
                       ? 'bg-primary-100 text-primary-700'
                       : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                   }`}
                 >
                   <Clock className="h-5 w-5 mr-2" />
                   Attendance
                 </button>
                 <button
                   onClick={() => setActiveTab('history')}
                   className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                     activeTab === 'history'
                       ? 'bg-primary-100 text-primary-700'
                       : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                   }`}
                 >
                   <Calendar className="h-5 w-5 mr-2" />
                   History
                 </button>
                 {user?.role === 'admin' && (
                   <button
                     onClick={() => setActiveTab('reports')}
                     className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                       activeTab === 'reports'
                         ? 'bg-primary-100 text-primary-700'
                         : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                     }`}
                   >
                     <BarChart3 className="h-5 w-5 mr-2" />
                     Reports
                   </button>
                 )}
               </div>
             </div>

            {/* Right side - Date and Profile */}
            <div className="flex items-center space-x-4">
              {/* Date */}
              <div className="hidden sm:block text-sm text-gray-600">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>

              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                                 <button
                   onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                   className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                 >
                   {profilePhotoUrl ? (
                     <img
                       src={profilePhotoUrl}
                       alt="Profile"
                       className="h-8 w-8 rounded-full object-cover"
                     />
                   ) : (
                     <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                       <User className="h-5 w-5 text-primary-600" />
                     </div>
                   )}
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                                 {/* Dropdown Menu */}
                 {profileDropdownOpen && (
                   <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                     {/* User Info */}
                     <div className="px-4 py-3 border-b border-gray-100">
                       <p className="text-sm font-medium text-gray-900">
                         {user?.firstName} {user?.lastName}
                       </p>
                       <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                     </div>

                     {/* Profile Menu Items */}
                     <div className="py-1">
                       {profileMenuItems.map((item) => {
                         const Icon = item.icon;
                         return (
                           <button
                             key={item.id}
                             onClick={() => {
                               setActiveTab(item.id);
                               setProfileDropdownOpen(false);
                             }}
                             className={`w-full flex items-center px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors duration-200 ${
                               activeTab === item.id ? 'text-primary-700 bg-primary-50' : 'text-gray-700'
                             }`}
                           >
                             <Icon className="h-4 w-4 mr-3" />
                             {item.name}
                           </button>
                         );
                       })}
                     </div>

                     {/* Divider */}
                     <div className="border-t border-gray-100 my-1"></div>

                     {/* Logout */}
                     <button
                       onClick={handleLogout}
                       className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                     >
                       <LogOut className="h-4 w-4 mr-3" />
                       Logout
                     </button>
                   </div>
                 )}
              </div>

              
            </div>
          </div>
        </div>
      </nav>

             {/* Main Content */}
       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-6">
         {renderContent()}
       </main>

       {/* Mobile Bottom Navigation */}
       <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
         <div className="flex items-center justify-around h-16">
           {navigation.map((item) => {
             const Icon = item.icon;
             return (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={`flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200 ${
                   activeTab === item.id
                     ? 'text-primary-600'
                     : 'text-gray-500 hover:text-gray-700'
                 }`}
               >
                 <Icon className="h-6 w-6 mb-1" />
                 <span className="text-xs font-medium">{item.name}</span>
               </button>
             );
           })}
           {/* Profile Button */}
           <button
             onClick={() => setActiveTab('profile')}
             className={`flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200 ${
               activeTab === 'profile'
                 ? 'text-primary-600'
                 : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             <User className="h-6 w-6 mb-1" />
             <span className="text-xs font-medium">Profile</span>
           </button>
         </div>
       </div>
     </div>
   );
};

export default Dashboard;
