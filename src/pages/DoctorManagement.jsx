import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Plus, Trash2, UserCheck, X, Loader } from "lucide-react";
import axiosInstance from "../api/axiosInstance.js";

function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", specialization: "" });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("api/hospital/doctors");
      setDoctors(data);
    } catch (error) {
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("api/hospital/doctors", formData);
      setDoctors([...doctors, data]);
      toast.success("Doctor added successfully");
      setShowModal(false);
      setFormData({ name: "", specialization: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add doctor");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    
    setDeletingId(id);
    try {
      await axiosInstance.delete(`api/hospital/doctors/${id}`);
      setDoctors(doctors.filter(doctor => doctor._id !== id));
      toast.success("Doctor deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete doctor");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-t-lg shadow-lg border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Doctor Management</h1>
              <p className="text-gray-500 mt-1">Manage your hospital's doctors</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg flex items-center hover:bg-teal-700 transition shadow-md w-full md:w-auto justify-center"
            >
              <Plus className="h-5 w-5 mr-2" /> Add New Doctor
            </button>
          </div>
        </div>

        {/* Doctor List */}
        <div className="bg-white rounded-b-lg shadow-lg p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="h-8 w-8 text-teal-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading doctors...</span>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No doctors found</h3>
              <p className="text-gray-500 mt-1">Get started by adding your first doctor</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
              >
                <Plus className="h-4 w-4 inline mr-1" /> Add Doctor
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Doctors</h2>
                <p className="text-gray-500 text-sm">{doctors.length} doctor(s) registered</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {doctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition group"
                  >
                    <div className="bg-teal-600 h-2"></div>
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <div className="bg-teal-100 p-3 rounded-full">
                            <UserCheck className="h-6 w-6 text-teal-700" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">Dr. {doctor.name}</h3>
                            <p className="text-gray-500">{doctor.specialization}</p>
                            <div className={`mt-2 px-3 py-1 inline-block rounded-full text-xs font-medium ${
                              doctor.availability 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {doctor.availability ? "Available" : "Unavailable"}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(doctor._id)}
                          className={`text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition ${
                            deletingId === doctor._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={deletingId === doctor._id}
                        >
                          {deletingId === doctor._id ? (
                            <Loader className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-fadeIn">
            <div className="bg-teal-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
              <h2 className="text-xl font-bold">Add New Doctor</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-white hover:text-teal-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter doctor's name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g. Cardiology, Pediatrics"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition shadow"
                >
                  Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorManagement;