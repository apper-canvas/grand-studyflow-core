import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        <div className="space-y-4">
          <ApperIcon 
            name="FileQuestion" 
            size={80} 
            className="text-gray-400 mx-auto" 
          />
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">404</h1>
            <h2 className="text-xl font-semibold text-gray-700">Page Not Found</h2>
            <p className="text-gray-600">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            icon="Home"
            onClick={() => navigate("/")}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="outline"
            icon="ArrowLeft"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Looking for something specific? Try these quick links:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="ghost"
              size="sm"
              icon="BookOpen"
              onClick={() => navigate("/courses")}
              className="justify-start"
            >
              Courses
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon="ClipboardList"
              onClick={() => navigate("/assignments")}
              className="justify-start"
            >
              Assignments
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon="Calendar"
              onClick={() => navigate("/calendar")}
              className="justify-start"
            >
              Calendar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon="Trophy"
              onClick={() => navigate("/grades")}
              className="justify-start"
            >
              Grades
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;