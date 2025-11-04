import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import StudentItem from '@/components/organisms/StudentItem';
import StudentModal from '@/components/organisms/StudentModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { studentService } from '@/services/api/studentService';
import { formatDate } from '@/utils/dateUtils';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getAll(searchTerm);
      setStudents(data);
    } catch (err) {
      setError('Failed to load students');
      console.error('Error loading students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.length === 0 || term.length >= 2) {
      try {
        setLoading(true);
        const data = await studentService.getAll(term);
        setStudents(data);
      } catch (err) {
        console.error('Error searching students:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = async (student) => {
    if (!confirm(`Are you sure you want to delete ${student.first_name_c} ${student.last_name_c}?`)) {
      return;
    }

    try {
      const success = await studentService.delete(student.Id);
      if (success) {
        await loadData();
      }
    } catch (err) {
      console.error('Error deleting student:', err);
    }
  };

  const handleSaveStudent = async (studentData) => {
    try {
      if (editingStudent) {
        await studentService.update(editingStudent.Id, studentData);
      } else {
        await studentService.create(studentData);
      }
      setIsModalOpen(false);
      setEditingStudent(null);
      await loadData();
    } catch (err) {
      console.error('Error saving student:', err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage student information and records
          </p>
        </div>
        <Button onClick={handleAddStudent} className="btn-hover">
          <ApperIcon name="UserPlus" size={20} />
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search students by name, email, or major..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
            icon="Search"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <ApperIcon name="Users" className="h-5 w-5 text-primary-600" />
            <span className="ml-2 text-sm font-medium text-gray-600">Total Students</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{students.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <ApperIcon name="GraduationCap" className="h-5 w-5 text-info-600" />
            <span className="ml-2 text-sm font-medium text-gray-600">Unique Majors</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {new Set(students.filter(s => s.major_c).map(s => s.major_c)).size}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <ApperIcon name="Calendar" className="h-5 w-5 text-success-600" />
            <span className="ml-2 text-sm font-medium text-gray-600">Graduating This Year</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {students.filter(s => s.graduation_date_c && new Date(s.graduation_date_c).getFullYear() === new Date().getFullYear()).length}
          </p>
        </div>
      </div>

      {/* Students List */}
      {students.length === 0 ? (
        <Empty
          message={searchTerm ? "No students found matching your search." : "No students yet."}
          action={
            !searchTerm && (
              <Button onClick={handleAddStudent} className="mt-4">
                <ApperIcon name="UserPlus" size={20} />
                Add Your First Student
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {students.map((student) => (
              <motion.div
                key={student.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <StudentItem
                  student={student}
                  onEdit={() => handleEditStudent(student)}
                  onDelete={() => handleDeleteStudent(student)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        student={editingStudent}
        onSave={handleSaveStudent}
      />
    </div>
  );
};

export default Students;