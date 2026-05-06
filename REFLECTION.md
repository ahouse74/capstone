# Reflection

---

## Q1 — Scope Decisions

The original `BRIEF.md` laid out three core features: a point map with markers, a scrollable list of animals, and a comments section under each listing. All three made it into the final build, which I'm happy about — the scope held.

The main thing I cut was the "within a certain area" filter. The brief mentioned filtering animals by location, and the brainstorming session with Claude suggested using MongoDB's geospatial queries (`$near`, `$geoWithin`) with a GeoJSON schema. That would have required restructuring the `location` field into a proper GeoJSON point and adding a `2dsphere` index. I decided against it because it would have added significant backend complexity for a feature that wasn't strictly necessary for the app to be useful. The map itself already gives users a visual sense of where animals are.

I didn't add a `DELETE` route, which was flagged as a gap in the brainstorm. In hindsight that would have been a quick addition and would make the app more practical for real use.

---

## Q2 — Technical Challenge

The hardest problem was getting the deployed front-end on GitHub Pages to successfully communicate with the back-end on Railway.

The first issue was that the Vue router was using `createWebHistory()`, which relies on the server returning `index.html` for every URL. GitHub Pages is a static file host — it has no server to do that — so any direct navigation or page refresh returned a 404 blank screen. Switching to `createWebHashHistory()` fixed this by moving routing entirely to the client side via the `#` in the URL.

The second issue was CORS. Even after adding the correct origins to `allowedOrigins` in `server.js`, the browser was still getting blocked. After a lot of back-and-forth the root cause turned out to be that Railway's networking was configured to expose port 5000, but Railway's runtime was injecting `PORT=8080` — meaning the proxy in front of the app couldn't reach it. Updating the Railway networking port to match what the app actually bound to resolved the 502 errors.

---

## Q3 — AI and Vibe-Coding

**Where it worked well:** Setting up the Express server scaffold and Mongoose models. I described the two collections I needed — `animals` and `comments` — and Claude produced clean, well-structured schema files and route handlers that matched my API spec almost exactly. The boilerplate that would have taken me an hour to write carefully took a few minutes to review and adjust.

**Where I had to significantly debug:** The deployment process. Claude's initial suggestions for fixing the Railway 502 error were reasonable guesses, but none of them were the actual problem. I ended up working through it step by step by reading logs carefully and testing the Railway URL directly in the browser, rather than just applying suggested fixes. 

The difference taught me that AI assistance is strongest when the problem is self-contained in code it can read, and weakest when the problem involves external infrastructure or configuration state it has no visibility into. In those cases, methodical manual debugging beats following suggestions.

---

## Q4 — Architecture

**User action: submitting a new animal listing**

1. The user fills out the form in `NewListingView.vue` — name, species, description, status, photo URL — and clicks a point on the Leaflet map to drop a location pin. The coordinates are stored in component state.

2. On form submit, the Vue component calls `createAnimal(data)` from `src/api/index.js`. This function uses `fetch` to send a `POST` request to `${import.meta.env.VITE_API_URL}/api/animals` with the form data serialised as JSON in the request body.

3. The request reaches the Express server on Railway. It passes through the `cors` middleware (which checks the `Origin` header against `allowedOrigins`) and then `express.json()` (which parses the body). It hits the `POST /api/animals` route handler in `routes/animals.js`.

4. The route handler calls `Animal.create(req.body)`. Mongoose validates the data against the schema — checking that `name` and `species` are present, that `status` is one of the allowed enum values — and if valid, writes a new document to the `animals` collection in MongoDB Atlas.

5. MongoDB returns the saved document (including the generated `_id` and `createdAt` timestamp). The route handler sends it back as a `201 Created` JSON response.

6. Back in the browser, the `fetch` promise resolves. The Vue component receives the new animal object and uses `vue-router` to navigate to the listing page for that animal (`/listing/:id`), where the user immediately sees the listing they just created.

---

## Q5 — If I Had Two More Weeks

The first thing I would add is proper image upload support. Right now users have to paste a URL, which is awkward and breaks whenever the source image moves or goes offline. 

The second thing I would add is the geospatial filter that got cut from the original scope. I would update the `location` field in the Animal schema to use GeoJSON format, add a `2dsphere` index, and add a query parameter to `GET /api/animals` for radius filtering. This would make the app genuinely useful for a real community rather than just showing all animals at once regardless of where you are.