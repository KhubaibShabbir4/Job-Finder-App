
import { Job } from '../types/Job';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API requests
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  // Handle 204 No Content responses
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const jobService = {
  async getAllJobs(filters?: { keyword?: string; jobType?: string; location?: string; tags?: string[]; sortBy?: string }): Promise<Job[]> {
    const params = new URLSearchParams();
    
    if (filters?.keyword) {
      params.append('keyword', filters.keyword);
    }
    
    if (filters?.jobType && filters.jobType !== 'All') {
      params.append('jobType', filters.jobType);
    }
    
    if (filters?.location && filters.location !== 'All') {
      params.append('location', filters.location);
    }
    
    if (filters?.tags && filters.tags.length > 0) {
      filters.tags.forEach(tag => {
        params.append('tags', tag);
      });
    }
    
    if (filters?.sortBy) {
      params.append('sortBy', filters.sortBy);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/jobs?${queryString}` : '/jobs';
    
    return apiRequest(url);
  },
  
  async getJobById(id: string): Promise<Job | null> {
    try {
      return await apiRequest(`/jobs/${id}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  },
  
  async createJob(jobData: Omit<Job, 'id' | 'datePosted'>): Promise<Job> {
    return apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },
  
  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    return apiRequest(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  },
  
  async deleteJob(id: string): Promise<void> {
    await apiRequest(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }
};
