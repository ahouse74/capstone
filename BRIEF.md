Stray Animal Tracker

This website is for any members of a community that care for stray animals or are looking for lost pets. Rather than sharing information through social media and word of mouth,
community members are able to view and maintain information on a live website, a much more efficient form of communication.

My idea is to create a website with 'listings' of stray animals. Key features include
  - Point map with markers where each animal was last seen
  - Scrollable list of every animal within a certain area
  - Ability to add comments/hold discussions under a certain animal listing
MongoDB Collections
  - animals: _id, name, species, description, status, photoUrl, location, createdAt
  - comments: _id, animalID, author, body, createdAt

API routes
| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/animals | List animals |
| GET | /api/animals/:id | Get a single listing |
| GET | /api/animals/:id/comments | Get comments for a listing |
| POST | /api/animals | Submit a new listing |
| POST | /api/animals/:id/comments | Submit a new comment to a listing |
| PATCH | /api/animals/:id | Update animal status |

This app does not need authentication. It's a community message board, not a bank account - users should be able to log animals quickly and easily without logging in.
