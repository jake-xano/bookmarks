// Get all categories with their nested bookmarks for the authenticated user
// Returns all categories with their nested bookmarks, sorted by sort_order
query bookmarks verb=GET {
  api_group = "bookmarks"

  input {
    // Access token for authentication
    text token?
  }

  stack {
    // Validate the access token and get user
    function.run "bookmarks/validate_token" {
      input = {token: $input.token}
    } as $user
  
    // Get all categories for this user sorted by sort_order with their bookmarks
    db.query categories {
      where = $db.categories.user_id == $user.id
      sort = {categories.sort_order: "asc"}
      return = {type: "list"}
      addon = [
        {
          name : "category_bookmarks"
          input: {category_id: $output.id, user_id: $user.id}
          as   : "bookmarks"
        }
      ]
    } as $categories
  }

  response = $categories
}