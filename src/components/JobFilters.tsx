
import React from 'react';
import { JobFilters, SortOption } from '../types/Job';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Search } from 'lucide-react';

interface JobFiltersProps {
  filters: JobFilters;
  sortBy: string;
  onFiltersChange: (filters: JobFilters) => void;
  onSortChange: (sortBy: string) => void;
  onResetFilters: () => void;
  availableTags: string[];
}

const sortOptions: SortOption[] = [
  { value: 'date_desc', label: 'Newest First' },
  { value: 'date_asc', label: 'Oldest First' },
  { value: 'title_asc', label: 'Title A-Z' },
  { value: 'company_asc', label: 'Company A-Z' }
];

const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const locations = ['All', 'San Francisco', 'New York', 'Austin', 'Seattle', 'Los Angeles', 'Remote'];

const JobFiltersComponent: React.FC<JobFiltersProps> = ({
  filters,
  sortBy,
  onFiltersChange,
  onSortChange,
  onResetFilters,
  availableTags
}) => {
  const handleKeywordChange = (keyword: string) => {
    onFiltersChange({ ...filters, keyword });
  };

  const handleJobTypeChange = (jobType: string) => {
    onFiltersChange({ ...filters, jobType });
  };

  const handleLocationChange = (location: string) => {
    onFiltersChange({ ...filters, location });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const removeTag = (tag: string) => {
    onFiltersChange({
      ...filters,
      tags: filters.tags.filter(t => t !== tag)
    });
  };

  const hasActiveFilters = filters.keyword || filters.jobType !== 'All' || filters.location !== 'All' || filters.tags.length > 0;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filter & Sort Jobs</CardTitle>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onResetFilters}>
              Reset All Filters
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search and Sort Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Jobs</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                value={filters.keyword}
                onChange={(e) => handleKeywordChange(e.target.value)}
                placeholder="Search by title or company..."
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Job Type</Label>
            <Select value={filters.jobType} onValueChange={handleJobTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {jobTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Location</Label>
            <Select value={filters.location} onValueChange={handleLocationChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {locations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tags Section */}
        <div className="space-y-2">
          <Label>Filter by Tags</Label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <Badge
                key={tag}
                variant={filters.tags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  filters.tags.includes(tag) 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-gray-700">Active Filters:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.keyword && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-800">
                  Search: "{filters.keyword}"
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => handleKeywordChange('')}
                  />
                </Badge>
              )}
              {filters.jobType !== 'All' && (
                <Badge variant="secondary" className="bg-green-50 text-green-800">
                  Type: {filters.jobType}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => handleJobTypeChange('All')}
                  />
                </Badge>
              )}
              {filters.location !== 'All' && (
                <Badge variant="secondary" className="bg-purple-50 text-purple-800">
                  Location: {filters.location}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => handleLocationChange('All')}
                  />
                </Badge>
              )}
              {filters.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-orange-50 text-orange-800">
                  Tag: {tag}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobFiltersComponent;
