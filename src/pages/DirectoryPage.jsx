import React, { useState, useMemo } from 'react';
import alumniData from '../data/alumniData.json';
import DirectoryHeader from '../components/DirectoryHeader';
import SearchFilters from '../components/SearchFilters';
import AlumniCard from '../components/AlumniCard';
import AlumniModal from '../components/AlumniModal';
import AlumniDetailModal from '../components/AlumniDetailModal';

const INITIAL_ALUMNI = alumniData.alumni;
const DOMAINS = alumniData.domains;

export default function DirectoryPage({ isAdmin }) {
  const [alumniList, setAlumniList] = useState(INITIAL_ALUMNI);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedAlumni, setSelectedAlumni] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    field: 'Enterprise Tech',
    degree: '',
    graduationYear: 2024,
    role: '',
    company: '',
    location: '',
    bio: '',
    avatar: '',
    linkedinUrl: ''
  });

  const filteredAlumni = useMemo(() => {
    return alumniList.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDomain = selectedDomain === 'All' || item.field === selectedDomain;
      return matchesSearch && matchesDomain;
    });
  }, [alumniList, searchTerm, selectedDomain]);

  const handleOpenModal = (alumni = null) => {
    if (!isAdmin) return;
    if (alumni) {
      setEditingId(alumni.id);
      setFormData(alumni);
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        field: 'Enterprise Tech',
        degree: 'B.Tech CSE',
        graduationYear: new Date().getFullYear(),
        role: '',
        company: '',
        location: '',
        bio: '',
        avatar: '',
        linkedinUrl: 'https://linkedin.com'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) return;

    if (editingId) {
      setAlumniList((prev) =>
        prev.map((item) => (item.id === editingId ? { ...formData, id: editingId } : item))
      );
    } else {
      setAlumniList((prev) => [{ ...formData, id: Date.now().toString() }, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (!isAdmin) return;
    if (window.confirm('Are you sure you want to remove this profile?')) {
      setAlumniList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 pt-10">
      <DirectoryHeader totalCount={filteredAlumni.length} />

      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        domains={DOMAINS}
        selectedDomain={selectedDomain}
        setSelectedDomain={setSelectedDomain}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map((item) => (
          <AlumniCard
            key={item.id}
            item={item}
            isAdmin={isAdmin}
            onCardClick={(alumni) => setSelectedAlumni(alumni)}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredAlumni.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-sm font-medium text-slate-500">No alumni matched your search criteria.</p>
        </div>
      )}

      <AlumniDetailModal
        alumni={selectedAlumni}
        onClose={() => setSelectedAlumni(null)}
      />

      {isAdmin && (
        <AlumniModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          isEditing={Boolean(editingId)}
          domains={DOMAINS}
        />
      )}
    </main>
  );
}