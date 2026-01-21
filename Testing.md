# Testing & Edge Cases

This document describes the manual testing process and edge cases handled in the Social Media Content Scheduler application.

---

## 1. Authentication Testing

### 1.1 User Registration
-  Register with valid email and strong password → Success
-  Register with empty fields → Error shown
-  Register with existing email → Error shown
-  Password less than 8 characters → Blocked
-  Password without uppercase/lowercase/number → Blocked
-  Password stored hashed in database

### 1.2 User Login
-  Login with correct credentials → Success
-  Login with wrong password → Error shown
-  Login with non-existing email → Error shown
-  Access protected routes without token → Blocked (401)

---

## 2. Authorization Testing

-  User cannot access posts of another user
-  User cannot update/delete another user’s post
-  Invalid or expired JWT → Access denied

---

## 3. Post Management Testing

### 3.1 Create Post
-  Create post with valid content and future time → Success
-  Empty content → Blocked
-  Content longer than 500 characters → Blocked
-  Past scheduled time → Blocked
-  Invalid platform → Blocked

### 3.2 Update Post
- Update scheduled post → Success
-  Update published post → Blocked
-  Update post owned by another user → Blocked

### 3.3 Delete Post
-  Delete scheduled post → Success
-  Delete published post → Blocked
-  Delete post owned by another user → Blocked

---

## 4. Scheduling Logic Testing

-  Cron job runs every minute
-  Posts published automatically when scheduled time is reached
-  Multiple posts scheduled at same time are published in correct order
-  Posts are never published before scheduled time

---

## 5. Dashboard Testing

-  Total posts count updates on create/delete
-  Scheduled count updates correctly
-  Published count updates after cron execution
-  Dashboard refreshes automatically without page reload

---

## 6. UI & UX Testing

-  Loading states shown during API calls
-  Error messages displayed clearly
-  Success feedback via snackbar/modals
-  Responsive layout works on desktop and mobile
-  No accidental page refreshes required

---

## 7. Security Testing

-  SQL/NoSQL injection attempts blocked by sanitization
-  Direct API access without token blocked
-  Password never exposed in API responses

---

## 8. Timezone & Date Handling

-  All dates stored in UTC
-  Local timezone displayed correctly in UI
-  Past times blocked at API level

---

## Conclusion

All major user flows, edge cases, and failure scenarios were manually tested.  
The application behaves correctly under expected and unexpected inputs.
