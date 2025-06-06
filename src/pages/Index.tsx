
import React, { useState, useEffect } from 'react';
import { Job, JobFilters } from '../types/Job';
import { jobService } from '../services/jobService';
import JobCard from '../components/JobCard';
import JobForm from '../components/JobForm';
import JobFiltersComponent from '../components/JobFilters';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Briefcase } from 'lucide-react';

const Index = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({
    keyword: '',
    jobType: 'All',
    location: 'All',
    tags: []
  });
  const [sortBy, setSortBy] = useState('date_desc');
  const { toast } = useToast();

  // Get all unique tags for filter options
  const availableTags = Array.from(
    new Set(jobs.flatMap(job => job.tags))
  ).sort();

  useEffect(() => {
    loadJobs();
  }, [filters, sortBy]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const filterParams = {
        keyword: filters.keyword || undefined,
        jobType: filters.jobType !== 'All' ? filters.jobType : undefined,
        location: filters.location !== 'All' ? filters.location : undefined,
        tags: filters.tags.length > 0 ? filters.tags : undefined,
        sortBy
      };
      
      const jobsData = await jobService.getAllJobs(filterParams);
      setJobs(jobsData);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = () => {
    setEditingJob(undefined);
    setShowForm(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleDeleteJob = async (id: string) => {
    try {
      await jobService.deleteJob(id);
      await loadJobs();
      toast({
        title: "Success",
        description: "Job deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: "Error",
        description: "Failed to delete job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (jobData: Omit<Job, 'id' | 'datePosted'>) => {
    try {
      setIsSubmitting(true);
      
      if (editingJob) {
        await jobService.updateJob(editingJob.id, jobData);
        toast({
          title: "Success",
          description: "Job updated successfully!",
        });
      } else {
        await jobService.createJob(jobData);
        toast({
          title: "Success",
          description: "Job added successfully!",
        });
      }
      
      setShowForm(false);
      setEditingJob(undefined);
      await loadJobs();
    } catch (error) {
      console.error('Error submitting job:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingJob ? 'update' : 'add'} job. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingJob(undefined);
  };

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      jobType: 'All',
      location: 'All',
      tags: []
    });
    setSortBy('date_desc');
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <JobForm
            job={editingJob}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Job Finder</h1>
                <p className="text-gray-600">Discover your next career opportunity</p>
              </div>
            </div>
            <Button onClick={handleAddJob} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Job
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <JobFiltersComponent
          filters={filters}
          sortBy={sortBy}
          onFiltersChange={setFilters}
          onSortChange={setSortBy}
          onResetFilters={handleResetFilters}
          availableTags={availableTags}
        />

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `Showing ${jobs.length} job${jobs.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg border p-6 animate-pulse">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">
              {filters.keyword || filters.jobType !== 'All' || filters.location !== 'All' || filters.tags.length > 0
                ? 'Try adjusting your filters to see more results.'
                : 'Be the first to add a job listing!'}
            </p>
            <Button onClick={handleAddJob} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add First Job
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={handleEditJob}
                onDelete={handleDeleteJob}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
