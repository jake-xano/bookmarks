// Validates the access token and returns the authenticated user
// Looks up user by their bookmarks_token field
function "bookmarks/validate_token" {
  input {
    // Access token from query parameter
    text token?
  }

  stack {
    // Check if token is provided
    precondition ($input.token != null && ($input.token|strlen) > 0) {
      error_type = "accessdenied"
      error = "Access denied. Token required."
    }
  
    // Look up user by bookmarks_token
    db.query user {
      where = $db.user.bookmarks_token == $input.token
      return = {type: "single"}
    } as $user
  
    // Check if user was found
    precondition ($user != null) {
      error_type = "accessdenied"
      error = "Access denied. Invalid token."
    }
  }

  response = $user
}