import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

export const studentService = {
  async getAll(searchTerm = '') {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "major_c" } },
          { field: { Name: "graduation_date_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [
          { fieldName: "last_name_c", sorttype: "ASC" },
          { fieldName: "first_name_c", sorttype: "ASC" }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      if (searchTerm) {
        params.whereGroups = [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "first_name_c",
                  operator: "Contains",
                  values: [searchTerm]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "last_name_c",
                  operator: "Contains", 
                  values: [searchTerm]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "email_c",
                  operator: "Contains",
                  values: [searchTerm]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "major_c",
                  operator: "Contains",
                  values: [searchTerm]
                }
              ]
            }
          ]
        }];
      }

      const response = await apperClient.fetchRecords('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error);
      toast.error("Failed to load students");
      return [];
    }
  },

  async getById(studentId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "major_c" } },
          { field: { Name: "graduation_date_c" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };

      const response = await apperClient.getRecordById('student_c', studentId, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${studentId}:`, error?.response?.data?.message || error);
      toast.error("Failed to load student details");
      return null;
    }
  },

  async create(studentData) {
    try {
      const apperClient = getApperClient();
      
      // Only include updateable fields
      const cleanData = {
        Name: studentData.Name || `${studentData.first_name_c || ''} ${studentData.last_name_c || ''}`.trim(),
        Tags: studentData.Tags || '',
        first_name_c: studentData.first_name_c || '',
        last_name_c: studentData.last_name_c || '',
        email_c: studentData.email_c || '',
        phone_c: studentData.phone_c || '',
        major_c: studentData.major_c || '',
        graduation_date_c: studentData.graduation_date_c || null
      };

      const params = {
        records: [cleanData]
      };

      const response = await apperClient.createRecord('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} student records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Student created successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error);
      toast.error("Failed to create student");
      return null;
    }
  },

  async update(studentId, studentData) {
    try {
      const apperClient = getApperClient();
      
      // Only include updateable fields plus Id
      const cleanData = {
        Id: studentId,
        Name: studentData.Name || `${studentData.first_name_c || ''} ${studentData.last_name_c || ''}`.trim(),
        Tags: studentData.Tags || '',
        first_name_c: studentData.first_name_c || '',
        last_name_c: studentData.last_name_c || '',
        email_c: studentData.email_c || '',
        phone_c: studentData.phone_c || '',
        major_c: studentData.major_c || '',
        graduation_date_c: studentData.graduation_date_c || null
      };

      const params = {
        records: [cleanData]
      };

      const response = await apperClient.updateRecord('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} student records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Student updated successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error);
      toast.error("Failed to update student");
      return null;
    }
  },

  async delete(studentIds) {
    try {
      const apperClient = getApperClient();
      
      const recordIds = Array.isArray(studentIds) ? studentIds : [studentIds];
      
      const params = {
        RecordIds: recordIds
      };

      const response = await apperClient.deleteRecord('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} student records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const deletedCount = successful.length;
          toast.success(`${deletedCount} student${deletedCount > 1 ? 's' : ''} deleted successfully`);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting students:", error?.response?.data?.message || error);
      toast.error("Failed to delete students");
      return false;
    }
  }
};