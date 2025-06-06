
# Flask Job Listings API

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set environment variables (optional):
```bash
export DATABASE_URL=sqlite:///jobs.db  # or your PostgreSQL/MySQL URL
```

3. Run the server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Jobs
- `GET /api/jobs` - Get all jobs with optional filtering and sorting
- `GET /api/jobs/<id>` - Get a specific job
- `POST /api/jobs` - Create a new job
- `PUT /api/jobs/<id>` - Update a job
- `DELETE /api/jobs/<id>` - Delete a job

### Query Parameters for GET /api/jobs
- `keyword` - Filter by title or company
- `jobType` - Filter by job type (Full-time, Part-time, Contract, Internship, Remote)
- `location` - Filter by location
- `tags` - Filter by tags (can specify multiple)
- `sortBy` - Sort results (date_desc, date_asc, title_asc, company_asc)

### Example Requests

```bash
# Get all jobs
curl http://localhost:5000/api/jobs

# Filter by job type
curl "http://localhost:5000/api/jobs?jobType=Full-time"

# Search by keyword and sort
curl "http://localhost:5000/api/jobs?keyword=developer&sortBy=title_asc"

# Create a new job
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineer",
    "company": "Tech Corp",
    "location": "San Francisco, CA",
    "jobType": "Full-time",
    "tags": ["Python", "Django", "API"],
    "description": "Build amazing software"
  }'
```

## Database

The API uses SQLite by default, but you can configure it to use PostgreSQL or MySQL by setting the `DATABASE_URL` environment variable.

### For PostgreSQL:
```bash
export DATABASE_URL=postgresql://username:password@localhost/joblistings
```

### For MySQL:
```bash
export DATABASE_URL=mysql://username:password@localhost/joblistings
```
