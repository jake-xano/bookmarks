// Create a new category
// Creates a new category for bookmarks for the authenticated user
query categories verb=POST {
  api_group = "bookmarks"

  input {
    // Access token for authentication
    text token?
  
    // Category name
    text name filters=trim
  
    // Display order
    int sort_order?
  }

  stack {
    // Validate the access token and get user
    function.run "bookmarks/validate_token" {
      input = {token: $input.token}
    } as $user
  
    // Create the category with user_id
    db.add categories {
      data = {
        user_id   : $user.id
        name      : $input.name
        sort_order: $input.sort_order
      }
    } as $new_category
  }

  response = $new_category
}