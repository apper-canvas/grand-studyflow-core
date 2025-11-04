import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const assignmentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('assignment_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "type_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to UI format
      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c,
        description: assignment.description_c,
        dueDate: assignment.due_date_c,
        completed: assignment.completed_c || false,
        courseId: assignment.course_id_c?.Id?.toString() || assignment.course_id_c?.toString(),
        priority: assignment.priority_c,
        grade: assignment.grade_c,
        weight: assignment.weight_c,
        type: assignment.type_c
      }));
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('assignment_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "type_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        throw new Error("Assignment not found");
      }

      // Transform database fields to UI format
      const assignment = response.data;
      return {
        Id: assignment.Id,
        title: assignment.title_c,
        description: assignment.description_c,
        dueDate: assignment.due_date_c,
        completed: assignment.completed_c || false,
        courseId: assignment.course_id_c?.Id?.toString() || assignment.course_id_c?.toString(),
        priority: assignment.priority_c,
        grade: assignment.grade_c,
        weight: assignment.weight_c,
        type: assignment.type_c
      };
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(assignmentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Transform UI format to database fields (only Updateable fields)
      const dbAssignment = {
        title_c: assignmentData.title,
        description_c: assignmentData.description,
        due_date_c: assignmentData.dueDate,
        completed_c: assignmentData.completed || false,
        course_id_c: parseInt(assignmentData.courseId),
        priority_c: assignmentData.priority,
        grade_c: assignmentData.grade,
        weight_c: assignmentData.weight,
        type_c: assignmentData.type
      };

      const response = await apperClient.createRecord('assignment_c', {
        records: [dbAssignment]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create assignment");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} assignments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdAssignment = successful[0].data;
          return {
            Id: createdAssignment.Id,
            title: createdAssignment.title_c,
            description: createdAssignment.description_c,
            dueDate: createdAssignment.due_date_c,
            completed: createdAssignment.completed_c || false,
            courseId: createdAssignment.course_id_c?.Id?.toString() || createdAssignment.course_id_c?.toString(),
            priority: createdAssignment.priority_c,
            grade: createdAssignment.grade_c,
            weight: createdAssignment.weight_c,
            type: createdAssignment.type_c
          };
        }
      }

      throw new Error("Failed to create assignment");
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, assignmentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Transform UI format to database fields (only Updateable fields)
      const dbAssignment = {
        Id: parseInt(id),
        title_c: assignmentData.title,
        description_c: assignmentData.description,
        due_date_c: assignmentData.dueDate,
        completed_c: assignmentData.completed || false,
        course_id_c: parseInt(assignmentData.courseId),
        priority_c: assignmentData.priority,
        grade_c: assignmentData.grade,
        weight_c: assignmentData.weight,
        type_c: assignmentData.type
      };

      const response = await apperClient.updateRecord('assignment_c', {
        records: [dbAssignment]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update assignment");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} assignments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedAssignment = successful[0].data;
          return {
            Id: updatedAssignment.Id,
            title: updatedAssignment.title_c,
            description: updatedAssignment.description_c,
            dueDate: updatedAssignment.due_date_c,
            completed: updatedAssignment.completed_c || false,
            courseId: updatedAssignment.course_id_c?.Id?.toString() || updatedAssignment.course_id_c?.toString(),
            priority: updatedAssignment.priority_c,
            grade: updatedAssignment.grade_c,
            weight: updatedAssignment.weight_c,
            type: updatedAssignment.type_c
          };
        }
      }

      throw new Error("Failed to update assignment");
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('assignment_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} assignments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error);
      return false;
    }
  },

  async toggleComplete(id, completed) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.updateRecord('assignment_c', {
        records: [{
          Id: parseInt(id),
          completed_c: completed
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to toggle assignment completion");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} assignments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error toggling assignment completion:", error?.response?.data?.message || error);
      throw error;
    }
  }
};