
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os
from sqlalchemy import or_, desc, asc

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///jobs.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Job model
class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    job_type = db.Column(db.String(50), nullable=False)
    tags = db.Column(db.Text)  # Comma-separated tags
    date_posted = db.Column(db.Date, nullable=False, default=datetime.utcnow().date())
    description = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': str(self.id),
            'title': self.title,
            'company': self.company,
            'location': self.location,
            'jobType': self.job_type,
            'tags': self.tags.split(',') if self.tags else [],
            'datePosted': self.date_posted.isoformat(),
            'description': self.description
        }

    @staticmethod
    def validate_data(data):
        errors = []
        if not data.get('title', '').strip():
            errors.append('Title is required')
        if not data.get('company', '').strip():
            errors.append('Company is required')
        if not data.get('location', '').strip():
            errors.append('Location is required')
        if not data.get('jobType', '').strip():
            errors.append('Job type is required')
        
        valid_job_types = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
        if data.get('jobType') not in valid_job_types:
            errors.append('Invalid job type')
        
        return errors

# Create tables
with app.app_context():
    db.create_all()
    
    # Add sample data if empty
    if Job.query.count() == 0:
        sample_jobs = [
            Job(
                title='Senior Frontend Developer',
                company='TechCorp Inc.',
                location='San Francisco, CA',
                job_type='Full-time',
                tags='React,TypeScript,JavaScript,CSS',
                description='Join our team to build amazing user experiences with React and TypeScript.'
            ),
            Job(
                title='UX/UI Designer',
                company='Creative Studios',
                location='New York, NY',
                job_type='Full-time',
                tags='Figma,Design Systems,User Research',
                description='Design beautiful and intuitive user interfaces for our web applications.'
            ),
            Job(
                title='Backend Developer',
                company='DataFlow Solutions',
                location='Remote',
                job_type='Remote',
                tags='Node.js,Python,API Design,Database',
                description='Build scalable backend services and APIs for our growing platform.'
            ),
            Job(
                title='Marketing Intern',
                company='StartupX',
                location='Austin, TX',
                job_type='Internship',
                tags='Digital Marketing,Social Media,Content Creation',
                description='Learn and contribute to our marketing efforts in a fast-paced startup environment.'
            ),
            Job(
                title='DevOps Engineer',
                company='CloudTech Solutions',
                location='Seattle, WA',
                job_type='Contract',
                tags='AWS,Docker,Kubernetes,CI/CD',
                description='Help us build and maintain our cloud infrastructure and deployment pipelines.'
            ),
            Job(
                title='Product Manager',
                company='InnovateCorp',
                location='Los Angeles, CA',
                job_type='Full-time',
                tags='Product Strategy,Agile,Analytics,Leadership',
                description='Lead product development and strategy for our flagship applications.'
            )
        ]
        
        for job in sample_jobs:
            db.session.add(job)
        db.session.commit()

# Routes

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    try:
        query = Job.query
        
        # Filtering
        keyword = request.args.get('keyword')
        if keyword:
            query = query.filter(
                or_(
                    Job.title.ilike(f'%{keyword}%'),
                    Job.company.ilike(f'%{keyword}%')
                )
            )
        
        job_type = request.args.get('jobType')
        if job_type and job_type != 'All':
            query = query.filter(Job.job_type == job_type)
        
        location = request.args.get('location')
        if location and location != 'All':
            query = query.filter(Job.location.ilike(f'%{location}%'))
        
        tags = request.args.getlist('tags')
        if tags:
            for tag in tags:
                query = query.filter(Job.tags.ilike(f'%{tag}%'))
        
        # Sorting
        sort_by = request.args.get('sortBy', 'date_desc')
        if sort_by == 'date_desc':
            query = query.order_by(desc(Job.date_posted))
        elif sort_by == 'date_asc':
            query = query.order_by(asc(Job.date_posted))
        elif sort_by == 'title_asc':
            query = query.order_by(asc(Job.title))
        elif sort_by == 'company_asc':
            query = query.order_by(asc(Job.company))
        
        jobs = query.all()
        return jsonify([job.to_dict() for job in jobs])
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    try:
        job = Job.query.get(job_id)
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        return jsonify(job.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobs', methods=['POST'])
def create_job():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate data
        errors = Job.validate_data(data)
        if errors:
            return jsonify({'error': ', '.join(errors)}), 400
        
        # Create new job
        job = Job(
            title=data['title'].strip(),
            company=data['company'].strip(),
            location=data['location'].strip(),
            job_type=data['jobType'],
            tags=','.join(data.get('tags', [])),
            description=data.get('description', '').strip()
        )
        
        db.session.add(job)
        db.session.commit()
        
        return jsonify(job.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobs/<int:job_id>', methods=['PUT'])
def update_job(job_id):
    try:
        job = Job.query.get(job_id)
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate data
        errors = Job.validate_data(data)
        if errors:
            return jsonify({'error': ', '.join(errors)}), 400
        
        # Update job
        job.title = data['title'].strip()
        job.company = data['company'].strip()
        job.location = data['location'].strip()
        job.job_type = data['jobType']
        job.tags = ','.join(data.get('tags', []))
        job.description = data.get('description', '').strip()
        
        db.session.commit()
        
        return jsonify(job.to_dict())
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    try:
        job = Job.query.get(job_id)
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        db.session.delete(job)
        db.session.commit()
        
        return '', 204
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
