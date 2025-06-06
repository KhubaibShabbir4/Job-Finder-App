
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  tags: string[];
  datePosted: string;
  description?: string;
}

export interface JobFilters {
  keyword: string;
  jobType: string;
  location: string;
  tags: string[];
}

export interface SortOption {
  value: string;
  label: string;
}
