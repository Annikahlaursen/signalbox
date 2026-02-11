# WordPress Integration Setup

## Option 1: Contact Form 7 (Recommended)

1. Install Contact Form 7 plugin in WordPress
2. Create a new form and get the Form ID
3. Update `NEXT_PUBLIC_WORDPRESS_URL` in `.env.local`:
   ```
   NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
   ```
4. Update `YOUR_FORM_ID` in `components/SignupForm.js` with your actual form ID

## Option 2: Custom WordPress REST API Endpoint

Create a custom endpoint in WordPress:

```php
// Add to your theme's functions.php
add_action('rest_api_init', function () {
    register_rest_route('signalbox/v1', '/signup', array(
        'methods' => 'POST',
        'callback' => 'handle_signup',
        'permission_callback' => '__return_true'
    ));
});

function handle_signup($request) {
    $email = sanitize_email($request->get_param('email'));

    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email address', array('status' => 400));
    }

    // Save to database or send to email service
    // Example: Add to WordPress users or a custom table

    return array(
        'success' => true,
        'message' => 'Successfully subscribed'
    );
}
```

Then update `components/SignupForm.js`:

```javascript
const response = await fetch(`${wordpressUrl}/wp-json/signalbox/v1/signup`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: email,
  }),
});
```

## Option 3: Mailchimp/Newsletter Plugin

If using a newsletter plugin, update the endpoint to match your plugin's API.
