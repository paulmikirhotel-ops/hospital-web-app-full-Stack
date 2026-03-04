import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    IoCloudUploadOutline, IoMedicalOutline, IoCloseCircleOutline, 
    IoLockClosedOutline, IoMailOutline, IoTimeOutline 
} from 'react-icons/io5';
import API from '../../../api/axiosConfig';

const AddDoctor = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        specialization: '',
        fee: '',
        experience: '1 Year', // Default value
        qualification: '',
        about: ''
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation: Ensure 'image' is an actual File object
    if (!image || !(image instanceof File)) {
        return toast.error("Please select a valid image file");
    }

    const data = new FormData();
    
    // 2. Append text fields
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('specialization', formData.specialization);
    data.append('fee', formData.fee);
    data.append('experience', formData.experience);
    data.append('qualification', formData.qualification);
    data.append('about', formData.about);

    // 3. 🔥 THE CRITICAL FIX: 
    // This 'image' must be the File object from your useState(null)
    data.append('image', image); 

    setIsSubmitting(true);
    try {
        // 4. IMPORTANT: Do NOT set Content-Type manually in headers.
        // Axios will automatically set 'multipart/form-data' with the correct boundary.
        const response = await API.post('/doctors/add-doctor-direct', data);
        
        if (response.data.success) {
            toast.success("Doctor Created!");
            navigate('/admin/dashboard');
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Upload Failed");
    } finally {
        setIsSubmitting(false);
    }
};

    return (
        <div className="p-4 lg:p-12 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                
                <div className="bg-blue-600 p-10 text-white">
                    <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <IoMedicalOutline /> New Specialist Registration
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                    
                    {/* AUTH SECTION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-[2rem]">
                        <input type="email" required placeholder="Login Email" className="p-4 rounded-2xl border-none font-bold text-sm" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        <input type="text" required placeholder="Set Password" className="p-4 rounded-2xl border-none font-bold text-sm" onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>

                    {/* CLINICAL SECTION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" placeholder="Dr. Full Name" required className="p-5 bg-slate-50 rounded-2xl font-bold text-sm" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        
                        <select required className="p-5 bg-slate-50 rounded-2xl font-bold text-sm" onChange={(e) => setFormData({...formData, specialization: e.target.value})}>
                            <option value="">Specialization</option>
                            <option value="General Physician">General Physician</option>
                            <option value="Cardiologist">Cardiologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                        </select>

                        <input type="text" placeholder="Degree (e.g. MD)" required className="p-5 bg-slate-50 rounded-2xl font-bold text-sm" onChange={(e) => setFormData({...formData, qualification: e.target.value})} />
                        
                        {/* EXPERIENCE DROPDOWN */}
                        <div className="relative">
                            <IoTimeOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select 
                                className="w-full pl-12 p-5 bg-slate-50 rounded-2xl font-bold text-sm"
                                value={formData.experience}
                                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                            >
                                <option value="1 Year">1 Year</option>
                                <option value="3 Years">3 Years</option>
                                <option value="5+ Years">5+ Years</option>
                                <option value="10+ Years">10+ Years</option>
                            </select>
                        </div>

                        <input type="number" placeholder="Fee ($)" required className="p-5 bg-slate-50 rounded-2xl font-bold text-sm" onChange={(e) => setFormData({...formData, fee: e.target.value})} />
                    </div>

                    <textarea placeholder="Biography..." className="w-full p-6 bg-slate-50 rounded-[2rem] font-bold text-sm h-32" onChange={(e) => setFormData({...formData, about: e.target.value})} />

                    {/* IMAGE UPLOAD (Supports webp) */}
                    <div className="space-y-2">
                        {!imagePreview ? (
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:bg-blue-50 transition-all">
                                <IoCloudUploadOutline size={30} className="text-slate-300" />
                                <span className="text-[10px] font-bold text-slate-400">JPG, PNG, or WEBP</span>
                                <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg, image/webp" onChange={handleImageChange} />
                            </label>
                        ) : (
                            <div className="relative h-32 w-32 mx-auto rounded-full overflow-hidden border-4 border-blue-50">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => {setImage(null); setImagePreview(null);}} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <IoCloseCircleOutline size={30} className="text-white" />
                                </button>
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full py-6 rounded-[2rem] bg-blue-600 text-white font-black uppercase tracking-widest text-[11px] hover:bg-slate-900 transition-all shadow-xl shadow-blue-100">
                        {isSubmitting ? 'Processing...' : 'Activate Doctor Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddDoctor;