# WordPress Integration Setup

This guide helps you connect your Next.js SignalBox application to WordPress.

## Prerequisites

- WordPress site with REST API enabled (enabled by default)
- Contact Form 7 plugin installed for form submissions
- Your WordPress URL (e.g., `https://great-northern-games.com`)

## Quick Setup

### Step 1: Configure Environment Variables

Update `.env.local` with your WordPress details:

```env
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
NEXT_PUBLIC_CONTACT_FORM_ID=1
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-firebase-db.firebaseio.com/
```

**Note:** Replace `1` with your actual Contact Form 7 form ID.

### Step 2: Create a Contact Form in WordPress

1. Log in to WordPress admin
2. Go to **Contact Form 7** → **Add New**
3. Create a form with an **Email** field (field name should be `your-email`)
4. Copy the Form ID from the shortcode (e.g., `[contact-form-7 id="1" ...]`)
5. Paste this ID into `NEXT_PUBLIC_CONTACT_FORM_ID` in `.env.local`

### Step 3: Enable WordPress REST API (Usually Pre-enabled)

Most WordPress installations have REST API enabled by default. To verify:

```bash
curl https://your-wordpress-site.com/wp-json/
```

If you see JSON response, REST API is enabled.

### Step 4: Test the Integration

The application will automatically:

- Submit playtest signups to your WordPress Contact Form 7
- Fall back to Firebase if WordPress is unavailable
- Fetch posts from WordPress (or Firebase as fallback)

## Features Implemented

### 1. **Playtest Signup Form**

- Located in: `components/SignupForm.js`
- Submits email to Contact Form 7
- Uses utility function: `lib/wordpress.js`

### 2. **Posts Integration**

- Located in: `app/posts/page.js`
- Fetches posts from WordPress REST API
- Falls back to Firebase if WordPress is unavailable
- Automatically converts WordPress data format

### 3. **WordPress Utility Library**

- Located in: `lib/wordpress.js`
- Provides reusable functions:
  - `submitContactForm(email)` - Submit form to CF7
  - `getWordPressPosts(options)` - Fetch posts
  - `getWordPressPost(postId)` - Fetch single post

## Advanced Setup

### Option A: Custom WordPress Endpoint

If you want more control, create a custom endpoint in WordPress:

```php
// Add to your WordPress theme's functions.php
add_action('rest_api_init', function () {
    register_rest_route('signalbox/v1', '/signup', array(
        'methods' => 'POST',
        'callback' => 'handle_signalbox_signup',
        'permission_callback' => '__return_true'
    ));
});

function handle_signalbox_signup($request) {
    $email = sanitize_email($request->get_param('email'));

    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email address', array('status' => 400));
    }

    // Save email to database or send notification
    // Example: Send email to admin
    wp_mail(
        'admin@example.com',
        'New Playtest Signup',
        'Email: ' . $email
    );

    return array(
        'success' => true,
        'message' => 'Successfully subscribed'
    );
}
```

Then update `.env.local`:

```env
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
```

And update `lib/wordpress.js`:

```javascript
export async function submitContactForm(email) {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/signalbox/v1/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
```

### Option B: Use Mailchimp or Newsletter Plugin

If using a newsletter plugin, update the endpoint in `lib/wordpress.js` to match your plugin's API.

## Troubleshooting

### Contact Form Not Submitting

1. Check that Contact Form 7 is installed and activated
2. Verify the Form ID is correct in `.env.local`
3. Ensure the email field name is `your-email` in the CF7 form
4. Check browser console for error messages

### WordPress REST API Disabled

If REST API is disabled, enable it by adding to `wp-config.php`:

```php
define('REST_API_ENABLED', true);
```

Or verify in WordPress Settings → Permalinks that a permalink structure is selected.

### CORS Issues

If you get CORS errors, you may need to install a CORS plugin:

- [Enable CORS](https://wordpress.org/plugins/enable-cors/)
- [CORS Enabler](https://wordpress.org/plugins/cors-enabler/)

Or add to WordPress `.htaccess`:

```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
</IfModule>
```

## Testing

### Manual API Test

Test your Contact Form 7 endpoint:

```bash
curl -X POST https://your-wordpress-site.com/wp-json/contact-form-7/v1/contact-forms/1/feedback \
  -H "Content-Type: application/json" \
  -d '{"your-email":"test@example.com"}'
```

### Fetch Posts Test

```bash
curl https://your-wordpress-site.com/wp-json/wp/v2/posts?per_page=5
```

## Next Steps

- Configure additional WordPress pages/sections
- Add more form fields to Contact Form 7
- Create custom post types in WordPress
- Set up WordPress categories/tags filtering
