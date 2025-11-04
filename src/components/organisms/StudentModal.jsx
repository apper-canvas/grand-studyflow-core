import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from '@/components/atoms/Modal';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const StudentModal = ({ isOpen, onClose, student, onSave }) => {
  const [formData, setFormData] = useState({
    first_name_c: '',
    last_name_c: '',
    email_c: '',
    phone_c: '',
    major_c: '',
    graduation_date_c: '',
    Tags: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        first_name_c: student.first_name_c || '',
        last_name_c: student.last_name_c || '',
        email_c: student.email_c || '',
        phone_c: student.phone_c || '',
        major_c: student.major_c || '',
        graduation_date_c: student.graduation_date_c ? student.graduation_date_c.split('T')[0] : '',
        Tags: student.Tags || ''
      });
    } else {
      setFormData({
        first_name_c: '',
        last_name_c: '',
        email_c: '',
        phone_c: '',
        major_c: '',
        graduation_date_c: '',
        Tags: ''
      });
    }
    setErrors({});
  }, [student, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name_c.trim()) {
      newErrors.first_name_c = 'First name is required';
    }
    
    if (!formData.last_name_c.trim()) {
      newErrors.last_name_c = 'Last name is required';
    }

    if (!formData.email_c.trim()) {
      newErrors.email_c = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_c)) {
      newErrors.email_c = 'Please enter a valid email address';
    }

    if (formData.phone_c && !/^[\d\s\-\+\(\)]+$/.test(formData.phone_c)) {
      newErrors.phone_c = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setLoading(true);
    try {
      // Format graduation date for API
      const submitData = {
        ...formData,
        graduation_date_c: formData.graduation_date_c || null,
        Name: `${formData.first_name_c} ${formData.last_name_c}`.trim()
      };
      
      await onSave(submitData);
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error('Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={student ? "Edit Student" : "Add New Student"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <Input
              value={formData.first_name_c}
              onChange={(e) => handleInputChange('first_name_c', e.target.value)}
              placeholder="Enter first name"
              error={errors.first_name_c}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <Input
              value={formData.last_name_c}
              onChange={(e) => handleInputChange('last_name_c', e.target.value)}
              placeholder="Enter last name"
              error={errors.last_name_c}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <Input
            type="email"
            value={formData.email_c}
            onChange={(e) => handleInputChange('email_c', e.target.value)}
            placeholder="Enter email address"
            error={errors.email_c}
            icon="Mail"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <Input
            type="tel"
            value={formData.phone_c}
            onChange={(e) => handleInputChange('phone_c', e.target.value)}
            placeholder="Enter phone number"
            error={errors.phone_c}
            icon="Phone"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Major
          </label>
          <Input
            value={formData.major_c}
            onChange={(e) => handleInputChange('major_c', e.target.value)}
            placeholder="Enter major or field of study"
            icon="GraduationCap"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected Graduation Date
          </label>
          <Input
            type="date"
            value={formData.graduation_date_c}
            onChange={(e) => handleInputChange('graduation_date_c', e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <Input
            value={formData.Tags}
            onChange={(e) => handleInputChange('Tags', e.target.value)}
            placeholder="Enter tags separated by commas"
            icon="Tag"
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use tags to categorize students (e.g., honors, athlete, international)
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            loading={loading}
            className="btn-hover"
          >
            <ApperIcon name="Save" size={16} />
            {student ? "Update Student" : "Add Student"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentModal;