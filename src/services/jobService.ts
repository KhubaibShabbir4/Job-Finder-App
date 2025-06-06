
import { Job } from '../types/Job';

// Mock data for demonstration
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    jobType: 'Full-time',
    tags: ['React', 'TypeScript', 'JavaScript', 'CSS'],
    datePosted: '2024-06-01',
    description: 'Join our team to build amazing user experiences with React and TypeScript.'
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    company: 'Creative Studios',
    location: 'New York, NY',
    jobType: 'Full-time',
    tags: ['Figma', 'Design Systems', 'User Research'],
    datePosted: '2024-06-02',
    description: 'Design beautiful and intuitive user interfaces for our web applications.'
  },
  {
    id: '3',
    title: 'Backend Developer',
    company: 'DataFlow Solutions',
    location: 'Remote',
    jobType: 'Remote',
    tags: ['Node.js', 'Python', 'API Design', 'Database'],
    datePosted: '2024-06-03',
    description: 'Build scalable backend services and APIs for our growing platform.'
  },
  {
    id: '4',
    title: 'Marketing Intern',
    company: 'StartupX',
    location: 'Austin, TX',
    jobType: 'Internship',
    tags: ['Digital Marketing', 'Social Media', 'Content Creation'],
    datePosted: '2024-06-04',
    description: 'Learn and contribute to our marketing efforts in a fast-paced startup environment.'
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    location: 'Seattle, WA',
    jobType: 'Contract',
    tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    datePosted: '2024-06-05',
    description: 'Help us build and maintain our cloud infrastructure and deployment pipelines.'
  },
  {
    id: '6',
    title: 'Product Manager',
    company: 'InnovateCorp',
    location: 'Los Angeles, CA',
    jobType: 'Full-time',
    tags: ['Product Strategy', 'Agile', 'Analytics', 'Leadership'],
    datePosted: '2024-06-06',
    description: 'Lead product development and strategy for our flagship applications.'
  }
];

let jobs: Job[] = [...mockJobs];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const jobService = {
  async getAllJobs(filters?: { keyword?: string; jobType?: string; location?: string; tags?: string[]; sortBy?: string }): Promise<Job[]> {
    await delay(300); // Simulate network delay
    
    let filteredJobs = [...jobs];
    
    if (filters?.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(keyword) || 
        job.company.toLowerCase().includes(keyword)
      );
    }
    
    if (filters?.jobType && filters.jobType !== 'All') {
      filteredJobs = filteredJobs.filter(job => job.jobType === filters.jobType);
    }
    
    if (filters?.location && filters.location !== 'All') {
      filteredJobs = filteredJobs.filter(job => job.location.includes(filters.location));
    }
    
    if (filters?.tags && filters.tags.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        filters.tags.some(tag => job.tags.includes(tag))
      );
    }
    
    // Sort jobs
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'date_desc':
          filteredJobs.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());
          break;
        case 'date_asc':
          filteredJobs.sort((a, b) => new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime());
          break;
        case 'title_asc':
          filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'company_asc':
          filteredJobs.sort((a, b) => a.company.localeCompare(b.company));
          break;
      }
    }
    
    return filteredJobs;
  },
  
  async getJobById(id: string): Promise<Job | null> {
    await delay(200);
    return jobs.find(job => job.id === id) || null;
  },
  
  async createJob(jobData: Omit<Job, 'id' | 'datePosted'>): Promise<Job> {
    await delay(400);
    
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      datePosted: new Date().toISOString().split('T')[0]
    };
    
    jobs.unshift(newJob);
    return newJob;
  },
  
  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    await delay(400);
    
    const jobIndex = jobs.findIndex(job => job.id === id);
    if (jobIndex === -1) {
      throw new Error('Job not found');
    }
    
    jobs[jobIndex] = { ...jobs[jobIndex], ...jobData };
    return jobs[jobIndex];
  },
  
  async deleteJob(id: string): Promise<void> {
    await delay(300);
    
    const jobIndex = jobs.findIndex(job => job.id === id);
    if (jobIndex === -1) {
      throw new Error('Job not found');
    }
    
    jobs.splice(jobIndex, 1);
  }
};
