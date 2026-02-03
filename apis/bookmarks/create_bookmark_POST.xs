// Create a new bookmark
// Creates a new bookmark in a category for the authenticated user
query bookmarks verb=POST {
  api_group = "bookmarks"

  input {
    // Access token for authentication
    text token?
  
    // ID of the category to add the bookmark to
    int category_id
  
    // Display title of the bookmark
    text title filters=trim
  
    // URL the bookmark points to
    text url filters=trim
  
    // Custom icon URL override
    text icon_url? filters=trim
  
    // Icon type: 'favicon', 'custom', 'symbol', or 'generated'
    text icon_type? filters=trim
  
    // Symbol name identifier e.g. 'star', 'home', 'bookmark'
    text symbol_name? filters=trim
  
    // Custom color hex code override (e.g. "#f59e0b")
    text hex_color? filters=trim
  
    // Display order within the category
    int sort_order?
  }

  stack {
    // Validate the access token and get user
    function.run "bookmarks/validate_token" {
      input = {token: $input.token}
    } as $user
  
    // Verify category exists and belongs to this user
    db.query categories {
      where = $db.categories.id == $input.category_id && $db.categories.user_id == $user.id
      return = {type: "single"}
    } as $category
  
    precondition ($category != null) {
      error_type = "inputerror"
      error = "Category not found"
    }
  
    // Create the bookmark with user_id
    db.add bookmarks {
      data = {
        user_id    : $user.id
        category_id: $input.category_id
        title      : $input.title
        url        : $input.url
        icon_url   : $input.icon_url
        icon_type  : $input.icon_type
        symbol_name: $input.symbol_name
        hex_color  : $input.hex_color
        sort_order : $input.sort_order
      }
    } as $new_bookmark
  }

  response = $new_bookmark
}