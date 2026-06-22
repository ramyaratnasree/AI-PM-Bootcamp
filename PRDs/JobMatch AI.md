# Product Requirements Document (PRD)

# JobMatch AI

# Version
v1.0 (MVP)

# Author
Ramya Ratna Sree Athukuri

# Status
Draft

# 1. Problem Statement
Job seekers spend significant time searching for jobs, reading lengthy job descriptions, evaluating whether they are qualified, tailoring resumes, and applying to positions with uncertain chances of getting shortlisted.

This repetitive process is time-consuming, mentally exhausting, and often results in applications to low-fit opportunities.

Current AI resume tools solve only one part of the workflow (resume generation) rather than helping users make better application decisions.

# 2. Vision
Help job seekers spend less time applying and more time interviewing by using AI to identify the best opportunities and personalize every application.

# 3. Goal
Primary Goal
Increase the likelihood of job seekers getting shortlisted by helping them apply only to highly relevant jobs with tailored resumes.

Success looks like:
> "Instead of applying to 100 jobs randomly, users apply to 20 highly relevant jobs with personalized resumes."

# 4. Background
Job seekers today typically:

* Search multiple job portals
* Read lengthy job descriptions
* Manually compare skills
* Wonder if they qualify
* Modify resumes repeatedly
* Apply
* Wait for responses
* Repeat the process

Most of this work is repetitive and can be assisted by AI.

# 5. Target Users

## Primary Users
See Projects\JobMatch AI\User_Personas.md for full profiles.
Primary persona: **Sarah Chen** (laid-off PM, high-volume applicant).
Professionals with 3–8 years of experience actively looking for jobs.

Examples
* Product Managers
* Software Engineers
* Data Analysts
* UX Designers

## Secondary Users
* Career changers
* Fresh graduates
* Professionals returning after a career break

# 6. User Journey (Current State)
Need a new job
↓
Search LinkedIn
↓
Search Naukri
↓
Search Indeed
↓
Open dozens of job descriptions
↓
Read each job description
↓
Wonder if qualified
↓
Compare skills manually
↓
Modify resume
↓
Apply
↓
Wait
↓
Repeat

# 7. Pain Points

## Pain 1
Reading hundreds of job descriptions takes hours.

## Pain 2
Users don't know whether they're a good fit.

## Pain 3
Users don't understand why they aren't a match.

## Pain 4
Tailoring resumes for every application is repetitive.

## Pain 5
Users don't know which resume sections to change.

## Pain 6
Users apply to low-probability jobs.

## Pain 7
Users don't know which jobs deserve their limited time.

# 8. Jobs To Be Done
## Functional Job
Help me find jobs that best match my experience and generate tailored resumes.

## Emotional Job
Reduce anxiety during job searching.
Increase confidence before applying.

## Social Job
Present myself professionally to recruiters.

# 9. User Stories
### Story 1
As a job seeker,
I want to upload my resume
so the system understands my experience.

### Story 2 (Not in MVP)
As a job seeker,
I want to define my preferences
so only relevant jobs are recommended.

Examples:
* Location
* Remote
* Salary
* Role
* Industry

### Story 3 (Not in MVP)
As a job seeker,
I want AI to recommend matching jobs
so I don't waste time searching manually.

### Story 4
As a job seeker,
I want to paste job description and understand why a job matches
so I can confidently decide whether to apply.

### Story 5
As a job seeker,
I want AI to identify missing skills
so I know where I fall short.

### Story 6
As a job seeker,
I want AI to tailor my resume
so I increase my chances of getting shortlisted.

### Story 7
As a job seeker,
I want to download my tailored resume
so I can immediately apply.

# 10. MVP Scope
## Included
* Resume Upload
* Resume Parsing
* Extract Skills
* Paste Job Description
* Match Resume vs JD
* Match Score
* Missing Skills
* Tailored Resume

## Not Included
* Capture User Preferences
* Interview preparation
* Cover letter generation
* Application tracking
* Networking
* LinkedIn optimization

These can be future releases.

# 11. Functional Requirements

### Resume Upload
User uploads PDF/DOCX.

System extracts:

* Skills
* Experience
* Education
* Projects
* Certifications

### Job Matching

Input

* Resume
* Job Description

Output

* Match %
* Reasons
* Recommendation

Example
Match Score - 87% Strong Match
Reasons: Product Strategy, Roadmapping, AI Products
Missing: Marketplaces, SQL, A/B Testing

### Resume Tailoring

System should:

* Recommend keywords
* Improve bullet points
* Highlight relevant experience
* Preserve truthful information
* Never fabricate experience.

# 12. Non-Functional Requirements

Response time: <40 seconds
Availability: 90%
Security: Encrypted resumes, Delete user data on request
Privacy: No resumes used for training without consent

# 13. User Flow

Landing Page
↓
Upload Resume
↓
AI extracts profile
↓
Paste Job description
↓
View Match Report
↓
Saves/shortlists jobs
↓
Generate Tailored Resume
↓
Download Resume
↓
Apply

# 14. Competitive Analysis
See Projects\JobMatch AI\Competitive_Analysis.md for full analysis.
Key insight: the market gap is **decision support**, not faster applying.

# 15. Metrics
North Star Metric:
% of users who tailored ≥3 resumes and returned to the product within 7 days.

Business Metrics:
* Daily Active Users
* Resume uploads
* Tailored resumes generated
* Returning users

User Metrics:
* Time spent finding jobs
* Average match score
* Applications submitted
* Interview invitations (self-reported)

AI Metrics:
* Resume parsing accuracy
* Skill extraction accuracy
* Job matching accuracy
* Resume tailoring quality (thumbs up/down)

# 16. Risks

* AI may incorrectly evaluate job fit.
* Generated resumes may over-optimize keywords while reducing readability.
* Job descriptions differ significantly across companies.
* LLMs may hallucinate experience.

Mitigation:

* Show explanations for every recommendation.
* Never invent skills or experience.
* Allow users to review and edit before downloading.

# 17. Future Roadmap

## Phase 2

* User preferences
* Auto-import jobs from LinkedIn/Naukri
* Cover letter generation
* Resume version management

## Phase 3

* Application tracker
* Interview preparation
* Recruiter insights
* Salary benchmarking

## Phase 4

* AI Career Coach
* Learning recommendations for missing skills
* Personalized job search strategy
* Weekly application reports

# 18. Open Questions

1. How should the system fetch job descriptions (manual paste vs. integrations)?
2. What factors should contribute to the match score (skills, experience, location, seniority, domain)?
3. Should users be able to customize the importance of different criteria?
4. How can we measure whether the tailored resume actually improves interview callbacks?
5. How do we explain AI recommendations in a way users trust?