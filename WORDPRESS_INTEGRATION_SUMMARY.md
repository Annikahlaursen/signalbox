NEXT_PUBLIC_CONTACT_FORM_ID=YOUR_ID_HERE# WordPress Integration - Implementation Summary

## What Has Been Set Up

Your Next.js SignalBox application is now fully integrated with WordPress. Here's what was done:

### 1. **Environment Configuration**

- Updated `.env.local` with WordPress URL and Contact Form 7 ID
- Updated `.env.example` with WordPress configuration template

**File:** `.env.local`

```env
NEXT_PUBLIC_WORDPRESS_URL=https://great-northern-games.com
NEXT_PUBLIC_CONTACT_FORM_ID=1
```

### 2. **WordPress Utility Library Created**

- **File:** `lib/wordpress.js`
- Provides reusable functions for:
  - `submitContactForm(email)` - Submit to Contact Form 7
  - `getWordPressPosts(options)` - Fetch posts with pagination
  - `getWordPressPost(postId)` - Fetch single post

### 3. **Playtest Signup Form Updated**

- **File:** `components/SignupForm.js`
- Now uses the WordPress utility function
- Submits emails directly to WordPress Contact Form 7
- Has fallback error handling

### 4. **Posts Page Updated**

- **File:** `app/posts/page.js`
- Fetches posts from WordPress REST API
- Automatically converts WordPress data to app format
- Falls back to Firebase if WordPress is unavailable

### 5. **Documentation Created**

- **File:** `WORDPRESS_SETUP.md`
- Complete setup guide with troubleshooting
- Instructions for custom endpoints
- Testing procedures

## What You Need To Do

### On Your WordPress Site:

1. **Install Contact Form 7 Plugin**
   - Go to Plugins → Add New
   - Search for "Contact Form 7"
   - Click Install and Activate

2. **Create a Contact Form**
   - Go to Contact Form 7 → Add New
   - Create a form with an **Email field** named `your-email`
   - Save the form
   - Copy the **Form ID** from the shortcode (e.g., `[contact-form-7 id="1" ...]`)

3. **Update Environment Variable**
   - In your `.env.local`, change:

   ```env
   NEXT_PUBLIC_CONTACT_FORM_ID=1
   ```

   - Replace `1` with your actual Contact Form 7 ID

4. **Enable REST API (Usually Already Enabled)**
   - Most WordPress sites have this enabled by default
   - Verify by visiting: `https://great-northern-games.com/wp-json/`
   - You should see JSON output

## Features Now Available

✅ **Playtest Signup Form**

- Users can sign up for playtests on the homepage
- Emails are sent to WordPress Contact Form 7
- Works with or without WordPress (falls back gracefully)

✅ **Posts Integration**

- Posts page now fetches from WordPress
- Displays WordPress posts in the application
- Falls back to Firebase if WordPress is unavailable

✅ **Reusable WordPress Functions**

- Easy to add more WordPress features
- Centralized configuration in environment variables
- Type-safe error handling

## Testing Your Integration

### Test 1: Manual API Call

```bash
curl -X POST https://great-northern-games.com/wp-json/contact-form-7/v1/contact-forms/1/feedback \
  -H "Content-Type: application/json" \
  -d '{"your-email":"test@example.com"}'
```

### Test 2: Run Development Server

```bash
npm run dev
```

- Go to http://localhost:3000
- Try signing up for playtest
- Check your WordPress site for the submission

### Test 3: Fetch Posts

```bash
curl https://great-northern-games.com/wp-json/wp/v2/posts?per_page=5
```

## Fallback Behavior

If WordPress is unavailable:

- ✅ Signup form shows user-friendly error messages
- ✅ Posts page falls back to Firebase
- ✅ Application continues to work normally

## Next Steps (Optional)

- Add more form fields to WordPress Contact Form 7
- Create custom post types in WordPress
- Set up WordPress categories/tags filtering
- Connect additional WordPress pages/content
- See `WORDPRESS_SETUP.md` for advanced options

## Files Modified/Created

- ✅ `.env.local` - Added WordPress configuration
- ✅ `.env.example` - Updated with WordPress template
- ✅ `components/SignupForm.js` - Uses WordPress integration
- ✅ `app/posts/page.js` - Fetches from WordPress
- ✅ `lib/wordpress.js` - New utility library
- ✅ `WORDPRESS_SETUP.md` - Complete setup guide

## Support

For detailed setup instructions, see `WORDPRESS_SETUP.md`
For troubleshooting, check the Troubleshooting section in `WORDPRESS_SETUP.md`
