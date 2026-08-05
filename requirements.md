# SaaS Requirements Draft: Sri Lankan O/L Exam Practice Platform

## 1. Product Vision

The application helps Sri Lankan O Level students improve exam performance by breaking past papers into individual questions, mapping each question to syllabus topics, and allowing students to practice weak areas through assessments, automated grading, lessons, notes, feedback, and progress tracking.

The first version will focus on **English-medium Sri Lankan O Level Mathematics and Science**.

The MVP should be **student-first**. Teacher features should be treated as **P1**, meaning they are important but not required for the first student-facing launch.

---

## 2. Core Goal

Enable O Level students to identify weak topics and improve through:

* Practicing past-paper questions by topic
* Taking assessments
* Creating custom assessments
* Uploading answer sheets for grading
* Receiving marks and detailed feedback
* Reviewing lessons, notes, and syllabus-change posts
* Tracking progress through a playful, gamified interface

---

## 3. Release Scope

## 3.1 MVP Scope

The MVP should focus on:

1. Sri Lankan O Level only
2. English medium only
3. Mathematics and Science only
4. Student accounts
5. Admin accounts
6. Public question bank
7. Automatic extraction of questions from PDF past papers
8. Support for both clean digital PDFs and scanned PDFs
9. Separate workflow for extracting marking schemes
10. AI-filled question metadata
11. Admin one-by-one review of every extracted question
12. Admin review of marking schemes
13. Student access to public questions, subject to plan limits
14. Student-created self-assessments
15. Auto-grading for all question types
16. Student ability to rate AI grading
17. Student ability to challenge an AI grade
18. Optional handwritten answer upload
19. Marks plus detailed feedback
20. Weak-topic detection
21. Progress tracking
22. Global leaderboards
23. Student leaderboard privacy controls
24. Avatars, badges, and levels
25. Playful gamification
26. Admin-created global lessons and notes
27. Admin-only syllabus-change posts
28. Monthly paid student plan
29. Limited student free tier
30. Beta launch discount
31. Basic moderation
32. Web app only
33. No mobile app

---

## 3.2 P1 Scope: Teacher Features

Teacher features are important, but should be moved to P1 rather than MVP.

P1 should include:

1. Teacher accounts
2. Teacher monthly subscription
3. Teacher public profiles
4. Teacher reviews
5. Teacher classes
6. Students joining multiple teacher classes
7. Teacher-created class-only assessments
8. Teacher-created class-wide notes/messages
9. Manual teacher grading
10. Teacher override of auto-grades
11. Rubric-based manual grading
12. Class leaderboards
13. Teacher-filtered class leaderboards
14. Teacher student analytics
15. Teacher revenue-sharing opt-in
16. Teacher address and bank account collection for revenue sharing
17. Teacher discovery inside the app

---

## 3.3 Later/Future Scope

Possible future features:

1. A Level support
2. Sinhala and Tamil language support
3. More subjects
4. School accounts
5. Parent accounts
6. Offline practice mode
7. Advanced handwritten answer recognition
8. Teacher marketplace
9. Premium teacher content marketplace
10. Paid class/cohort hosting
11. Tutor discovery improvements
12. Student referrals
13. Adaptive learning paths
14. Exam simulation mode
15. Advanced analytics for teachers
16. Public API for content partners
17. More advanced moderation
18. Student discussion forums, if safety controls are strong enough
19. Cloudflare R2 for larger-scale object storage
20. Cloudflare Workers for edge APIs or background processing

---

# 4. User Types

## 4.1 Students

Students are the primary MVP users.

Expected student age range: **14–18**.

### Student Data Stored

The platform should store only the following personal details for students:

1. Name
2. Email address
3. Date of birth

No private DMs should be supported in the MVP.

### Student Capabilities in MVP

Students should be able to:

1. Create an account and log in
2. Choose O Level subjects
3. Choose Mathematics and/or Science
4. Access public questions in their selected subjects, subject to plan limits
5. Take public assessments
6. Create self-assessments
7. Practice questions by topic
8. Upload answer sheets for questions or assessments, if they want
9. Submit typed, selected, or uploaded answers depending on question format
10. Receive automated grading
11. Receive marks and detailed feedback
12. Rate AI grading quality
13. Challenge AI grading
14. View lessons and read notes
15. View admin-created posts about syllabus changes over the years
16. See progress by subject and topic
17. See weak topics identified by the system
18. See recommendations for what to practice next
19. Participate in gamification features
20. View global leaderboards
21. Hide themselves from global leaderboards
22. Track their own progress over time
23. Use avatars, badges, and levels

### Student Restrictions

Students should not be able to:

1. Direct-message teachers
2. Direct-message other students
3. Edit public questions or lessons
4. Create public/global content
5. Access paid-only features beyond free-tier limits
6. Affect global rankings through challenged grades

---

## 4.2 Teachers — P1

Teachers are independent tutors, not school accounts.

Teacher functionality should be added after the student-first MVP.

### Teacher Data Stored

Teachers should have standard account details needed for login and profile management.

If a teacher opts into revenue sharing, the platform must also collect:

1. Address
2. Bank account details

Teacher financial details should only be collected when needed for payouts.

### Teacher Capabilities in P1

Teachers should be able to:

1. Create an account and log in
2. Subscribe to a monthly teacher plan
3. Create classes
4. Invite or add students to classes
5. Create class-only versions of assessments
6. Assign assessments to students or classes
7. View student submissions for their classes
8. View student performance only for data related to their classes
9. Manually grade assessments when needed
10. Override auto-grades
11. Use a marking rubric when manually grading
12. Provide marks and detailed feedback
13. Create notes/messages for the entire class
14. Add class-only questions or assessment material
15. View class performance by topic, assessment, and student
16. View and filter leaderboards for their classes
17. Maintain a public tutor profile inside the app
18. Receive reviews from students, subject to moderation
19. Opt into revenue sharing, if eligible
20. Receive payouts through bank account details, if opted into revenue sharing

### Teacher Notes / Messages

Teachers should be able to create notes as class-wide messages.

These messages should be:

1. Sent or published to the entire class
2. Visible only to students in that class
3. Linked to a subject, topic, assessment, or general class announcement where relevant
4. Editable or deletable by the teacher
5. Moderatable by admins
6. Not published globally

### Teacher Public Profiles

Teachers should have public profiles within the app.

A teacher profile may include:

1. Display name
2. Profile photo or avatar
3. Bio
4. Subjects taught
5. O Level focus areas
6. Classes or cohorts available to join
7. Ratings
8. Reviews
9. Student count or enrollment count
10. Performance highlights, if allowed
11. Verification or trust indicators, if added later

### Teacher Reviews

The platform should support reviews for teachers.

Review requirements:

1. Students should be able to review teachers they have joined or studied under
2. Reviews should be visible on teacher public profiles
3. Reviews should be reportable
4. Admins should be able to moderate reviews
5. The system should prevent obvious abuse, spam, or repeated fake reviews

### Teacher Restrictions

Teachers should not be able to:

1. Publish global questions directly
2. Publish global lessons or notes
3. Publish syllabus-change posts
4. See student data unrelated to their classes
5. Message students privately through DMs
6. Manage global subjects, syllabuses, or platform-wide content

---

## 4.3 Admins

Admins manage the global platform content and rules.

### Admin Capabilities in MVP

Admins should be able to:

1. Upload O Level Mathematics and Science past papers
2. Upload marking schemes
3. Run automatic question extraction from PDFs
4. Run automatic marking scheme extraction as a separate workflow
5. Review extracted questions one by one
6. Review marking schemes one by one
7. Edit extracted questions
8. Edit AI-filled metadata
9. Add global questions
10. Manage the public question bank
11. Manage subjects
12. Manage syllabuses
13. Manage topics and subtopics
14. Manage question metadata
15. Create global lessons and notes
16. Publish syllabus-change posts
17. Manage users
18. Moderate reviews, reports, and content once those features exist
19. Configure free-tier and paid-plan limits
20. Manage monthly subscription plans
21. View platform-wide analytics

---

# 5. Main Functional Areas

## 5.1 Past Paper PDF Processing

The system should support automatic extraction of questions from Sri Lankan O Level Mathematics and Science past-paper PDFs.

### Supported PDF Quality

The system should support both:

1. Clean digital PDFs
2. Scanned PDFs

This means the extraction workflow must handle OCR, image-based pages, diagrams, tables, equations, and inconsistent formatting.

### AI Provider

All AI work should use **Gemini**.

Gemini may be used for:

1. PDF question extraction
2. OCR or document understanding
3. Question segmentation
4. Topic classification
5. Subtopic classification
6. Difficulty estimation
7. Marking scheme interpretation
8. Auto-grading
9. Feedback generation
10. Suggested practice recommendations
11. Metadata generation

### Requirements

Admins should be able to:

1. Upload a past-paper PDF
2. Automatically detect and split the paper into individual questions
3. Extract question text
4. Extract images, diagrams, equations, tables, and figures where possible
5. Preserve question numbering
6. Store each question separately
7. Auto-fill all available metadata
8. Review and correct each extracted question before publishing
9. Approve questions one by one
10. Link questions back to the original past paper
11. Run marking scheme extraction as a separate workflow
12. Review marking scheme data before using it for grading

### Required Metadata

Each extracted question should have metadata auto-filled before admin review.

Required metadata:

1. Education level: O Level
2. Subject: Mathematics or Science
3. Medium: English
4. Syllabus
5. Year
6. Paper type
7. Question number
8. Topic
9. Subtopic
10. Difficulty level
11. Marks
12. Source paper
13. Answer scheme or marking rubric, if available
14. Question format:

* Multiple-choice
* Structured
* Short answer
* Essay-style
* Calculation-based
* Diagram-based
* Mixed

### Admin Review

Every question must go through admin review before becoming public.

Admin review requirements:

1. Questions are reviewed one by one
2. Admins can edit extracted text
3. Admins can edit images, diagrams, and attachments
4. Admins can edit all metadata
5. Admins can attach or correct marking scheme guidance
6. Admins can approve, reject, or archive each question
7. Admins can see the original PDF context while reviewing

### Important MVP Risk

Automatic PDF extraction is a core MVP feature, but it is technically risky because past papers may contain:

1. Scanned pages
2. Poor OCR quality
3. Diagrams
4. Equations
5. Tables
6. Multi-part questions
7. Marking schemes with inconsistent formatting

Because every question is reviewed by admins, extraction does not need to be perfect. It needs to be good enough to reduce manual data entry significantly.

---

## 5.2 Marking Scheme Workflow

Marking scheme extraction can be a separate workflow from question extraction.

### Requirements

Admins should be able to:

1. Upload a marking scheme PDF
2. Run AI extraction on the marking scheme
3. Match marking scheme sections to existing questions
4. Review marking scheme extraction one by one
5. Edit extracted model answers
6. Edit mark allocation
7. Edit grading guidance
8. Approve marking scheme entries
9. Link approved marking schemes to questions

### Marking Scheme Use

Marking schemes should be used:

1. As guidance for auto-grading
2. As guidance for feedback generation
3. As guidance for teacher manual grading in P1
4. As a reference for admins during review

---

## 5.3 Question Bank

The platform should contain a reusable public question bank.

### Requirements

Each public question should have:

1. Question text
2. Images, diagrams, tables, or attachments if needed
3. Subject
4. Topic and subtopic
5. Syllabus mapping
6. Source paper
7. Year
8. Marks
9. Difficulty level
10. Model answer or marking scheme, if available
11. Grading guidance
12. Tags
13. Question format
14. Visibility:

* Public
* Draft
* Archived

15. Status:

* Extracted
* Needs review
* Approved
* Rejected
* Archived

### Public Question Rules

1. Public questions are created and published by admins only.
2. Public questions must be admin-approved one by one.
3. Students can access public questions, subject to free-tier or paid-plan limits.
4. Teacher-created class-only questions should be added in P1.

---

## 5.4 Assessments

Students should be able to create and take assessments in the MVP.

Teacher-created class assessments should be P1.

## 5.4.1 Student-Created Assessments — MVP

Students should be able to create assessments by selecting:

1. Subject
2. Topic or topics
3. Number of questions
4. Difficulty
5. Question format
6. Time limit
7. Past-paper year range, if desired
8. Randomized or manually selected questions

The system should also suggest assessments based on weak topics.

## 5.4.2 Teacher-Created Assessments — P1

Teachers should be able to:

1. Create assessments for a class
2. Select public questions manually
3. Create class-only questions
4. Generate assessments automatically by topic, difficulty, or format
5. Set time limits
6. Set due dates
7. Assign assessments to one or more classes
8. View submissions
9. Grade manually where needed
10. Override auto-grades
11. Use rubrics when manually grading
12. Provide detailed feedback

---

## 5.5 Answer Submission and Grading

Answer submission and grading are core features of the platform.

### Student Submission Methods

Students should be able to submit answers through one or more of the following:

1. Multiple-choice selection
2. Typed text
3. Numerical answer input
4. Image upload
5. PDF upload
6. Handwritten answer sheet upload

Handwritten upload should be supported in the MVP, but students should not be forced to use it.

### Grading Requirements

All question types should be eligible for auto-grading.

The system should support:

1. Auto-grading as a main MVP feature
2. Auto-grading for global/public questions
3. Marks plus detailed feedback
4. Marking scheme guidance if available
5. Student rating of AI grading quality
6. Student challenge of AI grading
7. Teacher manual grading and override in P1

### Auto-Grading Behavior

For global/public questions:

1. Auto-grading should be fully automatic
2. There should be no confidence threshold that triggers manual review
3. Students should be able to rate AI grading quality
4. Students should be able to challenge an AI grade
5. Challenged grades may affect the student’s personal metrics if corrected
6. Challenged grades should not affect global rankings
7. AI grading cost should not be limited by student plan

### Grading Statuses

Submissions should have statuses such as:

1. Not started
2. In progress
3. Submitted
4. Auto-graded
5. Challenged
6. Challenge reviewed
7. Returned to student
8. Needs resubmission

P1 teacher-related statuses may include:

1. Needs manual review
2. Manually graded
3. Teacher overridden

### Auto-Grading Requirements

The auto-grading system should be able to handle:

1. Multiple-choice answers
2. Short text answers
3. Numerical answers
4. Structured answers
5. Essay-style answers
6. Calculation-based answers
7. Diagram-based answers where possible
8. Uploaded handwritten answers where OCR or vision-based evaluation is possible

### Gemini-Based Auto-Grading

Gemini should be used for AI grading and feedback generation.

The grading system should consider:

1. Student answer
2. Question text
3. Expected answer
4. Marking scheme, if available
5. Marks allocated
6. Subject
7. Topic
8. Question format
9. Prior examples or rubric rules, if available

### AI Grading Rating

Students should be able to rate AI grading.

Possible rating options:

1. Accurate
2. Mostly accurate
3. Somewhat wrong
4. Completely wrong

The rating should be stored for quality monitoring.

### AI Grade Challenge

Students should be able to challenge an AI grade.

Challenge requirements:

1. Student can submit a reason for the challenge
2. Challenge is stored separately from the original grading result
3. Challenge may trigger admin review, later automation, or future teacher review
4. Any correction should affect only the student’s personal metrics
5. Corrections from challenges should not affect global leaderboard rankings
6. Challenge data should be used to improve grading prompts, rubrics, and model evaluation

### Feedback Requirements

Students should receive:

1. Marks earned
2. Total marks
3. Correct/incorrect indication where applicable
4. Explanation of mistakes
5. Suggested model answer
6. Topic-level weakness signal
7. Recommended lessons or questions to attempt next

---

## 5.6 Weak Topic Detection

The system should identify topics where students are weak.

### Requirements

The system should track:

1. Questions attempted
2. Correct and incorrect answers
3. Marks earned
4. Total possible marks
5. Time taken
6. Topic-level performance
7. Subtopic-level performance
8. Assessment-level performance
9. Improvement over time
10. Repeated mistakes
11. Confidence or mastery level per topic
12. Exam topic coverage
13. Exam question coverage

### Student View

The system should show students:

1. Strong topics
2. Weak topics
3. Improving topics
4. Topics needing urgent revision
5. Recommended questions
6. Recommended assessments
7. Recommended lessons or notes
8. Progress graphs
9. Practice streaks
10. Mastery levels
11. Coverage by exam topic
12. Coverage by exam questions

---

## 5.7 Lessons, Notes, and Syllabus Posts

Students should be able to read admin-created learning material.

### Global Lessons and Notes

Admins should be able to create global lessons and notes.

Global content should be available to students based on their selected subject and plan limits.

### Lesson Requirements

The platform should support:

1. Lessons by subject, syllabus, and topic
2. Notes linked to specific topics
3. Examples and explanations
4. Optional videos or external resources
5. Links from questions to related lessons
6. Admin-created global notes

### Syllabus Change Posts

Only admins should be able to create syllabus-change posts.

The system should support:

1. Posts by subject
2. Posts for O Level Mathematics and Science
3. Posts comparing syllabus changes between years
4. Admin-published syllabus updates
5. Searchable and filterable syllabus posts
6. Linking syllabus-change posts to affected topics and questions

Teacher class messages should be P1.

---

## 5.8 Gamification

The student UI should be playful and game-like while still supporting serious learning.

### Gamification Goals

The gamification system should:

1. Motivate consistent practice
2. Help students track improvement
3. Encourage topic mastery
4. Allow some healthy competition
5. Avoid making competition the only focus

### MVP Gamification Features

The MVP should include:

1. Points
2. Avatars
3. Badges
4. Levels
5. Global leaderboards
6. Personal progress tracking
7. Topic mastery tracking
8. Exam topic coverage
9. Exam question coverage

### Points

Students should earn points for answering questions.

Possible points rules:

1. Award points for each answered question
2. Award bonus points for correct answers
3. Award bonus points for difficult questions
4. Award bonus points for completing a topic
5. Award bonus points for improving a weak topic
6. Award streak bonuses

Exact scoring weights are still open.

### Leaderboards

The platform should support multiple leaderboard views for students:

1. Total points
2. Weekly points
3. Topic mastery
4. Assessment scores
5. Exam topic coverage
6. Exam question coverage

### Global Leaderboard Privacy

Students should be able to hide themselves from global leaderboards.

When hidden:

1. The student can still earn points
2. The student can still track personal progress
3. The student should not appear publicly in global ranking views
4. Their data may still be included anonymously in aggregate statistics

### P1 Class Leaderboards

Class leaderboards should be added in P1.

Teachers should be able to filter class leaderboards by:

1. Date range
2. Topic
3. Assessment
4. Points
5. Mastery
6. Coverage
7. Score

---

## 5.9 Payments and Plans

The platform should be paid from the start.

### Billing Period

Payments should be monthly.

### Pricing Model

The product should use fixed monthly costs.

The ideal pricing direction is:

1. Student monthly plan
2. Teacher monthly plan
3. Same or similar price for students and teachers
4. Discount during beta launch

### Paying Users

MVP paying user type:

1. Students

P1 paying user type:

1. Teachers

Schools are not included in the MVP.

### Student Free Tier

Students should have a free tier with limitations.

Possible free-tier limits:

1. Limited number of subjects
2. Limited number of questions per day or month
3. Limited number of assessments
4. Limited access to detailed feedback
5. Limited access to lessons or notes
6. Limited progress history
7. Limited leaderboard participation

Auto-grading cost should not be directly limited by student plan.

### Student Paid Tier

Student paid plans may unlock:

1. Full access to supported subjects
2. More questions
3. Unlimited or higher assessment limits
4. Full feedback
5. Full progress analytics
6. Full lesson and note access
7. More gamification features
8. Advanced weak-topic recommendations

### Teacher Paid Tier — P1

Teachers should pay monthly to access teacher features.

After subscribing, teachers should not face additional fees for class-management tools.

Teacher paid access may include:

1. Class creation
2. Student management
3. Assessment assignment
4. Manual grading workflows
5. Class analytics
6. Class-wide messages
7. Class-only assessments
8. Class leaderboards
9. Teacher public profile
10. Review collection
11. Revenue-sharing eligibility, if opted in

---

## 5.10 Teacher Discovery, Reviews, and Revenue Sharing — P1

Teacher discovery, reviews, and revenue sharing should be P1.

### Teacher Discovery Requirements

The app should support:

1. Public teacher profiles
2. Search by subject
3. Search by topic or focus area
4. Teacher ratings
5. Teacher reviews
6. Public class or cohort listings, if enabled
7. Teacher reputation indicators

### Review Requirements

The app should support:

1. Student reviews of teachers
2. Star ratings or equivalent scoring
3. Written reviews
4. Review moderation
5. Reporting inappropriate reviews
6. Preventing duplicate reviews from the same student for the same teacher/class
7. Admin removal of abusive or fake reviews

### Teacher Revenue Sharing

Teachers may opt into revenue sharing.

If a teacher opts into revenue sharing, the platform should collect:

1. Address
2. Bank account details

Revenue sharing may apply to:

1. Paid classes
2. Paid cohorts
3. Premium teacher content
4. Student subscriptions attributed to a teacher
5. Referral-based earnings

Exact revenue-sharing rules are still open.

---

## 5.11 Moderation and Safety

The platform serves students aged 14–18.

### Communication Rules

1. No private student-teacher DMs in the MVP
2. No student-to-student private messaging in the MVP
3. Teacher messages should be class-wide only in P1
4. Teacher feedback should be attached to assessments, submissions, or class-wide messages in P1

### Parent Consent

Parent consent is not required for MVP based on the current product assumption, because the platform is educational and does not include private DMs.

This should be reviewed before launch based on the final legal jurisdiction, payment model, age handling, and data collection practices.

### Moderation

The platform should include basic moderation.

Basic moderation may include:

1. Report content
2. Admin review queue
3. Remove inappropriate notes, posts, class messages, reviews, or profile content
4. Block abusive accounts
5. Prevent inappropriate usernames or profile content
6. Audit logs for admin actions
7. Review AI grading challenge reports
8. Review AI grading quality ratings

---

# 6. Technical Requirements

## 6.1 AI Provider

All AI-powered features should use **Gemini**.

Gemini should be used for:

1. PDF extraction
2. OCR / document understanding
3. Question segmentation
4. Topic classification
5. Subtopic classification
6. Difficulty estimation
7. Metadata generation
8. Marking scheme interpretation
9. Auto-grading
10. Feedback generation
11. Weak-topic recommendations
12. Practice recommendations

## 6.2 Frontend

The web application should be built using:

1. React JS
2. Tailwind CSS
3. shadcn/ui

The product should be a web app only.

No mobile app is planned.

## 6.3 Backend and Database

The backend should use:

1. Supabase
2. Supabase Auth
3. Supabase Postgres
4. Supabase Storage, if suitable for storing uploads
5. Supabase Row Level Security for access control

Supabase should support:

1. Student accounts
2. Admin accounts
3. Teacher accounts in P1
4. Public question bank data
5. Past-paper import jobs
6. Marking scheme import jobs
7. Assessment data
8. Submission data
9. Grading data
10. AI grading ratings
11. AI grading challenges
12. Progress and mastery data
13. Gamification data
14. Payment/subscription state
15. Teacher profile and review data in P1
16. Revenue-sharing payout details in P1

## 6.4 Hosting

The web app should be hosted using:

1. Cloudflare Pages

Possible Cloudflare usage:

1. Static/frontend hosting
2. CDN
3. Edge caching
4. Basic security protections
5. Cloudflare Workers if server-side functions are needed later

## 6.5 Storage

The system needs storage for:

1. Past-paper PDFs
2. Marking scheme PDFs
3. Extracted question assets
4. Diagrams and images
5. Student uploaded answer sheets
6. Lesson attachments, if any
7. Teacher profile images in P1

Potential storage options:

1. Supabase Storage
2. Cloudflare R2, if later preferred for object storage

---

# 7. Roles and Permissions

## 7.1 MVP Roles

| Feature                            | Student |    Admin |
| ---------------------------------- | ------: | -------: |
| Create account                     |     Yes |      Yes |
| Choose subjects                    |     Yes | Optional |
| Access public questions            |     Yes |      Yes |
| Take assessments                   |     Yes |      Yes |
| Create self-assessments            |     Yes |      Yes |
| Upload answer sheets               |     Yes |      Yes |
| Receive auto-grading               |     Yes |      Yes |
| Rate AI grading                    |     Yes |      Yes |
| Challenge AI grading               |     Yes |      Yes |
| Receive marks and feedback         |     Yes |      Yes |
| View global lessons/notes          |     Yes |      Yes |
| View syllabus-change posts         |     Yes |      Yes |
| View global leaderboard            |     Yes |      Yes |
| Hide from global leaderboard       |     Yes |       No |
| Use avatars, badges, and levels    |     Yes | Optional |
| Add global questions               |      No |      Yes |
| Publish public questions           |      No |      Yes |
| Upload and process past papers     |      No |      Yes |
| Upload and process marking schemes |      No |      Yes |
| Review questions one by one        |      No |      Yes |
| Review marking schemes one by one  |      No |      Yes |
| Manage subjects                    |      No |      Yes |
| Manage syllabuses                  |      No |      Yes |
| Manage users                       |      No |      Yes |
| Moderate content                   |      No |      Yes |

## 7.2 P1 Teacher Roles

| Feature                         | Student |          Teacher |    Admin |
| ------------------------------- | ------: | ---------------: | -------: |
| Join classes                    |     Yes |               No | Optional |
| Create classes                  |      No |              Yes |      Yes |
| Add students to classes         |      No |              Yes |      Yes |
| Create class-wide messages      |      No |              Yes |      Yes |
| Create class-only assessments   |      No |              Yes |      Yes |
| View class student data         |      No |  Yes, class only |      Yes |
| Manually grade assessments      |      No |              Yes |      Yes |
| Override auto-grades            |      No |              Yes |      Yes |
| Use rubrics for grading         |      No |              Yes |      Yes |
| Create public teacher profile   |      No |              Yes | Optional |
| Receive reviews                 |      No |              Yes |       No |
| Review teachers                 |     Yes |               No |       No |
| Opt into revenue sharing        |      No |              Yes |       No |
| Provide bank account for payout |      No | Yes, if opted in |       No |

---

# 8. Updated MVP Feature List

The MVP should include:

1. Student and admin accounts
2. O Level only
3. English medium only
4. Mathematics and Science only
5. Public question bank
6. Automatic PDF question extraction using Gemini
7. Support for clean digital PDFs and scanned PDFs
8. Separate marking scheme extraction workflow
9. AI-filled question metadata
10. Admin one-by-one review of extracted questions
11. Admin one-by-one review of marking schemes
12. Topic and subtopic tagging
13. Student subject selection
14. Student access to public questions, limited by plan
15. Student-created assessments
16. Auto-grading for all question types using Gemini
17. Optional handwritten answer upload
18. Marks plus detailed feedback
19. Student rating of AI grading
20. Student challenge of AI grading
21. Challenges affect only personal metrics, not global rankings
22. Weak-topic detection
23. Student progress tracking
24. Exam topic coverage tracking
25. Exam question coverage tracking
26. Global leaderboards
27. Student ability to hide from global leaderboards
28. Points for answering questions
29. Avatars
30. Badges
31. Levels
32. Playful gamification
33. Admin-created global lessons and notes
34. Admin-created syllabus-change posts
35. Monthly student paid plan
36. Limited student free tier
37. Beta launch discount
38. Basic moderation
39. No school accounts
40. No private DMs
41. Web app only
42. No mobile app
43. React JS frontend
44. Tailwind CSS styling
45. shadcn/ui component system
46. Supabase backend/database/auth
47. Cloudflare Pages hosting

---

# 9. P1 Feature List

P1 should include:

1. Teacher accounts
2. Teacher monthly paid plan
3. Same or similar fixed monthly pricing as students
4. Teacher public profiles
5. Teacher reviews
6. Teacher discovery
7. Teacher-created classes
8. Students joining multiple classes
9. Teacher-created class-only assessments
10. Teacher-created class-wide notes/messages
11. Manual teacher grading
12. Teacher override of auto-grades
13. Rubric-based manual grading
14. Teacher class analytics
15. Class leaderboards
16. Teacher leaderboard filtering
17. Teacher revenue-sharing opt-in
18. Teacher address collection for revenue sharing
19. Teacher bank account collection for payouts
20. Admin moderation of teacher profiles, reviews, and class messages

---

# 10. Remaining Open Questions

## 10.1 Content and Exam Structure

1. Which exact Sri Lankan O Level syllabus version should the MVP target first?
2. Which past-paper years should be imported first?
3. Should Mathematics and Science both launch together, or should one subject launch first?
4. Should model answers be imported from marking schemes or written manually?
5. Should each question be mapped to one topic only, or multiple topics?

## 10.2 Auto-Grading and Challenges

6. Who reviews challenged AI grades in MVP: admins, automated re-check, or no review initially?
7. Should challenged grades have a time limit?
8. Should students be limited in how many challenges they can submit?
9. Should AI grading ratings be visible to admins only, or also summarized publicly?
10. Should repeated low-rated questions be automatically flagged for admin review?

## 10.3 Pricing

11. What should the student monthly price be?
12. What should the teacher monthly price be in P1?
13. What should the beta launch discount be?
14. How long should beta pricing last?
15. What should the student free-tier limits be?

## 10.4 Gamification

16. How many points should a student earn for answering a question?
17. Should incorrect answers earn points?
18. Should harder questions earn more points?
19. Should challenged/corrected grades affect points?
20. Should hidden students still see their own rank privately?

## 10.5 Safety, Privacy, and Moderation

21. Should usernames/profile pictures be allowed for students?
22. How long should student submissions and uploaded answer sheets be retained?
23. Who can delete student data?
24. Should uploaded answer sheets be automatically deleted after a retention period?
25. Should public leaderboard names use real names, display names, or anonymous handles?

## 10.6 Technical Architecture

26. Should Gemini calls be made through Supabase Edge Functions or a separate backend service?
27. Should large PDF extraction jobs run synchronously or through a background queue?
28. Should uploaded answer sheets be stored in Supabase Storage or Cloudflare R2?
29. Which payment provider should be used?
30. How should subscription status be synced into Supabase?
