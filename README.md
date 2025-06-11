# The link of the Loom video is as below
https://www.loom.com/share/adf8f8d8112a45808c1d3497789629be?sid=09f8c403-0e25-4381-8e4b-73468ec0eebe

# Job Finder Application

A full-stack web application that helps users find and track job opportunities, with a special focus on actuarial positions. The application features automated job scraping, a modern React frontend, and a robust Flask backend.

## Features

- 🔍 Automated job scraping from actuarylist.com
- 💼 Job listing management and tracking
- 🎯 Modern, responsive user interface
- 🔄 Real-time job updates
- 🏷️ Job categorization and tagging
- 📍 Location-based job filtering

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui for UI components
- Modern responsive design

### Backend
- Flask (Python)
- PostgreSQL with Neon database
- Playwright for web scraping
- SQLAlchemy ORM
- RESTful API architecture

## Getting Started

### Prerequisites

- Node.js & npm - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Python 3.8+ - [Download Python](https://www.python.org/downloads/)
- PostgreSQL database (or Neon.tech account)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd JobFinderApp
```

2. Set up the frontend:
```bash
# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

3. Set up the backend:
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright (for job scraping)
playwright install

# Start the Flask server
python app.py
```

4. Set up the database:
- Create a PostgreSQL database
- Update the database connection string in your environment variables
- The schema will be automatically created on first run

## Job Scraping

The application includes an automated job scraper for actuarylist.com. To run the scraper:

```bash
cd backend
python scrape_actuary.py
```

This will populate your database with the latest job listings.

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
DATABASE_URL=your_database_connection_string
FLASK_SECRET_KEY=your_secret_key
```

## Development

- Frontend runs on `http://localhost:5173` by default
- Backend API runs on `http://localhost:5000`
- Use `npm run build` to create a production build
- Use `npm run lint` to run ESLint
- Use `npm run type-check` to check TypeScript types

## API Endpoints

The backend provides the following RESTful endpoints:

- `GET /api/jobs` - List all jobs
- `GET /api/jobs/<id>` - Get specific job details
- `POST /api/jobs` - Create a new job listing
- `PUT /api/jobs/<id>` - Update a job listing
- `DELETE /api/jobs/<id>` - Delete a job listing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [actuarylist.com](https://www.actuarylist.com/) for job listing data
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Playwright](https://playwright.dev/) for reliable web scraping
- [Flask](https://flask.palletsprojects.com/) for the backend framework
