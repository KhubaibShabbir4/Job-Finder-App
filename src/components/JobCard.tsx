
import React from 'react';
import { Job } from '../types/Job';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Building, Briefcase } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job listing?')) {
      onDelete(job.id);
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 leading-tight">
            {job.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Building className="h-4 w-4" />
              <span className="font-medium">{job.company}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Briefcase className="h-4 w-4" />
              <span className="font-medium">{job.jobType}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(job.datePosted)}</span>
            </div>
          </div>
          
          {job.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {job.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 border-t">
        <div className="flex space-x-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(job)}
            className="flex-1"
          >
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDelete}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
