import { useState } from "react";
import { User, Mail, Phone, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { useTrips } from "../context/TripContext";
import { getInitials } from "../utils/formatters";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { trips } = useTrips();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    password: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, phone: form.phone };
      if (form.password) payload.password = form.password;

      const updated = await authService.updateProfile(payload);
      updateUser(updated);
      setForm((prev) => ({ ...prev, password: "" }));
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-semibold text-primary-700">
            {getInitials(user?.name)}
          </span>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{user?.name}</h1>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="card text-center">
            <p className="text-2xl font-bold text-primary-700">{trips.length}</p>
            <p className="text-sm text-slate-500">Total Trips</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-primary-700">
              {trips.filter((t) => t.status === "generated").length}
            </p>
            <p className="text-sm text-slate-500">AI Itineraries</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Edit Profile</h2>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={user?.email}
                disabled
                className="input-field cursor-not-allowed bg-slate-50 pl-10 text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Optional"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">New Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="input-field"
            />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
