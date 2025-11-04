import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const courseService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('course_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "schedule_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to UI format
      return response.data.map(course => ({
        Id: course.Id,
        name: course.name_c,
        instructor: course.instructor_c,
        color: course.color_c,
        credits: course.credits_c,
        semester: course.semester_c,
        schedule: course.schedule_c ? JSON.parse(course.schedule_c) : []
      }));
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('course_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "schedule_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        throw new Error("Course not found");
      }

      // Transform database fields to UI format
      const course = response.data;
      return {
        Id: course.Id,
        name: course.name_c,
        instructor: course.instructor_c,
        color: course.color_c,
        credits: course.credits_c,
        semester: course.semester_c,
        schedule: course.schedule_c ? JSON.parse(course.schedule_c) : []
      };
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(courseData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Transform UI format to database fields (only Updateable fields)
      const dbCourse = {
        name_c: courseData.name,
        instructor_c: courseData.instructor,
        color_c: courseData.color,
        credits_c: courseData.credits,
        semester_c: courseData.semester,
        schedule_c: JSON.stringify(courseData.schedule || [])
      };

      const response = await apperClient.createRecord('course_c', {
        records: [dbCourse]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create course");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} courses:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdCourse = successful[0].data;
          return {
            Id: createdCourse.Id,
            name: createdCourse.name_c,
            instructor: createdCourse.instructor_c,
            color: createdCourse.color_c,
            credits: createdCourse.credits_c,
            semester: createdCourse.semester_c,
            schedule: createdCourse.schedule_c ? JSON.parse(createdCourse.schedule_c) : []
          };
        }
      }

      throw new Error("Failed to create course");
    } catch (error) {
      console.error("Error creating course:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, courseData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Transform UI format to database fields (only Updateable fields)
      const dbCourse = {
        Id: parseInt(id),
        name_c: courseData.name,
        instructor_c: courseData.instructor,
        color_c: courseData.color,
        credits_c: courseData.credits,
        semester_c: courseData.semester,
        schedule_c: JSON.stringify(courseData.schedule || [])
      };

      const response = await apperClient.updateRecord('course_c', {
        records: [dbCourse]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update course");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} courses:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedCourse = successful[0].data;
          return {
            Id: updatedCourse.Id,
            name: updatedCourse.name_c,
            instructor: updatedCourse.instructor_c,
            color: updatedCourse.color_c,
            credits: updatedCourse.credits_c,
            semester: updatedCourse.semester_c,
            schedule: updatedCourse.schedule_c ? JSON.parse(updatedCourse.schedule_c) : []
          };
        }
      }

      throw new Error("Failed to update course");
    } catch (error) {
      console.error("Error updating course:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('course_c', {
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
          console.error(`Failed to delete ${failed.length} courses:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting course:", error?.response?.data?.message || error);
      return false;
    }
  }
};