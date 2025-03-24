import { Edit2, UserCheck, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../api/axiosInstance.js";

const TokenDisplay = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      setFetchingDoctors(true);
      try {
        const { data } = await axiosInstance.get("api/hospital/doctors");
        setDoctors(data);
      } catch (error) {
        toast.error("Failed to fetch doctors");
      } finally {
        setFetchingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    // Show modal when a doctor is selected and reset token
    if (selectedDoctor) {
      setToken(null); // Reset token when new doctor is selected
      setShowModal(true);
    }
  }, [selectedDoctor]);

  const incrementToken = async () => {
    if (!selectedDoctor) {
      toast.error("Please select a doctor first");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axiosInstance.post("api/token-management/increment-token", {
        doctorId: selectedDoctor,
      });
      setToken(response.data.token);
      toast.success("Token incremented successfully");
    } catch (error) {
      toast.error("Error incrementing token");
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctorData = selectedDoctor 
    ? doctors.find(doctor => doctor._id === selectedDoctor)
    : null;

  const closeModal = () => {
    setShowModal(false);
    // Optional: Uncomment the line below if you want to reset both token and selected doctor when closing modal
    // setSelectedDoctor(null);
    setToken(null); // Reset token when closing modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Token Management</h1>
        <p className="text-gray-600 text-center mb-6">Select a doctor and manage patient tokens</p>

        {fetchingDoctors ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Doctors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className={`p-4 bg-white border border-gray-100 shadow-md rounded-lg cursor-pointer transition duration-200 hover:shadow-xl flex items-center justify-between ${
                      selectedDoctor === doctor._id ? "ring-2 ring-teal-500 bg-teal-50" : ""
                    }`}
                    onClick={() => setSelectedDoctor(doctor._id)}
                  >
                    <div className="flex items-center">
                      <div className="bg-teal-100 p-3 rounded-full mr-3">
                        <UserCheck className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-500">{doctor.specialization}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      doctor.availability 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {doctor.availability ? "Available" : "Unavailable"}
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-center text-gray-500 py-8">No doctors found</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Doctor Modal */}
      {showModal && selectedDoctorData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-fadeIn">
            <div className="bg-teal-600 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Doctor Details</h3>
              <button 
                onClick={closeModal} 
                className="text-white hover:text-teal-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="bg-teal-100 p-4 rounded-full mr-4">
                  <UserCheck className="h-8 w-8 text-teal-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedDoctorData.name}</h4>
                  <p className="text-gray-600">{selectedDoctorData.specialization}</p>
                  <div className={`mt-2 px-3 py-1 inline-block rounded-full text-sm font-medium ${
                    selectedDoctorData.availability 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {selectedDoctorData.availability ? "Available" : "Unavailable"}
                  </div>
                </div>
              </div>
              
              {token && (
                <div className="mb-6 flex flex-col items-center justify-center">
                  <div className="inline-flex items-center justify-center bg-teal-600 text-white text-3xl font-bold rounded-full w-24 h-24 mb-2">
                    {token}
                  </div>
                  <p className="text-gray-600">Current Token</p>
                </div>
              )}
              
              <button
                onClick={incrementToken}
                disabled={loading}
                className="w-full px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-200 disabled:bg-teal-300"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Increment Token"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Token Management</h2>
        
        {selectedDoctor ? (
          <div className="text-center">
            <div className="mb-4 p-3 bg-teal-50 rounded-lg inline-block">
              <p className="text-gray-600">Selected Doctor:</p>
              <p className="font-semibold text-teal-700">{selectedDoctorData?.name}</p>
            </div>

            {token && (
              <div className="mb-6">
                <div className="inline-flex items-center justify-center bg-teal-600 text-white text-3xl font-bold rounded-full w-20 h-20">
                  {token}
                </div>
                <p className="mt-2 text-gray-600">Current Token</p>
              </div>
            )}
            
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-200 w-full md:w-auto"
            >
              Manage Doctor
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Please select a doctor to manage tokens</p>
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-2">
              <UserCheck className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenDisplay;