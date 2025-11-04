import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { formatDate } from '@/utils/dateUtils';

const StudentItem = ({ student, onEdit, onDelete }) => {
  const getInitials = (firstName = '', lastName = '') => {
    const first = firstName.charAt(0).toUpperCase();
    const last = lastName.charAt(0).toUpperCase();
    return `${first}${last}`;
  };

  const formatGraduationStatus = (graduationDate) => {
    if (!graduationDate) return null;
    
    const gradDate = new Date(graduationDate);
    const today = new Date();
    const monthsUntilGrad = Math.ceil((gradDate.getTime() - today.getTime()) / (1000 * 3600 * 24 * 30));
    
    if (monthsUntilGrad < 0) {
      return { text: 'Graduated', color: 'success' };
    } else if (monthsUntilGrad <= 6) {
      return { text: 'Graduating Soon', color: 'warning' };
    } else {
      return { text: `${Math.ceil(monthsUntilGrad / 12)} years left`, color: 'info' };
    }
  };

  const graduationStatus = formatGraduationStatus(student.graduation_date_c);
  const tags = student.Tags ? student.Tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
            {getInitials(student.first_name_c, student.last_name_c)}
          </div>
          
          {/* Student Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {student.first_name_c} {student.last_name_c}
              </h3>
              {graduationStatus && (
                <Badge variant={graduationStatus.color} size="sm">
                  {graduationStatus.text}
                </Badge>
              )}
            </div>
            
            <div className="mt-1 space-y-1">
              {student.email_c && (
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Mail" size={14} className="mr-2 text-gray-400" />
                  <a href={`mailto:${student.email_c}`} className="hover:text-primary-600">
                    {student.email_c}
                  </a>
                </div>
              )}
              
              {student.phone_c && (
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Phone" size={14} className="mr-2 text-gray-400" />
                  <a href={`tel:${student.phone_c}`} className="hover:text-primary-600">
                    {student.phone_c}
                  </a>
                </div>
              )}
              
              {student.major_c && (
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="GraduationCap" size={14} className="mr-2 text-gray-400" />
                  {student.major_c}
                </div>
              )}
              
              {student.graduation_date_c && (
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Calendar" size={14} className="mr-2 text-gray-400" />
                  Expected graduation: {formatDate(student.graduation_date_c)}
                </div>
              )}
            </div>
            
            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Timestamps */}
            <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
              {student.CreatedOn && (
                <span>Created {formatDate(student.CreatedOn)}</span>
              )}
              {student.ModifiedOn && student.ModifiedOn !== student.CreatedOn && (
                <span>Updated {formatDate(student.ModifiedOn)}</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="text-gray-600 hover:text-primary-600"
          >
            <ApperIcon name="Edit2" size={16} />
          </Button>
          <Button
            variant="ghost" 
            size="sm"
            onClick={onDelete}
            className="text-gray-600 hover:text-danger-600"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default StudentItem;