// Delete a category and its bookmarks
// Deletes a category and all its bookmarks by ID for the authenticated user
query "categories/{id}" verb=DELETE {
  api_group = "bookmarks"

  input {
    // Access token for authentication
    text token?
  
    // ID of the category to delete
    int id
  }

  stack {
    // Validate the access token and get user
    function.run "bookmarks/validate_token" {
      input = {token: $input.token}
    } as $user
  
    // Get the existing category and verify ownership
    db.query categories {
      where = $db.categories.id == $input.id && $db.categories.user_id == $user.id
      return = {type: "single"}
    } as $existing_category
  
    precondition ($existing_category != null) {
      error_type = "inputerror"
      error = "Category not found"
    }
  
    // Delete all bookmarks in this category that belong to this user
    db.query bookmarks {
      where = $db.bookmarks.category_id == $input.id && $db.bookmarks.user_id == $user.id
      return = {type: "list"}
    } as $bookmarks_to_delete
  
    // Delete each bookmark
    foreach ($bookmarks_to_delete) {
      each as $bookmark {
        db.del bookmarks {
          field_name = "id"
          field_value = $bookmark.id
        }
      }
    }
  
    // Delete the category
    db.del categories {
      field_name = "id"
      field_value = $input.id
    }
  }

  response = {success: true, deleted_id: $input.id}
}